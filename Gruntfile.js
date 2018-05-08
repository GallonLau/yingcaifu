/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    js_path : 'js',
    css_path : 'css',

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
    clean: {
      main: [
        '<%=css_path%>/<%= pkg.name %>.css',
        '<%=css_path%>/*.min.css',
        '<%=js_path%>/<%= pkg.name %>.js',
        '<%=js_path%>/<%= pkg.name %>.min.js'
      ]
    },

    concat: {
      options: {
        banner: '',
        stripBanners: false
      },
      css: {
        src: [
          '<%=css_path%>/animate.mini.css',
          '<%=css_path%>/swiper.css',
          '<%=css_path%>/swiper.common.css',
          '<%=css_path%>/main.css'
        ],
        dest: 'css/<%= pkg.name %>.css'
      },
      js:{
        src: [
          '<%=js_path%>/jquery.2.0.0.min.js',
          '<%=js_path%>/swiper.min.js',
          //'<%=js_path%>/jweixin-1.0.0.js',
          //'<%=js_path%>/wxshare.js',
          '<%=js_path%>/main.js'
        ],
        dest: '<%=js_path%>/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: 'some'
      },
      js: {
        src: '<%= concat.js.dest %>',
        dest: '<%=js_path%>/<%= pkg.name %>.min.js'
      }
    },

    jsencrypter: {
      js:{
        options: {
          separator: ';',
          banner: '<%= banner %>'
        },
        src: ['<%= uglify.js.dest %>'],
        dest : '<%=js_path%>/<%= pkg.name %>.encrypt.js'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        advanced: false
      },
      main: {
        src: '<%= concat.css.dest %>',
        dest: '<%=css_path%>/<%= pkg.name %>.min.css'
      }
    },

    csscomb: {
      options: {
        config: '<%=css_path%>/.csscomb.json'
      },
      main: {
        expand: true,
        cwd: 'css/',
        src: ['<%=css_path%>/main.css', '<%=css_path%>/swiper.common.css'],
        dest: 'css/'
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ]
      },
      core: {
        src: ['<%=concat.css.dest%>']
      }
    }
  });

  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  grunt.loadNpmTasks('jsencrypter');

  grunt.registerTask('dist-js', ['concat:js', 'uglify:js', 'jsencrypter:js']);

  grunt.registerTask('dist-css', ['csscomb:main', 'concat:css','autoprefixer:core', 'cssmin:main']);

  grunt.registerTask('dist', ['clean:main', 'dist-css', 'dist-js']);

  grunt.registerTask('default', ['dist']);
};
