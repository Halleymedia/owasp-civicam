'use strict';
const Client = require("./services/client");
describe("OTG-CRYPST-003",
  () => {

    it("returns a 400 status code when requesting data over an unencrypted channel", async () => {
      //Arrange
      const client = new Client();

      //Act
      await client.login();
      const { response } = await client.get(`http://${client.host}${client.basePath}/videos`);

      //Assert
      expect(response.status).toEqual(400);
      expect(response.data.violations[0].code).toBe("protocol-error");
    });
  }
);