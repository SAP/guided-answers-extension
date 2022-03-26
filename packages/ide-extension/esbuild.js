const { join } = require('path');

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
            'vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
            '@sap/ux-guided-answer-webapp'
        ],
        plugins: []
    })
    .catch((error) => {
        console.log(error.message);
        process.exit(1);
    });
