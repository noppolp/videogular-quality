'use strict';

angular.module('myApp',
    [
      "ngSanitize",
      "com.2fdevs.videogular",
      "com.2fdevs.videogular.plugins.controls",
      "th.co.softever.videogular.plugins.quality"
    ]
  )
  .controller('HomeCtrl',
    ["$sce", function ($sce) {
      this.config = {
        preload: "none",
        qualitySources: [
          {
            name: '720p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular720.mp4"), type: "video/mp4"}
            ]
          },
          {
            name: '480p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular480.mp4"), type: "video/mp4"}
            ]
          },
          {
            name: '360p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular360.mp4"), type: "video/mp4"}
            ]
          },
          {
            name: '240p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular240.mp4"), type: "video/mp4"}
            ]
          }
        ],
        theme: {
          url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        plugins: {
          controls: {
            autoHide: true,
            autoHideTime: 5000
          }
        }
      };
      this.currentQualitySource = this.config.qualitySources[0];
    }]
  );
