module.exports = {
    name: 'guided-answers-extension-webapp',
    displayName: 'guided-answers-extension-webapp',
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
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '.+\\.(css|sass|scss)$': 'jest-css-modules-transform'
    },
    moduleNameMapper: {
        '.+\\.(svg)$': '<rootDir>/test/__mocks__/svgMock.ts'
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
