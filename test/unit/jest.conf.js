const path = require('path')

module.exports = {
  sourceType: "module",
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^@test/(.*)$': '<rootDir>/bin/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  mapCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'bin/**/*.js',
    '!src/main.js',
    '!**/node_modules/**'
  ],
  testEnvironment: 'node'
}
