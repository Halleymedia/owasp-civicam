'use strict';
const Client = require("./services/client");
describe("OTG-AUTHZ-002",
  () => {

    it("return 403 inserting an user bypassing authorization schema)", async () => {

      //Arrange
      const client = new Client();

      //Act
      await client.login();
      const params = {
        "username" : "new-user-bypass-auth-schema",
        "password" : "Password123!"
      }
      const user = (await client.post('/users', params)).response;

      //Assert
      if(user.status == 200 && user.data && user.data.id > 0) await client.delete(`/users/${user.data.id}/`);
      expect(user.status).toEqual(403);

    });

  }
);