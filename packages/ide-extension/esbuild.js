const { join } = require('path');
const { copy } = require('esbuild-plugin-copy');
require('esbuild')
    .build({
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
    })
    .catch((error) => {
        console.log(error.message);
        process.exit(1);
    });
