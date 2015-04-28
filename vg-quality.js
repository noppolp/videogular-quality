(function(){
'use strict';
angular.module('th.co.softever.videogular.plugins.quality', [])
  .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-quality",
            '<div>{{ currentQuality.name }} <span class="vg-auto-quality">{{ (autoQualityName && "("+ autoQualityName +")" || null) }}</span></div><vg-quality-selector></<vg-quality-selector>');
    }]
  )
	.directive(
		'vgQuality',
		['VG_UTILS', function(VG_UTILS) {
			return {
				restrict: 'E',
				require: '^videogular',
				templateUrl: 'vg-templates/vg-quality',
				scope: {
					qualities: '=qualitySources',
          currentQuality: '=defaultQuality'
				},
				link: function(scope, elem, attr, API) {

          scope.onMouseOverQuality = function onMouseOverQuality() {
            scope.$evalAsync(function () {
              scope.qualityVisibility = "visible";
            });
          };

          scope.onMouseLeaveQuality = function onMouseLeaveQuality() {
            scope.$evalAsync(function () {
              scope.qualityVisibility = "hidden";
            });
          };

          // We hide quality selector controls on mobile devices
          if (VG_UTILS.isMobileDevice()) {
            elem.css("display", "none");
          }
          else {
            scope.qualityVisibility = "hidden";

            elem.bind("mouseover", scope.onMouseOverQuality);
            elem.bind("mouseleave", scope.onMouseLeaveQuality);
          }

				},
			};
		}]);
})();

(function(){
  angular.module('th.co.softever.videogular.plugins.quality')
    .run(
    ["$templateCache", function ($templateCache) {
      $templateCache.put("vg-templates/vg-quality-selector",
        '<ul><li ng-repeat="o in qualities" ng-class="{\'active\':currentQuality === o}" ng-click="changeQuality(o)">{{ o.name }}</li></ul>');
    }]
    )
    .directive("vgQualitySelector",
    ['VG_STATES', function (VG_STATES) {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: 'vg-templates/vg-quality-selector',
        link: function (scope, elem, attr, API) {
          scope.currentTime = 0;
          scope.playback = API.playback;

          scope.getQualityNameByDashIndex = function(index) {
            for (i = 0; i < scope.qualities.length; i++) {
              if(scope.qualities[i].dashIndex === index) {
                return scope.qualities[i].name;
              }
            }
          };

          var setQualityUpdateIntervel = function() {
            qualityUpdateInterval = setInterval(function(){
              scope.autoQualityName = scope.getQualityNameByDashIndex(API.dashPlayer.getQualityFor("video"));
            }, 3000);
          };

          scope.isDASHSupport = function() {
            return !!window.MediaSource;
          };

          var qualityUpdateInterval;
          // Fallback to normal Videogular if browser not support MPEGDASH
          if(scope.isDASHSupport()){
            if(API.isDASH && API.isDASH(scope.currentQuality.sources[0].src)){
              setQualityUpdateIntervel();
            }
          }else {
            if(API.isDASH && API.isDASH(scope.currentQuality.sources[0].src)){
              for (i = 0; i < scope.qualities.length; i++) {
                if(scope.qualities[i] === scope.currentQuality) {
                  scope.qualities.splice(i, 1);
                  scope.currentQuality = scope.qualities[0];
                }
              }
            }
          }

          if(API.isDASH && API.isDASH(scope.currentQuality.sources[0].src)) {
            scope.dashLoaded = function () {
              API.dashPlayer.seek(scope.currentTime/1000);
              if(scope.currentState === VG_STATES.PLAY) {
                API.dashPlayer.play();
              }
              API.dashPlayer.getVideoModel().getElement().removeEventListener("loadedmetadata", scope.dashLoaded.bind(scope));
              API.setPlayback(scope.playback);
            };
            scope.changeQuality = function(quality) {
              API.dashPlayer.getVideoModel().getElement().addEventListener("loadedmetadata", scope.dashLoaded.bind(scope));
              scope.currentQuality = quality;
              scope.currentTime = API.currentTime;
              scope.playback = API.playback;
              scope.qualityVisibility = 'hidden';
              scope.currentState = API.currentState;
              if(!API.isDASH(quality.sources[0].src)) {
                API.dashPlayer.setAutoSwitchQuality(false);
                API.dashPlayer.setQualityFor("video", quality.dashIndex);
                clearInterval(qualityUpdateInterval);
                scope.autoQualityName = null;
              }else {
                API.dashPlayer.setAutoSwitchQuality(true);
                setQualityUpdateIntervel();
              }
            };
          }else {
            scope.changeQuality = function(quality) {
              scope.currentQuality = quality;
              scope.qualityVisibility = 'hidden';
              scope.currentTime = API.currentTime;
              scope.currentState = API.currentState;
              scope.playback = API.playback;
              API.changeSource(quality.sources);
            };
            scope.onMediaLoaded = function () {
              API.seekTime(scope.currentTime/1000);
              API.setPlayback(scope.playback);
              if(scope.currentState == VG_STATES.PLAY) {
                API.play();
              }
            };
            API.mediaElement[0].addEventListener('loadedmetadata', scope.onMediaLoaded.bind(scope), false);
          }

          scope.onChangeVisibility = function onChangeVisibility(value) {
            elem.css("visibility", value);
          };
          scope.$watch("qualityVisibility", scope.onChangeVisibility);
        }
      }
    }]
);
})();
