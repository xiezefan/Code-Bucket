module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'spider/chuangshi-spider.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'spider/*.js', 'build/*.js', 'common/*.js', 'config/*.js', 'models/*.js', 'public/*.js', 'routes/*.js'],
            options: {
                globals: {
                    exports: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, src: ['config/*', 'bin/*','common/*','models/*','public/*','routes/*','spider/*','view/*','*.js','*.json'], dest: 'dest/', filter: 'isFile'},
                ]
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify']);

};