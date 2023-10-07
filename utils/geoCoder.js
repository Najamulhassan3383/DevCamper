const nodeCoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "S6R0eFyDbjfeKBj35LzCTQYPRXP8QQZn", // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = nodeCoder(options);

module.exports = geocoder;
