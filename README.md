videogular-quality
====================

Videogular Quality is a [Videogular](http://videogular.com/) plugin for changing video quality during video playback.

Installation
------------

```
bower install videogular-quality
```

Usage
-----

First, import the JavaScript file `vg-quality.js`, and then inject dependency `th.co.softever.videogular.plugins.quality` to your AngularJS module.

Second, import the CSS file `vg-quality.css` to your html page.

Next, add a `<vg-quality>` element as a child of the `<vg-controls>` of your Videogular player like `<vg-volume>`.

Last thing you have to add 2 attributes such as: 

1. `quality-sources` is an array of video sources and define the name of each quality, for example: 
```js
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
        ]
```

2. `default-quality` is the selected video quality object that select from an array above.

So, the element will look like this:
```html
<vg-quality quality-sources="controller.config.qualitySources" default-quality="controller.currentQualitySource"></vg-quality>
```

You can see full example in `/example/*` directory in this project.

Styling
-----------------

You can override the style by looking the default style in `vg-quality.css`

MPEG-DASH Support
-----------------

For MPEG-DASH you need to add `.mpd` file as the last source of quality sources list and add `dashIndex` property to each traditional source. `dashIndex` is a bitrate index that MPEG-DASH manifest use to auto scale the quality of video, so you must assign the `sources` property if you need to fallback to traditional progressive streaming when web browser is not support to MPEG-DASH. See example below
```js
qualitySources: [
          {
            name: '720p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular720.mp4"), type: "video/mp4"}
            ],
            dashIndex: 3
          },
          {
            name: '480p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular480.mp4"), type: "video/mp4"}
            ],
            dashIndex: 2
          },
          {
            name: '360p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular360.mp4"), type: "video/mp4"}
            ],
            dashIndex: 1
          },
          {
            name: '240p',
            sources: [
              {src: $sce.trustAsResourceUrl("https://dl.dropboxusercontent.com/u/8274898/videogular/videogular240.mp4"), type: "video/mp4"}
            ],
            dashIndex: 0
          },
          {
            name: 'Auto',
            sources: [
              {src: "https://dl.dropboxusercontent.com/u/8274898/videogular/dash/videogular.mpd"}
            ]
          }
        ]
```

You need to set the initial or default source to `.mpd` source or the last item in the quality list.
```js
currentQualitySource = this.qualitySources[this.qualitySources.length - 1];
```

Demo
------------
http://softever.co.th/dash/example/
