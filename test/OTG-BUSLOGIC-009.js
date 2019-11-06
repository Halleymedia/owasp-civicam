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
      const badPicture = client.file('script.php');

      //Act
      const speaker = (await client.post('/speakers', params)).response.data;
      const pictureResponse = (await client.put(`/speakers/${speaker.id}/picture`, badPicture)).response;
      await client.delete(`/speakers/${speaker.id}/`);

      //Assert
      expect(pictureResponse.status).toEqual(400);
    });

  }
);