const { join } = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const cssModulesPlugin = require('esbuild-css-modules-plugin');
const svgrPlugin = require('esbuild-plugin-svgr');

require('esbuild')
    .build({
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
            sassPlugin({
                async transform(source) {
                    const { css } = await postcss([autoprefixer]).process(source);
                    return css;
                }
            }),
            cssModulesPlugin(),
            svgrPlugin()
        ],
        watch: process.argv.includes('--watch')
            ? {
                  onRebuild(error, result) {
                      if (error) {
                          console.error('watch build failed:', error);
                      } else {
                          console.log('watch build succeeded:', result);
                      }
                  }
              }
            : undefined
    })
    .catch((error) => {
        console.log(error.message);
        process.exit(1);
    });
