'use strict';
const Client = require("./services/client");
describe("OTG-AUTHN-004",
  () => {

    it("returns a 401 status code for an anonymous direct page request", async () => {
      //Arrange
      const client = new Client();

      //Act
      const { response } = await client.get('/videos');

      //Assert
      expect(response.status).toEqual(401);
      expect(response.data).toBeFalsy();
    });

    it("returns a 401 status code for a SQL injection attempt", async () => {
      //Arrange
      const client = new Client();
      const correctUsername = client.credentials.username;
      const maliciousPassword = 'test\' OR 1=1;--';

      //Act
      const { response } = await client.login(correctUsername, maliciousPassword);

      //Assert
      expect(response.status).toEqual(401);
      expect(response.data).toBeFalsy();
    });

  }
);