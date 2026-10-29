/**
 * index.js - 云原生与 Bot-Hosting 自适应启动引导入口
 * 作用：
 * 1. 自动感知云平台注入的动态端口（PORT / SERVER_PORT），自动桥接到 DANMU_API_PORT
 * 2. 注入运行期环境安全约束
 * 3. 动态载入主业务核心 danmu_api/server.js
 */

const targetPort = process.env.PORT || process.env.SERVER_PORT || process.env.DANMU_API_PORT || '9321';
process.env.DANMU_API_PORT = targetPort.toString();

// 默认普通访问令牌（非管理密码），若环境变量未指定则默认采用 @s5gydl
if (!process.env.TOKEN) {
  process.env.TOKEN = '@s5gydl';
}

// 256MB 极小内存容器防护：平滑分片并发与弹幕采样，杜绝长视频/大电影 OOM 崩溃 (Exit 137 / HTTP 521)
if (!process.env.TENCENT_CONCURRENCY) {
  process.env.TENCENT_CONCURRENCY = '8'; // 腾讯分片并发由 100 降为 8，内存平稳
}
if (!process.env.IQIYI_CONCURRENCY) {
  process.env.IQIYI_CONCURRENCY = '8'; // 爱奇艺分片并发由 100 降为 8
}
if (!process.env.DANMU_LIMIT) {
  process.env.DANMU_LIMIT = '6'; // 长视频弹幕采样限制为 6k，足够满屏观影且杜绝内存撑爆
}

console.log('====================================================');
console.log('[Bot-Hosting Launcher] 正在启动弹幕服务容器...');
console.log(`[Bot-Hosting Launcher] 自动感知端口: ${targetPort} (已注入 DANMU_API_PORT)`);
console.log(`[Bot-Hosting Launcher] 默认普通访问令牌: ${process.env.TOKEN}`);
console.log('====================================================');

import('./danmu_api/server.js');
