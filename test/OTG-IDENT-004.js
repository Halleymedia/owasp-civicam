'use strict';
const Client = require("./services/client");

describe("OTG-IDENT-004",
  () => {
    it("Testing for Account Enumeration and Guessable User Account", async () => {
      //Arrange
      const client = new Client();
      const correctUsername = client.credentials.username;
      const wrongUsername = "wrong-username";
      const wrongPassword = "wrong-password";

      //Act
      const rightUsernameRsponse = (await client.login(correctUsername, wrongPassword)).response;
      const wrongUsernameRsponse = (await client.login(wrongUsername, wrongPassword)).response;

      //Assert
      expect(rightUsernameRsponse.status).toEqual(wrongUsernameRsponse.status);
      expect(rightUsernameRsponse.statusText).toEqual(wrongUsernameRsponse.statusText);
      expect(rightUsernameRsponse.data).toEqual(wrongUsernameRsponse.data);
    });

  }
);