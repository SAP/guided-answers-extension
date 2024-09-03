module.exports = {
    displayName: 'guided-answers-extension-webapp',
    automock: false,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/,<rootDir>/test/'],
    errorOnDeprecated: true,
    notify: false,
    notifyMode: 'failure',
    preset: 'ts-jest',
    setupFilesAfterEnv: ['./test/test-setup.js', './test/jest-setup.ts'],
    testEnvironment: 'jsdom',
    testMatch: ['**/test/**/*.(test).ts(x)?'],
    transform: {
        '^.+\\.(ts|tsx)?$': [
            'ts-jest',
            {
                jsx: 'react',
                diagnostics: {
                    warnOnly: true,
                    exclude: /\.(spec|test)\.ts$/
                }
            }
        ],
        '.+\\.(css|sass|scss)$': 'jest-css-modules-transform'
    },
    moduleNameMapper: {
        '.+\\.(svg)$': '<rootDir>/test/__mocks__/svg.mock.ts',
        uuid: require.resolve('uuid')
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
    },
    reporters: [
        'default',
        [
            'jest-sonar',
            {
                reportedFilePath: 'relative',
                relativeRootDir: '<rootDir>/../../../'
            }
        ]
    ]
};
