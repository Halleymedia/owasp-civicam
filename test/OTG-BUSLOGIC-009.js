'use strict';
describe("OTG-BUSLOGIC-009",
  () => {

    it("returns a 400 status code for a bad file upload", async () => {

      //Arrange
      const client = require("./services/client").authenticated();
      const params = {
        "name": "Mario Rossi",
        "role": "Assessore"
      };

      const fs = require('fs');
      const path = require('path');
      const filecontent = fs.readFileSync(path.join(__dirname, './files/script.php'));

      //Act
      const speaker = (await client.post('/speakers', params)).response.data;
      const response_picture = (await client.put(`/speakers/${speaker.id}/picture`, filecontent)).response;
      await client.delete(`/speakers/${speaker.id}/`);

      //Assert
      expect(response_picture.status).toEqual(400);
    });

  }
);