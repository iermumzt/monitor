var url = require("url");

module.exports = {
  urls: [{
    url: "/multiscreen",
    page: "multiscreen"
  }, {
    url: "/gismap",
    page: "gismap"
  }, {
    url: "/face-library",
    page: "face-library"
  }, {
    url: "/face-library-id/:faceId",
    page: "face-library-id"
  },
  {
    url: "/profile/statistics",
    page: "data-statistics"
  },
  {
    url: "/profile/data-statistics",
    page: "data-minzhengt"
  }, {
    url: "/multiview",
    page: "multiview"
  }, {
    url: "/monitor",
    page: "monitor"
  }, {
    url: "/monitor/:id",
    page: "monitor"
  }]
};