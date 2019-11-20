'use strict';
const Client = require("./services/client");
describe("OTG-INPVAL-005",
  () => {

    it("neutralizes a SQL injection attempt when inserting a record", async () => {

      //Arrange
      const client = new Client();
      const maliciousRole = "test'; DROP TABLE speakers; --";
      const speakerCreationParams = {
        "name": "Mario Rossi",
        "role": maliciousRole
      };

      //Act
      await client.login();
      const { response } = await client.post('/speakers', speakerCreationParams);
      const speakerId = response.data.id;
      await client.delete(`/speakers/${speakerId}/`);

      //Assert
      expect(response.status).toEqual(200);
      expect(response.data.role).toEqual(maliciousRole);
    });

  }
);