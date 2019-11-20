'use strict';
const Client = require("./services/client");
describe("OTG-INSECURE-DESERIALIZATION",
  () => {

    it("returns a 401 status code for a json injection attempt (insecure deserialization)", async () => {

      //Arrange
      const client = new Client();
      const speaker1CreationParams = {
        "name": "Mario Rossi",
        "role": "Assessore"
      };

      //Act
      await client.login();
      const { response: speaker1Response } = await client.post('/speakers', speaker1CreationParams);
      const speaker1Id = speaker1Response.data.id;

      const speaker2CreationParams = {
        "id": speaker1Id,
        "name": "Luigi Bianchi",
        "role": "Assessore"
      };
      const speaker2Response = (await client.post('/speakers', speaker2CreationParams)).response;
      const speaker2Id = speaker2Response.data.id;

      await client.delete(`/speakers/${speaker1Id}/`);
      await client.delete(`/speakers/${speaker2Id}/`);

      //Assert
      expect(speaker2Response.status).toEqual(200);
      expect(speaker2Id).toBeGreaterThan(speaker1Id);
    });

  }
);