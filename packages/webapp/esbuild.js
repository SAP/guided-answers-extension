const { join } = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');
const { build, context } = require('esbuild');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const cssModulesPlugin = require('esbuild-css-modules-plugin');
const svgrPlugin = require('esbuild-plugin-svgr');

// from https://github.com/bvaughn/react-virtualized/issues/1212#issuecomment-847759202 workaround for https://github.com/bvaughn/react-virtualized/issues/1632 until it is released.
const resolveFixup = {
    name: 'resolve-fixup',
    setup(build) {
        build.onResolve({ filter: /react-virtualized/ }, async (args) => {
            return {
                path: require.resolve(
                    '../../node_modules/.pnpm/react-virtualized@9.22.5_react-dom@16.14.0_react@16.14.0/node_modules/react-virtualized/dist/umd/react-virtualized.js'
                )
            };
        });
    }
};

const buildConfig = {
    logLevel: 'info',
    outdir: 'dist',
    entryPoints: {
        index: join(process.cwd(), 'src/index.ts'),
        guidedAnswers: join(process.cwd(), 'src/webview/index.tsx')
    },
    write: true,
    format: 'cjs',
    bundle: true,
    metafile: true,
    sourcemap: true, // .vscodeignore ignores .map files when bundling!!
    mainFields: ['module', 'main'], // https://stackoverflow.com/a/69352281
    minify: true,
    loader: {
        '.jpg': 'file',
        '.gif': 'file',
        '.mp4': 'file',
        '.graphql': 'text',
        '.png': 'file',
        '.svg': 'file'
    },
    platform: 'browser',
    target: 'chrome90',
    external: [
        'vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        '@sap/guided-answers-extension-webapp'
    ],
    plugins: [
        resolveFixup,
        sassPlugin({
            async transform(source, _, filePath) {
                const { css } = await postcss([autoprefixer]).process(source, { from: filePath });
                return css;
            }
        }),
        cssModulesPlugin(),
        svgrPlugin()
    ]
};

async function run() {
    'use strict';
    const watch = process.argv.includes('--watch');
    if (!watch) {
        // Standard build
        await build(buildConfig).catch((error) => {
            console.log(error);
            process.exit(1);
        });
        process.exit(0);
    }
    // Build with watch
    console.log('Applying watch config');
    buildConfig.minify = false;
    buildConfig.sourcemap = 'inline';
    const buildContext = await context(buildConfig);
    await buildContext.watch().catch((error) => {
        console.log(error);
        buildContext.dispose();
    });
}
run();
