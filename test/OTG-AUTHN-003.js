'use strict';
describe("OTG-AUTHN-003",
  () => {

    it("Weak lock out mechanism", async () => {
      //Arrange
      var client;
      const credentials = {"user":"user", "password":"wrong-password"}
      //Act
      for(var i = 0; i < 12; i++) {
        client = require("./services/client").authenticated(credentials);
        await client.get('/videos');
      }
      client = require("./services/client").authenticated();
      const { response } = await client.get('/videos');

      //Assert
      expect(response.status).toEqual(429);
    });

  }
);