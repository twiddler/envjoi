// jest.config.js
// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
}
