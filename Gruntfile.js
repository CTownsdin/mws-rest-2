module.exports = function(grunt) {
  grunt.initConfig({
    /* Clear out the img directory if it exists */
    clean: {
      dev: {
        src: ['img'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['img'],
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the img/ directory */
    copy: {
      dev: {
        files: [
          {
            expand: true,
            src: ['imgSrc/*.{gif,jpg,png}'],
            dest: 'img/',
            flatten: true,
          },
        ],
      },
    },

    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [
            {
              width: 500,
              suffix: 'px',
              quality: 90,
            },
            {
              width: 1000,
              suffix: 'px',
              quality: 90,
            },
            {
              width: 1500,
              suffix: 'px',
              quality: 90,
            },
          ],
        },
        files: [
          {
            expand: true,
            src: ['*.{gif,jpg,png}'],
            cwd: 'imgSrc/',
            dest: 'img/',
          },
        ],
      },
    },
  })

  grunt.loadNpmTasks('grunt-responsive-images')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-mkdir')
  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images'])
}
