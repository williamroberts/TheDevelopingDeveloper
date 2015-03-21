/**
 * The solution to tracking page views and events in a SPA with AngularJS
 * @version v0.3.0 - 2014-06-08
 * @link https://github.com/mgonto/angularytics
 * @author Martin Gontovnikas <martin@gonto.com.ar>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
!function(){angular.module("angularytics",[]).provider("Angularytics",function(){var a=["Google"];this.setEventHandlers=function(c){angular.isString(c)&&(c=[c]),a=[],angular.forEach(c,function(c){a.push(b(c))})};var b=function(a){return a.charAt(0).toUpperCase()+a.substring(1)},c="$locationChangeSuccess";this.setPageChangeEvent=function(a){c=a},this.$get=["$injector","$rootScope","$location",function(b,d,e){var f=[];angular.forEach(a,function(a){f.push(b.get("Angularytics"+a+"Handler"))});var g=function(a){angular.forEach(f,function(b){a(b)})},h={};return h.init=function(){},h.trackEvent=function(a,b,c,d,e){g(function(f){a&&b&&f.trackEvent(a,b,c,d,e)})},h.trackPageView=function(a){g(function(b){a&&b.trackPageView(a)})},d.$on(c,function(){h.trackPageView(e.url())}),h}]})}(),function(){angular.module("angularytics").factory("AngularyticsConsoleHandler",["$log",function(a){var b={};return b.trackPageView=function(b){a.log("URL visited",b)},b.trackEvent=function(b,c,d,e,f){a.log("Event tracked",b,c,d,e,f)},b}])}(),function(){angular.module("angularytics").factory("AngularyticsGoogleHandler",["$log",function(){var a={};return a.trackPageView=function(a){_gaq.push(["_set","page",a]),_gaq.push(["_trackPageview",a])},a.trackEvent=function(a,b,c,d,e){_gaq.push(["_trackEvent",a,b,c,d,e])},a}]).factory("AngularyticsGoogleUniversalHandler",function(){var a={};return a.trackPageView=function(a){ga("set","page",a),ga("send","pageview",a)},a.trackEvent=function(a,b,c,d,e){ga("send","event",a,b,c,d,{nonInteraction:e})},a})}(),function(){angular.module("angularytics").filter("trackEvent",["Angularytics",function(a){return function(b,c,d,e,f,g){return a.trackEvent(c,d,e,f,g),b}}])}();