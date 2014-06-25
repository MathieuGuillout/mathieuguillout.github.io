module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compile:
        files: 
          "sketch.js": "sketch.coffee"
    watch:
      files: ["index.html", "sketch.coffee"]
      tasks: [ 'coffee' ]
      options:
        livereload: true
    connect: 
      server:
        options: 
          port: 8000
          hostname: "*"
    shell:
      open:
        command: "open http://localhost:8000/index.html"



  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-shell'

  grunt.registerTask "live", [ "connect", "shell", "watch" ]
