'use strict';
describe("OTG-INPVAL-005",
  () => {

    it("inserting a record neutralizing SQL injection attempt", async () => {

      //Arrange
      const client = require("./services/client").authenticated();
      const role = "ApiKey test' OR 1=1;--";
      const params = {
        "name": "Mario Rossi",
        "role": role
      };

      //Act
      const speaker = (await client.post('/speakers', params)).response;
      await client.delete(`/speakers/${speaker.data.id}/`);

      //Assert
      expect(speaker.status).toEqual(200);
      expect(speaker.data.role).toEqual(role);
    });

  }
);