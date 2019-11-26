'use strict';
const request = require('request');
describe("OTG-CONFIG-007",
  () => {

    it("Test HTTP Strict Transport Security", async () => {
      //Arrange
      //Act
      const html = await new Promise((resolve, reject) => {
        request('http://api.civicam.it', (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
      //Assert
      expect(html).toEqual('4077');

    }, 120000);
  }
);