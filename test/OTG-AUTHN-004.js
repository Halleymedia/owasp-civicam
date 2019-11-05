'use strict';
describe("OTG-AUTHN-004",
  () => {

    it("returns a 401 status code for a direct page request", async () => {
      //Arrange
      const client = require("./services/client").anonymous();

      //Act
      //const { request, response, secure, certificate, tls } = await client.get('/videos');
      const { response } = await client.get('/videos');

      //Assert
      expect(response.status).toEqual(401);
      expect(response.data).toBeFalsy();
    });

  }
);