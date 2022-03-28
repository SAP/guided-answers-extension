module.exports = {
    name: 'guided-answers-extension-webapp',
    displayName: 'gguided-answers-extension-webapp',
    automock: false,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coverageDirectory: 'reports/test/unit/coverage',
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    errorOnDeprecated: true,
    globals: {
        'ts-jest': {
            jsx: 'react',
            diagnostics: {
                warnOnly: true,
                exclude: /\.(spec|test)\.ts$/
            }
        }
    },
    notify: false,
    notifyMode: 'failure',
    preset: 'ts-jest',
    setupFilesAfterEnv: ['./test/test-setup.js'],
    testEnvironment: 'jsdom',
    testMatch: ['**/test/**/*.(test).ts(x)?'],
    testResultsProcessor: 'jest-sonar-reporter',
    transform: {
        '^.+\\.test.tsx?$': 'ts-jest',
        '.+\\.(css|sass|scss)$': 'jest-css-modules-transform'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    verbose: false,
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0
        }
    }
};
