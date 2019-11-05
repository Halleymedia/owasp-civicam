'use strict';
describe("OTG-INPVAL-012",
  () => {

    it("returns a 401 status code for a PHP injection attempt", async () => {

      //Arrange
      const credentials = '"); die("code injection"); echo ("';
      const client = require("./services/client").authenticated(credentials);

      //Act
      const { response } = await client.get('/videos');

      //Assert
      expect(response.status).toEqual(401);
      expect(response.data).toBeFalsy();
    });

  }
);