/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};

module.exports = config;


// If you are using next/jest, you can uncomment the lines below:
// const nextJest = require('next/jest');
// const createJestConfig = nextJest({ dir: './' });
// module.exports = createJestConfig({});