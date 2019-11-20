'use strict';
describe("OTG-AUTHN-007",
  () => {

    it("return 400 inserting an user with weak password", async () => {

      //Arrange
      const client = require("./services/client").authenticated();
      var user, params;
      const passwords = [
        "few",
        "LettersOnly",
        "lowercaseonly",
        "UPPERCASEONLY",
        "1234567890",
        "password"
      ];

      //Act
      for(var i in passwords) {
        params = {
          "username" : "new-user-weak-psw-"+i,
          "password" : passwords[i]
        }
        user = (await client.post('/users', params)).response;

        //Assert
        expect(user.status).toEqual(400);
        if(user.status == 200 && user.data && user.data.id > 0) await client.delete(`/users/${user.data.id}/`);
      }

    });

    it("return 400 inserting an user with password = username", async () => {

      //Arrange
      const client = require("./services/client").authenticated();

      //Act
      const username = "NewUser123!";
      const params = {
        "username" : username,
        "password" : username
      }
      const user = (await client.post('/users', params)).response;

      //Assert
      expect(user.status).toEqual(400);
      if(user.status == 200 && user.data && user.data.id > 0) await client.delete(`/users/${user.data.id}/`);

    });

    it("return 400 updating user with recently used password", async () => {

      //Arrange
      const client = require("./services/client").authenticated();
      var user, params;

      //Act
      params = {
        "username" : "new-user-used-psw",
        "password" : "GoodPassword123!"
      }
      user = (await client.post('/users', params)).response;

      params = {
        "id" : user.data.id,
        "password" : "GoodPassword123!"
      }
      user = (await client.put('/users', params)).response;
      //Assert
      expect(user.status).toEqual(400);
      await client.delete(`/users/${user.data.id}/`);

    });

  }
);