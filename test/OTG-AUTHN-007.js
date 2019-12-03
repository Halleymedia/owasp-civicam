'use strict';
const Client = require("./services/client");
describe("OTG-AUTHN-007",
  () => {

    it("return 400 inserting an user with weak password", async () => {

      //Arrange
      const client = new Client();
      const passwords = ["Few-123", "LettersOnly", "lowercaseonly-123", "UPPERCASEONLY-123", "12345-67890"];

      //Act
      await client.login();
      for(const password of passwords) {
        const params = {"password" : password}
        const { response } = await client.put('/user/password', params);

        //Assert
        expect(response.status).toEqual(400);
        expect(response.data.violations[0].code).toEqual("validation-failed-regex");
      }

    });

    it("return 400 inserting an user with password = username", async () => {

      //Arrange
      const client = new Client();
      const params = {"password" : client.credentials.username}

      //Act
      await client.login();
      const { response } = await client.put('/user/password', params);

      //Assert
      expect(response.status).toEqual(400);
      expect(response.data.violations[0].code).toEqual("bad-password");
    });

    it("return 400 updating user with recently used password", async () => {

      //Arrange
      const client = new Client();
      const params = {"password" : client.credentials.password}

      //Act
      await client.login();
      const { response } = await client.put('/user/password', params);

      //Assert
      expect(response.status).toEqual(400);
      expect(response.data.violations[0].code).toEqual("recently-used-password");
    });

  }
);