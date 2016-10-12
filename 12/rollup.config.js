import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'lib/main.js',
  format: 'iife',
  plugins: [ buble(), nodeResolve(), commonjs()],
  dest: 'build.js'
}
