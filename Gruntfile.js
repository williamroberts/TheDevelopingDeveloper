'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    // TODO - Concat, Uglify etc.
    jasmine : {
      src : [ 'js/app.js',
              'js/utils/utils.js',
              'js/filters/filters.js',
              'js/factories/factories.js',
              'js/directives/directives.js',
              'js/services/*.js',
              'js/controllers/*.js' ],
      options : {
        version : '2.2.1',
        specs : 'test/**/*test.js',
        vendor : [
          'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyDovL8W7hv-f_r-VTacvriWhMJkUH941yY',
          'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js',
          // 'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js',
          // 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-sanitize.min.js',
          // 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.min.js',
          // 'http://cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/spin.min.js',
          'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-mocks.js'
        ]
      }
    }
  });

  // Register tasks.
  // grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('default', 'jasmine');
};