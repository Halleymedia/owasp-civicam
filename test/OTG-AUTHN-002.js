'use strict';
describe("OTG-AUTHN-002",
  () => {

    it("returns a 401 status code with default credentials", async () => {
      //Arrange
      const credentials = [
         {"user":"", "password":""}
        ,{"user":"admin", "password":"admin"}
        ,{"user":"administrator", "password":"administrator"}
        ,{"user":"root", "password":"root"}
        ,{"user":"system", "password":"system"}
        ,{"user":"guest", "password":"guest"}
        ,{"user":"operator", "password":"operator"}
        ,{"user":"super", "password":"super"}
        ,{"user":"qa", "password":"qa"}
        ,{"user":"test", "password":"test"}
        ,{"user":"test1", "password":"test1"}
        ,{"user":"testing", "password":"testing"}
        ,{"user":"password", "password":"password"}
        ,{"user":"pass123", "password":"pass123"}
        ,{"user":"password123", "password":"password123"}
      ];
      var client, response;

      //Act
      for(var i in credentials) {
        client = require("./services/client").authenticated(credentials[i]);
        response = (await client.get('/videos')).response;
        expect(response.status).toEqual(401);
        expect(response.data).toBeFalsy();
      }
      
      //Assert
    });

  }
);