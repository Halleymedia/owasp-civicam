'use strict';
const Client = require("./services/client");

describe("OTG-AUTHN-003",
  () => {
    it("performs account lockout for 30 minutes after 5 invalid login attempts", async () => {
      //Arrange
      const client = new Client();
      const correctUsername = client.credentials.username;
      const correctPassword = client.credentials.password;
      const wrongPassword = "wrong-password";

      //Act
      for(let attempt = 1; attempt <= 5; attempt++) {
        await client.login(correctUsername, wrongPassword);
      }

      const { response } = await client.login(correctUsername, correctPassword);

      //Assert
      expect(response.status).toEqual(429);
      expect(response.headers['Retry-After']).toEqual((60 * 30).toString()); //30 minutes
    });

  }
);