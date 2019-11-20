'use strict';
describe("OTG-AUTHZ-002",
  () => {

    it("return 403 inserting an user bypassing authorization schema)", async () => {

      //Arrange
      const client = require("./services/client").authenticated();

      //Act
      const params = {
        "username" : "new-user-bypass-auth-schema",
        "password" : "Password123!"
      }
      const user = (await client.post('/users', params)).response;

      //Assert
      expect(user.status).toEqual(403);
      if(user.status == 200 && user.data && user.data.id > 0) await client.delete(`/users/${user.data.id}/`);

    });

  }
);