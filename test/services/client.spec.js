'use strict';
describe("ClientSpec",
  () => {

    it("uses the correct HTTP verb when the request is sent", async () => {
      //Arrange
      const client = require('./client').anonymous();

      //Act & Assert
      for(const verb of ['get', 'post', 'put', 'delete']) {
        const { request } = await client[verb]('/environment');
        expect(request.method).toEqual(verb.toUpperCase());
      }
    });

    it("is a frozen object", async () => {
      //Arrange
      const arbitraryValue = 'blah';
      const client = require('./client').anonymous();

      //Act & Assert
      expect(() => client.authentication = arbitraryValue).toThrow();
      expect(() => client.host = arbitraryValue).toThrow();
      expect(() => client.basePath = arbitraryValue).toThrow();
    });

    it("defines a host and base path", async () => {
      //Arrange
      const client = require('./client').anonymous();

      //Assert
      expect(client.host).toBeTruthy();
      expect(client.basePath).toBeTruthy();
    });

    it("invokes Civicam REST API when just the path is provided", async () => {

      //Arrange
      const client = require('./client').anonymous();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.host).toEqual(client.host);
      expect(request.path.indexOf(client.basePath)).toEqual(0);
    });

    it("provides the certificate and TLS connection info", async () => {

      //Arrange
      const client = require('./client').anonymous();

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

    it("returns a JavaScript object for a JSON response", async () => {

      //Arrange
      const client = require('./client').anonymous();

      //Act
      const { response } = await client.get('/environment');

      //Assert
      expect(response.data).toBeTruthy();
      expect(typeof(response.data)).toEqual('object');
    });

    it("returns a status code of 200 for a successful request", async () => {

      //Arrange
      const client = require('./client').anonymous();

      //Act
      const { response } = await client.get('/environment');

      //Assert
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.success).toEqual(true);
    });

    it("includes the authorization header when authenticated", async () => {

      //Arrange
      const client = require('./client').authenticated();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.headers['Authorization']).toBeTruthy();
      expect(request.headers['Authorization']).toEqual(client.authentication);
    });

    it("does not include the authorization header when anonymous", async () => {

      //Arrange
      const client = require('./client').anonymous();

      //Act
      const { request } = await client.get('/environment');

      //Assert
      expect(request.headers['Authorization']).toBeFalsy();
    });

    it("rejects credentials without a scheme", async () => {

      //Arrange
      const credentialsWithoutScheme = 'blah';

      //Act & Assert
      expect(() => require('./client').authenticated(credentialsWithoutScheme)).toThrow();
    });

    it("can make requests to any url", async () => {

      //Arrange
      const host = 'www.civicam.it';
      const client = require('./client').anonymous();

      //Act
      const { request, response } = await client.get(`https://${host}`);

      //Assert
      expect(response.success).toEqual(true);
      expect(request.host).toEqual(host);

    });

    it("can find files in the files directory", () => {
      
      //Arrange
      const client = require('./client').anonymous();
      const fileName = 'civicam.png';

      //Act
      const fileDefinition = client.file(fileName);

      //Assert
      expect(fileDefinition.name).toEqual(fileName);
    });

    it("throws for unexisting files", () => {
      
      //Arrange
      const client = require('./client').anonymous();

      //Act & Assert
      expect(() => client.file('UnexistingFile.foo')).toThrow();
    });

    it("makes secure requests to the web api", async () => {
      
      //Arrange
      const client = require('./client').anonymous();

      //Act & Assert
      const { request } = await client.get('/environment');

      //Assert
      expect(request.protocol).toEqual('https');
    });

    it("can upload files with a multipart request", async () => {
      
      //Arrange
      const client = require('./client').anonymous();
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