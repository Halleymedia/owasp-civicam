'use strict';
const Client = require("./services/client");
describe("OTG-BUSLOGIC-009",
  () => {

    it("returns a 400 status code for a bad file upload", async () => {

      //Arrange
      const client = new Client();
      const speakerCreationParams = {
        name: "Mario Rossi",
        role: "Assessore"
      };
      const badPicture = client.file('script.php');

      //Act
      await client.login();
      const { response: speakerResponse } = await client.post('/speakers', speakerCreationParams);
      const speakerId = speakerResponse.data.id;
      const { response: pictureResponse } = await client.put(`/speakers/${speakerId}/picture`, badPicture);
      await client.delete(`/speakers/${speakerId}/`);

      //Assert
      expect(pictureResponse.status).toEqual(400);
    });

  }
);