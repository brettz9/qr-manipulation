import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

function getConfig ({format = 'umd', min = false}) {
  return {
    input: 'src/index.js',
    plugins: [
      babel({
        plugins: ['transform-object-rest-spread']
      }),
      min ? terser() : undefined
    ],
    output: {
      format,
      file: `dist/index${format === 'es' ? '-es' : '-umd'}${min ? '.min' : ''}.js`,
      name: 'qrManipulation'
    }
  };
}

export default [
  getConfig({format: 'umd', min: true}),
  getConfig({format: 'umd', min: false}),
  getConfig({format: 'es', min: true}),
  getConfig({format: 'es', min: false})
];
