import bundleSize from 'rollup-plugin-bundle-size';
import typescript from 'rollup-plugin-typescript2';
import peerDeps from 'rollup-plugin-peer-deps-external';
import {
  join
} from 'path'

import pkg from './package.json';

const {
  workspaces
} = pkg;

export default workspaces.map(workspace => {
  const {
    name,
    source: input,
    main,
    browser,
    module: mjs
  } = require(`${workspace}/package.json`)
  const plugins = [peerDeps(), typescript({
    tsconfigOverride: {
      baseUrl: workspace
    },
    tsconfig: join(workspace, 'tsconfig.json'),
    useTsconfigDeclarationDir: true
  }), bundleSize()];
  return {
    input: join(workspace, input),
    plugins,
    output: [{
        file: join(workspace, main),
        format: 'cjs',
      },
      {
        name,
        file: join(workspace, browser),
        format: 'umd',
      },
      {
        format: 'esm',
        file: join(workspace, mjs),
      },
    ],
  }
});