import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	entry: 'src/js/main.js',
	dest: 'dist/bundle.min.js',
	format: 'umd',
	moduleName: 'pixelart',
	plugins: [
		commonjs(),
		nodeResolve(),
		babel({
			exclude: 'node_modules/**',
			presets: 'es2015-rollup',
			plugins: ['transform-object-rest-spread']
		})
	]
}