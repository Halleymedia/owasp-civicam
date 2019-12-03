'use strict';
const Client = require("./services/client");
describe("OTG-AUTHZ-002",
  () => {

    it("return 403 bypassing authorization schema", async () => {

      //Arrange
      const client = new Client();

      //Act
      await client.login();
      const  { response } = await client.get('/users');

      //Assert
      expect(response.status).toEqual(401);

    });

  }
);