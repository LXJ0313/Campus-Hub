// Vercel 部署适配器：加载 esbuild 自包含构建产物（dist/bundle.js）
// 仅用于 Vercel Services 部署，本地开发仍使用 npm run dev
// 遵循 Vercel 官方 Custom Build Step 模式：入口在 git 中，产物由入口 require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bundle = require('../dist/bundle.js');

// bundle 可能为 CommonJS 模块对象（exports.default）或直接导出的 app
const app = (bundle && bundle.default) ? bundle.default : bundle;

export default app;
