module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: [ '.tmp', 'dist' ],
    //
    // jasmine : {
    //   src : [ 'src/js/app.js',
    //           'src/js/utils/utils.js',
    //           'src/js/factories/factories.js',
    //           'src/js/filters/filters.js',
    //           'src/js/directives/directives.js',
    //           'src/js/services/*.js',
    //           'src/js/controllers/*.js' ],
    //   options : {
    //     specs : 'test/**/*test.js',
    //     vendor : [
    //       'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyDovL8W7hv-f_r-VTacvriWhMJkUH941yY',
    //       'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js',
    //       // 'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js',
    //       // 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-sanitize.min.js',
    //       // 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.min.js',
    //       // 'http://cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/spin.min.js',
    //       // 'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-mocks.js'
    //     ],
    //     junit: {
    //       path: 'test/junit-results'
    //     }
    //   }
    // },
    //
    useminPrepare: {
      html: 'src/index.html',
      options: {
        dest: 'dist'
      }
    },
    //
    concat: {
      dist: {
        src: [ 'src/**/*.js' ],
        dest: 'tmp/app.js'
      }
    },
    //
    ngAnnotate: {
      dist: {
        files: [{
          src: 'tmp/app.js',
          dest: 'tmp/app.js'
        }]
      },
    },
    //
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false,
        report: 'min'
      },
      process: {
        files: [{
          expand: true,
          cwd: 'tmp',
          src: 'app.min.js',
          dest: 'dist'
        }]
      }
    },
    //
    copy: {
      main: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            '**',
            '!js/**',
            '!test/**',
            'js/components/**',
            'js/directives/templates/**'
          ]
        }]
      }
    },
    //
    usemin: {
      html: [
        'dist/index.html',
        'dist/html/*.html',
        'dist/js/directives/templates/*.html'
      ],
      css: [
        'dist/css/main.css'
      ],
      options: {
        assetsDirs: [
          'dist'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['clean', /*'jasmine',*/ 'useminPrepare', 'concat', 'ngAnnotate', 'uglify', 'copy', 'usemin']);

};
