'use strict';
const Client = require("./services/client");
describe("OTG-AUTHN-007",
  () => {

    it("return 400 inserting an user with weak password", async () => {

      //Arrange
      const client = new Client();
      const passwords = ["few", "LettersOnly", "lowercaseonly", "UPPERCASEONLY", "1234567890", "password"];

      await client.login();

      for(const password of passwords) {
        const params = {"password" : password}

        //Act
        const { response } = await client.put('/user/password', params);

        //Assert
        expect(response.status).toEqual(400);
      }

    });

    it("return 400 inserting an user with password = username", async () => {

      //Arrange
      const client = new Client();
      const params = {"password" : client.credentials.username}

      //Act
      const { response } = await client.put('/user/password', params);

      //Assert
      expect(response.status).toEqual(400);
    });

    it("return 400 updating user with recently used password", async () => {

      //Arrange
      const client = new Client();

      const params = {"password" : client.credentials.password}

      //Act
      const { response } = await client.put('/user/password', params);

      //Assert
      expect(response.status).toEqual(400);

    });

  }
);