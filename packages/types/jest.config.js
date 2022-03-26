module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    testPathIgnorePatterns: ['<rootDir>/dist'],
    verbose: true
};
