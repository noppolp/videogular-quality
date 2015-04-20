(function(){
'use strict';
angular.module('th.co.softever.videogular.plugins.quality', [])
  .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-quality",
            '<div>{{ currentQuality.name }}</div><vg-quality-selector></<vg-quality-selector>');
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
    [function () {
      return {
        restrict: "E",
        require: "^videogular",
        templateUrl: 'vg-templates/vg-quality-selector',
        link: function (scope, elem, attr, API) {
          scope.currentTime = 0;
          scope.changeQuality = function(quality) {
            scope.currentQuality = quality;
            scope.qualityVisibility = 'hidden';
            scope.currentTime = API.currentTime;
            scope.playback = API.playback;
            API.changeSource(quality.sources);
          };
          scope.onMediaLoaded = function () {
            API.seekTime(scope.currentTime/1000);
            API.setPlayback(scope.playback);
          };
          API.mediaElement[0].addEventListener('loadedmetadata', scope.onMediaLoaded.bind(scope), false);

          scope.onChangeVisibility = function onChangeVisibility(value) {
            elem.css("visibility", value);
          };
          scope.$watch("qualityVisibility", scope.onChangeVisibility);
        }
      }
    }]
);
})();
