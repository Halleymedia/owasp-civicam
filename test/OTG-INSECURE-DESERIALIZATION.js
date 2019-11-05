'use strict';
describe("OTG-INSECURE-DESERIALIZATION",
  () => {

    it("returns a 401 status code for a json injection attempt (insecure deserialization)", async () => {

      //Arrange
      const client = require("./services/client").authenticated();
      const params = {
        "name": "Mario Rossi",
        "role": "Assessore"
      };

      //Act
      const speaker = (await client.post('/speakers', params)).response;
      await client.delete(`/speakers/${speaker.data.id}/`);

      //Assert
      expect(speaker.status).toEqual(401);
    });

  }
);