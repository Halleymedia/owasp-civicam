'use strict';
const Client = require("./services/client");
describe("OTG-CONFIG-007",
  () => {

    it("Test HTTP Strict Transport Security", async () => {
      //Arrange
      const client = new Client();

      //Act
      const { response } = await client.get('/environment');

      //Assert
      expect(Object.keys(response.headers)).toContain('Strict-Transport-Security');

    }, 120000);
  }
);