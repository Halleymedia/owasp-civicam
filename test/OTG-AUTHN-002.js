'use strict';
const Client = require("./services/client");
describe("OTG-AUTHN-002",
  () => {

    it("returns a 401 status code when logging in with default credentials", async () => {
      //Arrange
      const client = new Client();
      const defaultNames = ["", "admin", "administrator", "root", "system", "guest", "operator", "super", "qa", "test", "test1", "testing", "password", "pass123", "password123"];
            
      for(const username of defaultNames) {
        for(const password of defaultNames) {
          //Act
          const { response } = await client.login(username, password);

          //Assert
          expect(response.status).toEqual(401);
          expect(response.data).toBeFalsy();
        }
      }
    }, 120000); //120 seconds timeout
  }
);