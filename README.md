# Awesome Userscript

个人常用的 UserScript（浏览器用户脚本）合集，用于改善各类网站的使用体验。

## 使用

1. 安装用户脚本管理器：[Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 在下方目录中找到需要的脚本，打开对应的 `.user.js` 文件。
3. 将脚本内容复制到管理器中新建的脚本并保存，或通过脚本管理器从文件导入。
4. 访问脚本 `@match` 声明的页面即可自动生效。

> 脚本的适用网址、功能及权限以文件头部的 UserScript 元数据为准。

## 脚本目录

| 脚本 | 适用站点 | 简介 |
| --- | --- | --- |
| [`weread-beautify.user.js`](./weread-beautify.user.js) | 微信读书 Web 阅读器 | 阅读页布局与交互优化：栏宽、固定目录、沉浸模式及阅读进度等。 |

## 快捷键约定

各脚本的快捷键和配置方式由脚本自身定义，并会在相应脚本旁或其文件注释中说明。使用快捷键时，请避免焦点位于输入框或文本框内。

## 开发与贡献

本仓库中的脚本无需构建。修改 `.user.js` 文件后，在用户脚本管理器中保存或重新导入，并刷新目标页面进行测试。

新增脚本时建议：

- 使用 `*.user.js` 文件名，并补全 UserScript 元数据（如 `@name`、`@description`、`@match`、`@grant`）。
- 在上方“脚本目录”追加一行简短索引；详细的功能、配置和使用说明放在脚本注释或同名文档中，避免首页 README 变成冗长手册。
- 说明已测试的目标页面和浏览器/用户脚本管理器。

欢迎提交 Issue 或 Pull Request。

## 许可证

本项目采用 [MIT License](./LICENSE)，可自由使用、复制、修改、发布、分发、再授权及商用，保留版权与许可证声明即可。
