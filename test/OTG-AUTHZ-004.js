'use strict';
describe("OTG-AUTHZ-004",
  () => {

    it("Return 401 status requesting a prohibited resource", async () => {
      //Arrange
      const client = require("./services/client").authenticated();
      var id = 0;

      //Act
      const { videos } = await client.get('/videos');
      for(var i in videos.data.results) {
        if(videos.data.results[i].id > id) id = videos.data.results[i].id;
      }
      id++;
      const { video } = await client.get(`/videos/${id}/`);

      //Assert
      expect(video.status).toEqual(401);
    });

  }
);