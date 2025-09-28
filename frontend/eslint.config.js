import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  // ignore 対象（必要ならここに追加）
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.d.ts',
    '../backend/dist/**',
    // テストスナップショット等があればここに
  ]),

  // ベース推奨
  js.configs.recommended,
  ...tseslint.configs.recommended, // 型チェックなし版（軽い）

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // 必要なら Node も: ...globals.node,
      },
    },
    rules: {
      // --- 重要ルール（残す or warn） ---
      'react-hooks/rules-of-hooks': 'error',
      // デフォだと error になりがち → warn に緩和
      'react-hooks/exhaustive-deps': 'warn',

      // HMR 安全系は warn に
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // --- うるさい系の緩和 ---
      // TSが見るのでベースの no-unused-vars は無効
      'no-unused-vars': 'off',
      // 未使用は warn。_prefix を無視、残余を許可
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],

      // any 禁止は開発中は外す（必要なら 'warn' に）
      '@typescript-eslint/no-explicit-any': 'off',
      // ts-ignore 等のコメントを許容（暫定）
      '@typescript-eslint/ban-ts-comment': 'off',

      // TSプロジェクトでは誤検出しがち
      'no-undef': 'off',

      // 好みで：あると便利な軽めの改善系
      'prefer-const': 'warn',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    },
  },

  // フォーム小物・hooks依存が多い領域はさらに緩和したい時（任意）
  {
    files: ['src/features/**/components/**/editFormSections/*.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'warn', // ここだけさらに抑制したいなら 'off' でもOK
    },
  },
]);
