'use strict';
const Client = require("./services/client");
describe("OTG-INPVAL-012",
  () => {

    it("returns a 401 status code for a PHP injection attempt", async () => {

      //Arrange
      const client = new Client();
      const correctUsername = client.credentials.username;
      const maliciousPassword = '"); die("code injection"); echo ("';

      //Act
      const { response } = await client.login(correctUsername, maliciousPassword);

      //Assert
      expect(response.status).toEqual(401);
      expect(response.data).toBeFalsy();
    });

  }
);