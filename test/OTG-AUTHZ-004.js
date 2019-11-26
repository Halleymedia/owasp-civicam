'use strict';
const Client = require("./services/client");
describe("OTG-AUTHZ-004",
  () => {

    it("Return 401 status requesting a prohibited resource", async () => {
      //Arrange
      const client = new Client();
      var id = 0;

      //Act
      await client.login();
      const videos = (await client.get('/videos')).response;
      for(const video of videos.data.results) {
        if(video.id > id) id = video.id;
      }
      id++;
      const { response } = await client.get(`/videos/${id}/`);

      //Assert
      expect(response.status).toEqual(404);
    });

  }
);