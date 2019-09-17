module.exports = {
  "env": {
      "browser": true,
      "commonjs": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "globals": {
      "$": true,
      "process": true,
      "__dirname": true
  },
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true
      },
      "sourceType": "module",
      "ecmaVersion": 7
  },
  "plugins": [
      "react"
  ],
  "rules": {
      "no-alert": 2, //禁止使用alert confirm prompt
      "no-lone-blocks": 0, //禁止不必要的嵌套块
      "no-class-assign": 2, //禁止给类赋值
      "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
      "no-const-assign": 2, //禁止修改const声明的变量
      "no-dupe-keys": 2, //在创建对象字面量时不允许键重复
      "no-duplicate-case": 2, //switch中的case标签不能重复
      "no-dupe-args": 2, //函数参数不能重复
      "no-empty": 2, //块语句中的内容不能为空
      "no-func-assign": 2, //禁止重复的函数声明
      "no-redeclare": 2, //禁止重复声明变量
      "no-this-before-super": 0, //在调用super()之前不能使用this或super
      "no-undef": 2, //不能有未定义的变量
      "no-use-before-define": 2, //未定义前不能使用
      "react/jsx-no-bind": 0, //JSX中不允许使用箭头函数和bind
      "react/jsx-no-duplicate-props": 2, //防止在JSX中重复的props
      "react/jsx-no-literals": 0, //防止使用未包装的JSX字符串
      "react/jsx-no-undef": 1, //在JSX中禁止未声明的变量
  },
  "settings": {
      "import/ignore": [
          "node_modules"
      ]
  }
}