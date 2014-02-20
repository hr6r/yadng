module.exports = function(grunt) {
	grunt.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				jshint : {
					files : ['common.js', 'options.js', 'yadng.js']
				}
			});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);
}