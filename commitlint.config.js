// Håndhever Conventional Commits (spec §9 / CLAUDE.md Git).
// Eksempler: feat(reports): ..., fix(sync): ..., test(rls): ...
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'auth',
        'projects',
        'reports',
        'media',
        'sync',
        'signatures',
        'chat',
        'export',
        'rls',
        'ui',
        'db',
        'ci',
        'deps',
        'docs',
      ],
    ],
  },
};
