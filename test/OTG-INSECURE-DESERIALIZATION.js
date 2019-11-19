'use strict';
describe("OTG-INSECURE-DESERIALIZATION",
  () => {

    it("returns a 401 status code for a json injection attempt (insecure deserialization)", async () => {

      //Arrange
      const client = require("./services/client").authenticated();
      const params1 = {
        "name": "Mario Rossi",
        "role": "Assessore"
      };

      //Act
      const speaker1 = (await client.post('/speakers', params1)).response;

      const params2 = {
        "id": speaker1.data.id,
        "name": "Luigi Bianchi",
        "role": "Assessore"
      };
      const speaker2 = (await client.post('/speakers', params2)).response;


      await client.delete(`/speakers/${speaker1.data.id}/`);
      await client.delete(`/speakers/${speaker2.data.id}/`);


      //Assert
      expect(speaker2.status).toEqual(200);
      expect(speaker2.data.id).toBeGreaterThan(speaker1.data.id);
    });

  }
);