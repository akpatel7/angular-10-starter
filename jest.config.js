module.exports = {
  preset: 'jest-preset-angular',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer'
        ]
      },
      diagnostics: {
        ignoreCodes: [151001]
      },
      isolatedModules: true
    }
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: [
    'lcov'
  ],
  setupFilesAfterEnv: [
    './src/setup-jest.ts'
  ],
  restoreMocks: true,
  reporters: [
    'default'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/environments/'
  ],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/app/$1'
  }
};
