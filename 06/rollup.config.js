import buble from 'rollup-plugin-buble'

export default {
  entry: 'lib/main.js',
  format: 'iife',
  plugins: [ buble() ],
  dest: 'build.js'
}
