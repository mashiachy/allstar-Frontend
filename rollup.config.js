import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';

export default {
  output: {
    file: 'app/js/bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve({
      mainFields: ['jsnext', 'main'],
      browser: true,
    }),
    commonjs(),
    globals(),
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};