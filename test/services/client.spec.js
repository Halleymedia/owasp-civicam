'use strict';
const Client = require('./client');
describe("ClientSpec",
  () => {

    it("uses the correct HTTP verb when the request is sent", async () => {
      //Arrange
      const client = new Client();

      //Act & Assert
      for(const verb of ['get', 'post', 'put', 'delete']) {
        const { request } = await client[verb]('/environment');
        expect(request.method).toEqual(verb.toUpperCase());
      }
    });

    it("is a frozen object", () => {
      //Arrange
      const arbitraryValue = 'blah';
      const client = new Client();

      //Act & Assert
      expect(() => client.credentials = arbitraryValue).toThrow();
      expect(() => client.defaultHeaders = arbitraryValue).toThrow();
      expect(() => client.host = arbitraryValue).toThrow();
      expect(() => client.basePath = arbitraryValue).toThrow();
    });

    it("it exposes the default credentials", () => {
      //Arrange
      const client = new Client();
      const expectedCredentials = process.env.CIVICAM_CREDENTIALS;

      //Act
      const actualCredentials = `${client.credentials.username}:${client.credentials.password}`;

      //Act & Assert
      expect(expectedCredentials).toEqual(actualCredentials);
    });


    it("defines a host, a base path, a collection of defaults headers and a set of credentials", () => {
      //Arrange
      const client = new Client();

      //Assert
      expect(client.host).toBeTruthy();
      expect(client.basePath).toBeTruthy();
      expect(client.defaultHeaders).toBeTruthy();
      expect(client.credentials).toBeTruthy();
    });

    it("invokes Civicam REST API when just the path is provided", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.host).toEqual(client.host);
      expect(request.path.indexOf(client.basePath)).toEqual(0);
    });

    it("provides the certificate and TLS connection info for secure requests", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { secure, certificate, tls } = await client.get('/environment');

      //Assert
      expect(secure).toEqual(true);
      expect(certificate).toBeTruthy();
      expect(certificate.subjectCommonName).toEqual(client.host);
      expect(certificate.issuerCertificate).toBeTruthy();
      expect(certificate.issuerCertificate.subjectCommonName).toBeTruthy();

      expect(tls).toBeTruthy();
      expect(tls.protocol).toBeTruthy();
      expect(tls.cipherMinimumVersion).toBeTruthy();
      expect(tls.cipherName).toBeTruthy();
    });

    it("does not provide certificate and TLS connection info for insecure requests", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { secure, certificate, tls } = await client.get(`http://${client.host}/${client.basePath}/environment`);

      //Assert
      expect(secure).toEqual(false);
      expect(certificate).toBeFalsy();
      expect(tls).toBeFalsy();
    });

    it("returns a JavaScript object for a JSON response", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { response } = await client.get('/environment');

      //Assert
      expect(response.data).toBeTruthy();
      expect(typeof(response.data)).toEqual('object');
    });

    it("returns a status code of 200 for a successful request", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { response } = await client.get('/environment');

      //Assert
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.success).toEqual(true);
    });

    it("returns a status code of 200 for a successful authenticated request", async () => {

      //Arrange
      const client = new Client();
      await client.login();

      //Act
      const { response } = await client.get('/tenants');

      //Assert
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.success).toEqual(true);
    });

    it("returns a status code of 401 for an anonymous request", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { response } = await client.get('/tenants');

      //Assert
      expect(response.status).toEqual(401);
      expect(response.statusText).toEqual('Unauthorized');
      expect(response.success).toEqual(false);
    });

    it("includes the authorization header when authenticated", async () => {

      //Arrange
      const client = new Client();
      await client.login();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.headers['Authorization']).toBeTruthy();
    });

    it("exposes canonicalized request headers", async () => {

      //Arrange
      const client = new Client();
      await client.login();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      for (const headerName in request.headers) {
        const fragments = headerName.split('-');
        for (const fragment in fragments) {
          expect(fragment.substr(0, 1).toUpperCase()).toBe(fragment.substr(0, 1));
          expect(fragment.substr(1).toLowerCase()).toBe(fragment.substr(1));
        }
      }
    });

    it("exposes canonicalized response headers", async () => {

      //Arrange
      const client = new Client();
      await client.login();

      //Act
      const { response } = await client.get('/environment');

      //Assert
      for (const headerName in response.headers) {
        const fragments = headerName.split('-');
        for (const fragment in fragments) {
          expect(fragment.substr(0, 1).toUpperCase()).toBe(fragment.substr(0, 1));
          expect(fragment.substr(1).toLowerCase()).toBe(fragment.substr(1));
        }
      }
      
    });

    it("removes the authorization header after logout", async () => {

      //Arrange
      const client = new Client();
      await client.login();
      client.logout();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.headers['Authorization']).toBeFalsy();
    });

    it("does not include the authorization header when anonymous", async () => {

      //Arrange
      const client = new Client();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.headers['Authorization']).toBeFalsy();
    });

    it("can make requests to any url", async () => {

      //Arrange
      const host = 'www.civicam.it';
      const client = new Client();

      //Act
      const { request, response } = await client.get(`https://${host}`);

      //Assert
      expect(response.success).toEqual(true);
      expect(request.host).toEqual(host);

    });

    it("can find files in the files directory", () => {
      
      //Arrange
      const client = new Client();
      const fileName = 'civicam.png';

      //Act
      const fileDefinition = client.file(fileName);

      //Assert
      expect(fileDefinition.name).toEqual(fileName);
    });

    it("throws for unexisting files", () => {
      
      //Arrange
      const client = new Client();

      //Act & Assert
      expect(() => client.file('UnexistingFile.foo')).toThrow();
    });

    it("makes secure requests to the web api", async () => {
      
      //Arrange
      const client = new Client();

      //Act & Assert
      const { request } = await client.get('/environment');

      //Assert
      expect(request.protocol).toEqual('https');
    });

    it("can upload files with a multipart request", async () => {
      
      //Arrange
      const client = new Client();
      const fileDefinition = client.file('civicam.png');
      const expectedContentType = 'multipart/form-data; boundary=';

      //Act
      const { request } = await client.post("/foo", fileDefinition);

      //Assert
      //TODO: see if you can inspect the request body
      expect(request.headers['Content-Type'].substr(0, expectedContentType.length)).toEqual(expectedContentType);
    });

  }
);