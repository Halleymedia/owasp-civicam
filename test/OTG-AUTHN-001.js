'use strict';
const Client = require("./services/client");
describe("OTG-AUTHN-001",
  () => {

    it("returns a 400 status code when logging in over an unencrypted channel", async () => {
      //Arrange
      const client = new Client();
      const credentials = {username:"username", password:"password"};

      //Act
      const { response } = await client.post(`http://${client.host}${client.basePath}/login`, credentials);

      //Assert
      expect(response.status).toEqual(400);
      expect(response.data.violations[0].code).toBe("protocol-error");
    });
  }
);