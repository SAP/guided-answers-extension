module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    automock: false,
    errorOnDeprecated: true,
    notify: false,
    notifyMode: 'failure',
    verbose: false,
    testMatch: ['**/unit/**/?(*.)+(test).ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testResultsProcessor: 'jest-sonar-reporter',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coverageDirectory: 'reports/test/unit/coverage',
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.vscode-test'],
    modulePathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.vscode-test/',
        '<rootDir>/test/unit/samples/',
        '<rootDir>/test/int/test-data/',
        '<rootDir>/test/int/test-data-copy/'
    ],
    globals: {
        'ts-jest': {
            diagnostics: {
                // warnOnly: true,
                exclude: /\.(spec|test)\.ts$/
            }
        }
    }
};
