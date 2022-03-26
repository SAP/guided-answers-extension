module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'reports/test/unit/coverage',
    testPathIgnorePatterns: ['<rootDir>/dist'],
    verbose: true
};
