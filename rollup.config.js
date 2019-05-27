import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: "named"
  },
  plugins: [
    typescript({
      transpileOnly: true
    }),
    commonjs()
  ]
}