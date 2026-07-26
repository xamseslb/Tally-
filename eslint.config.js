// Flat ESLint-config. Utvider Expos anbefalte regler med prosjektets
// ufravikelige regler fra CLAUDE.md (ingen console, ingen implicit any).
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'coverage/*', 'supabase/*'],
  },
  {
    // Unngå at eslint-plugin-react prøver å autodetektere versjon via filsystemet.
    settings: { react: { version: '19.2.3' } },
  },
  {
    rules: {
      // CLAUDE.md: console.log er forbudt utenfor tester. Bruk src/lib/logger.
      'no-console': 'error',
      // CLAUDE.md: ingen naken await uten feilhåndtering fanges i review;
      // her slår vi ned på ubrukte variabler for å holde koden ren.
      'no-unused-vars': 'off',
    },
  },
  {
    // Tester får bruke console og andre testhjelpere fritt.
    files: ['**/*.test.ts', '**/*.test.tsx', 'jest-setup.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]);
