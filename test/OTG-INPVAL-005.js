'use strict';
describe("OTG-AUTHN-004",
  () => {

    it("returns a 401 status code for a SQL injection attempt", async () => {

      //Arrange
      const credentials = 'ApiKey test\' OR 1=1;--';
      const client = require("./services/client").authenticated(credentials);

      //Act
      const { response } = await client.get('/videos');

      //Assert
      expect(response.status).toEqual(401);
      expect(response.data).toBeFalsy();
    });

  }
);