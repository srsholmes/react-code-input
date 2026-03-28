import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: false,
    },
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: false,
        declaration: true,
        declarationDir: './dist/esm/types',
      }),
      postcss(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: false,
    },
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: false,
        declaration: false,
        declarationDir: undefined,
        emitDeclarationOnly: false,
      }),
      postcss(),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];
