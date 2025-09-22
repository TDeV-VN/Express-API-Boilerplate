import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "src/bin/www.js"], // thay cho .eslintignore
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        requireConfigFile: false,
        allowImportExportEverywhere: true,
      },
      globals: {
        // Node.js globals (tương đương env: { node: true })
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // Cấm console.log (hãy dùng myLogger thay thế)
      "no-console": "error",

      // Tắt rule chặn việc dùng !! (double boolean cast)
      "no-extra-boolean-cast": "off",

      // Cảnh báo khi if lẻ không cần thiết (ví dụ: if bên trong else)
      "no-lonely-if": "warn",

      // Chặn việc khai báo biến mà không dùng
      "no-unused-vars": "error",

      // Cảnh báo khi có space thừa ở cuối dòng
      "no-trailing-spaces": "warn",

      // Cảnh báo khi có nhiều space liên tiếp
      "no-multi-spaces": "warn",

      // Cảnh báo khi có nhiều dòng trống liên tiếp
      "no-multiple-empty-lines": "warn",

      // Bắt buộc có dấu cách trước block ({ ... })
      "space-before-blocks": ["error", "always"],

      // Bắt buộc có space bên trong object { key: value }
      "object-curly-spacing": ["error", "always"],

      // Bắt buộc 1 level tab = 2 spaces
      indent: ["error", 2],

      // Bắt buộc có dấu chấm phẩy ở cuối câu lệnh
      semi: ["error", "always"],

      // Bắt buộc dùng nháy kép "" thay vì nháy đơn ' cho string
      quotes: ["error", "double"],

      // Chặn việc thiếu/thừa space trong array [ 1, 2 ]
      "array-bracket-spacing": "error",

      // Không kiểm tra linebreak-style (tránh lỗi giữa Windows vs Unix)
      "linebreak-style": "off",

      // Cảnh báo khi có multiline khó hiểu (ví dụ: xuống dòng mà thiếu dấu nối)
      "no-unexpected-multiline": "warn",

      // Chặn việc thiếu/thừa space quanh từ khóa (if, else, for, etc.)
      "keyword-spacing": "error",

      // Chặn việc thiếu/thừa dấu phẩy ở cuối object/array
      // "comma-dangle": "error",

      // Cảnh báo khi thiếu/thừa space sau dấu phẩy
      "comma-spacing": "warn",

      // Chặn việc thiếu/thừa space quanh arrow function =>
      "arrow-spacing": "error",

      // Yêu cầu luôn dùng === thay vì ==
      eqeqeq: ["error", "always"],

      // Cấm khai báo biến bằng var (chỉ cho phép let/const)
      "no-var": "error",

      // Khuyến khích dùng const khi biến không gán lại
      "prefer-const": "warn",

      // Cấm để function rỗng không có nội dung
      "no-empty-function": "error",

      // Cảnh báo khi dùng async function mà không có await
      "require-await": "warn",

      // Cấm return trong constructor
      "no-constructor-return": "error",

      // Giới hạn độ dài 1 dòng code 120 ký tự cho dễ đọc
      "max-len": ["warn", { code: 120 }],

      // Yêu cầu xuống dòng khi block if/else/for/... có nhiều lệnh
      curly: ["error", "multi-line"],

      // Bắt buộc dấu ngoặc đơn khi arrow function có body phức tạp
      "arrow-body-style": ["error", "as-needed"],
    },
  },
];
