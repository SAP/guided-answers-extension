const { join } = require('path');
const { copy } = require('esbuild-plugin-copy');
const { build, context } = require('esbuild');

const buildConfig = {
    logLevel: 'info',
    outfile: 'dist/extension-min.js',
    entryPoints: [join(process.cwd(), 'src/extension.ts')],
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
    platform: 'node',
    target: 'node12.22',
    external: [
        'vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        // '@sap/guided-answers-extension-webapp'
    ],
    plugins: [
        copy({
            // workaround because vsce doesn't support pnpm (https://github.com/microsoft/vscode-vsce/issues/421)
            // so it doesn't copy node_modules to vsix.
            assets: {
                from: ['../webapp/dist/guidedAnswers.js', '../webapp/dist/guidedAnswers.css'],
                to: ['.']
            }
        })
    ]
};

async function run() {
    'use strict';
    const watch = process.argv.slice(2).includes('--watch');
    if (!watch) {
        // Standard build
        build(buildConfig).catch((error) => {
            console.log(error);
            process.exit(1);
        });
        process.exit(0);
    }
    // Build with watch
    console.log('Applying watch config');
    buildConfig.minify = false;
    const buildContext = await context(buildConfig);
    await buildContext.watch().catch((error) => {
        console.log(error);
        buildContext.dispose();
    });
}
run();
