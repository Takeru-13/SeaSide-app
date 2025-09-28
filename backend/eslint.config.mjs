// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier'; // 競合ルール無効化

export default [
  // 無視パターン（重い原因になりがち）
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.d.ts',
      '**/prisma/dev.db',
      'eslint.config.mjs',
    ],
  },

  // JS/TS共通の基本
  {
    ...eslint.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      // ESM前提。commonjsは外す
      sourceType: 'module',
    },
  },

  // TypeScript（型“無し”の軽量ルール）: まず全TSに適用
  {
    files: ['**/*.{ts,tsx}'],
    ...tseslint.configs.recommended, // 型不要の推奨
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // TypeScript（型“あり”の重いルール）: src配下だけに限定
  {
    files: ['src/**/*.{ts,tsx}'],
    ...tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        // TS v5 の projectService を使う（全リポジトリ走査を避ける）
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // 必要ならここに型ベースの追加ルール
    },
  },

  // Prettierとの競合をオフ（自動整形はprettierコマンドで）
  prettierConfig,
];
