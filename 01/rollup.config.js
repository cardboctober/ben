
import buble from 'rollup-plugin-buble'

export default {
  entry: 'lib/main.js',
  format: 'iife',
  plugins: [
    glsl(), buble()
  ],
  dest: 'build.js'
}



function glsl () {
	return {
		transform ( code, id ) {
			if ( !/\.glsl$/.test( id ) ) return;
      
			return 'export default ' + JSON.stringify(
				code
					.replace( /[ \t]*\/\/.*\n/g, '' )
					.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
					.replace( /\n{2,}/g, '\n' )
			) + ';';
		}
	};
}
