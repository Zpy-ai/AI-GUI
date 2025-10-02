# 🤖 基于Next.js的AI聊天助手 - 多模型支持

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)

一个类似豆包的现代化AI聊天界面，支持多个不同的AI模型，具有美观的UI和丰富的功能，支持完整的数据库持久化。

![interface](https://github.com/Zpy-ai/AI-GUI/blob/main/images/interface.jpg)

## 🎯 项目特色

- 🌟 **多模型支持** - 集成 Kimi、豆包、混元、DeepSeek、千问等主流AI模型
- 💾 **数据持久化** - 完整的 MySQL 数据库集成，自动保存所有聊天记录
- 🚀 **流式输出** - 实时显示AI回复，提供流畅的打字机效果
- ⏹️ **终止生成** - 支持随时终止AI回答和重新生成
- 📱 **响应式设计** - 完美支持桌面端和移动端
- 🎨 **现代化UI** - 美观的聊天界面，支持Markdown渲染和代码高亮

## ✨ 功能特性

### 🤖 多模型支持

- 🌙 **Kimi K2** - 月之暗面最新大模型，支持超长文本和复杂推理
- 🚀 **豆包 Pro** - 字节跳动最新大模型，优秀的中文理解
- 🦁 **腾讯混元 Pro** - 腾讯自研大模型，强大的知识推理能力
- 🔍 **DeepSeek Chat** - 深度求索开源模型，优秀的代码能力
- ☁️ **千问3-4B** - 阿里云开源模型，全面的知识覆盖

### 🎨 界面功能

- ✨ **流式输出** - 实时显示AI回复，流畅的打字机效果
- ⏹️ **终止生成** - 支持随时终止AI回答和重新生成
- 🔄 **重新生成** - 基于对应用户消息重新生成AI回复
- 📋 **复制内容** - 快速复制AI回复到剪贴板
- 🔄 **模型切换** - 多模型选择器无缝切换体验
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🎭 **消息操作** - 复制、重新生成、反馈、终止等完整功能
- 📝 **Markdown 渲染** - 代码高亮、列表、引用、标题等格式支持
- ⚡ **加载状态** - 完善的加载状态和错误处理机制
- 🔧 **模型映射** - 前端模型名自动映射到服务商真实模型名
- 🛡️ **错误处理** - 详细的API错误信息显示和Token限制处理

### 💾 数据持久化

- 🗄️ **MySQL 集成** - 完整的数据库支持，可靠的对话和消息记录存储
- 💬 **自动保存** - 实时数据同步，所有聊天记录自动保存到数据库
- 🔍 **历史管理** - 支持多会话切换和历史记录查看功能
- 📊 **消息统计** - Token使用量统计和模型使用分析
- ⚡ **实时同步** - 用户消息和AI回复即时同步到数据库
- 🔒 **数量限制** - 自动限制对话数量，只保留最新的5条对话

## 🚀 快速开始

### 📋 环境要求

- ⚡ **Node.js 18+** - JavaScript 运行时环境
- 🗄️ **MySQL 8.0+** - 关系型数据库管理系统
- 🔑 **API 密钥** - 至少一个AI模型的API密钥

### 1️⃣ 克隆项目

```bash
git clone <your-repo-url>
cd my-app
```

### 2️⃣ 安装依赖

```bash
# 安装项目依赖
npm install
```

### 3️⃣ 配置环境变量

复制环境变量模板文件并配置您的API密钥：

```bash
# 复制环境变量模板
cp env.example .env.local
```

编辑 `.env.local` 文件，配置以下参数：

```env
# ========== AI 模型配置 ==========
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Qwen API (阿里云 DashScope 兼容模式或其他服务商的 OpenAI 兼容端点)
QWEN_API_KEY=your_qwen_api_key_here
QWEN_API_ENDPOINT=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL_ID=qwen-plus

# Doubao (豆包) OpenAI 兼容接口
DOUBAO_API_KEY=your_doubao_api_key_here
DOUBAO_API_ENDPOINT=your_doubao_endpoint_here
DOUBAO_MODEL_ID=ep-32b-chat

# Hunyuan (腾讯混元) OpenAI 兼容接口
HUNYUAN_API_KEY=your_hunyuan_api_key_here
HUNYUAN_API_ENDPOINT=your_hunyuan_endpoint_here
HUNYUAN_MODEL_ID=hunyuan-pro

# DeepSeek OpenAI 兼容接口
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_ENDPOINT=https://api.deepseek.com/v1
DEEPSEEK_MODEL_ID=deepseek-chat

# Kimi (月之暗面) OpenAI 兼容接口
KIMI_API_KEY=your_kimi_api_key_here
KIMI_API_ENDPOINT=https://api.moonshot.cn/v1
KIMI_MODEL_ID=kimi-k2

# ========== 数据库配置 ==========
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=aiweb_database
DB_PORT=3306
```

### 4️⃣ 初始化数据库

```bash
# 安装数据库依赖
npm install mysql2
npm install -D tsx @types/mysql2

# 初始化数据库表结构
npm run db:init
```

### 5️⃣ 启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。 🎉

## 🔧 配置说明

### 🗄️ 数据库配置

项目使用 MySQL 作为主要数据库，支持完整的聊天记录持久化和数据持久化功能。

#### 📋 数据库初始化命令

```bash
# 📁 初始化数据库表结构
npm run db:init

# 🔄 重置数据库（清空所有数据）
npm run db:reset

# ✅ 检查数据库连接状态
npm run db:status
```

#### ✨ 数据库功能

- 💾 **自动保存** - 实时保存用户消息和AI回复到数据库
- 🔍 **历史查询** - 支持完整的消息历史查询功能
- ⚡ **实时同步** - 数据即时同步，确保数据一致性
- 📊 **使用统计** - Token使用量统计和模型使用分析
- 🛡️ **数据备份** - 完整的数据库备份和恢复机制

### 🤖 AI模型配置

支持多种主流AI模型，需要在环境变量中配置对应的API密钥：

- 🌙 **Kimi** - `KIMI_API_KEY` (Kimi K2)
- 🎯 **OpenAI** - `OPENAI_API_KEY` (GPT-3.5-turbo)
- 🚀 **豆包** - `DOUBAIN_API_KEY`, `DOUBAIN_APP_ID` (豆包Pro)
- 🦁 **混元** - `HUNYUAN_API_KEY`, `HUNYUAN_APP_ID` (混元Pro)
- 🔍 **DeepSeek** - `DEEPSEEK_API_KEY` (DeepSeek Chat)
- ☁️ **千问** - 无需额外配置 (千问3-4B)

### ⚙️ 环境变量说明

所有配置通过环境变量管理，支持开发、测试和生产环境的不同配置。

### 流式输出功能

#### 后端实现

- **API路由**: `/api/chat/stream` 处理流式请求
- **ReadableStream**: 使用Web标准的ReadableStream API
- **分块传输**: 将AI响应分块发送给前端
- **实时更新**: 前端实时接收并显示每个文本块

#### 前端实现

- **流式接收**: 使用 `fetch` API的 `ReadableStream` 功能
- **实时渲染**: 通过React状态管理实时更新消息内容
- **用户体验**: 提供打字机效果，让用户看到AI正在"思考"

### 终止生成功能

#### 功能特点

- **随时终止**: 在AI回答过程中可以随时点击终止按钮
- **视觉反馈**: 终止后会在消息末尾显示"[回答已终止]"标记
- **状态管理**: 正确处理终止状态，避免界面卡死
- **重新生成**: 支持终止重新生成过程

#### 使用方法

1. **发送消息时**: 在AI回答过程中，输入框旁的发送按钮会变成红色的终止按钮
2. **重新生成时**: 在消息操作区域会显示终止按钮
3. **点击终止**: 点击终止按钮即可立即停止AI回答

### API密钥获取

1. **Kimi API (Moonshot AI)"
   - 访问 [Moonshot AI 开放平台](https://platform.moonshot.cn/)
   - 注册账号并获取API密钥

2. **Qwen API (阿里云百炼)"
   - 访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
   - 获取API密钥和兼容端点

3. **豆包 API**
   - 访问字节跳动豆包开放平台
   - 获取API密钥和兼容端点

4. **腾讯混元 API**
   - 访问腾讯混元开放平台
   - 获取API密钥和兼容端点

5. **DeepSeek API**
   - 访问 [DeepSeek 官网](https://platform.deepseek.com/)
   - 获取API密钥

### 模型配置

每个模型都有预设的配置参数，可以在 `src/components/ModelSelector.tsx` 中修改：

```typescript
export const AI_MODELS: AIModel[] = [
  {
    id: 'kimi-k2',
    name: 'Kimi K2',
    description: 'Moonshot Kimi大模型，支持长文本和复杂推理',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-purple-500',
    maxTokens: 128000,
    pricing: '按量计费'
  }
];
```

## 📁 项目结构

```
📂 src/
├── 📂 app/
│   ├── 📂 api/
│   │   └── 📂 chat/
│   │       ├── 🚀 route.ts          # 普通聊天API路由（含数据库记录）
│   │       └── 📂 stream/
│   │           └── 🚀 route.ts      # 流式聊天API路由（含数据库记录）
│   ├── 🎨 layout.tsx
│   └── 🏠 page.tsx                  # 主页面
├── 📂 components/
│   ├── 🔄 ModelSelector.tsx         # 模型选择器
│   ├── ⚡ MessageActions.tsx        # 消息操作按钮（包含终止功能）
│   └── 📱 Sidebar.tsx               # 侧边栏
└── 📂 lib/
    ├── 🌐 api.ts                    # API服务（支持流式和终止）
    ├── 🗄️ database.ts               # 数据库连接和查询工具
    ├── 💬 chatService.ts            # 聊天服务（数据库集成）
    └── 📂 providers/                # AI提供者模块
        ├── 📋 index.ts              # 提供者接口定义和工厂函数
        ├── 🤖 openai.ts             # OpenAI流式提供者
        ├── 🚀 doubao.ts             # 豆包流式提供者
        ├── 🦁 hunyuan.ts            # 混元流式提供者
        ├── 🔍 deepseek.ts           # DeepSeek流式提供者
        └── ☁️ qwen.ts               # 千问流式提供者

📂 scripts/
└── 🗄️ init-db.ts                    # 数据库初始化脚本
```

## 🔌 API集成

### 已集成的AI服务

项目已集成以下AI服务的真实API调用：

1. **Kimi (月之暗面)** - Moonshot AI官方API接口
2. **Qwen (千问)** - 支持阿里云百炼兼容模式
3. **Doubao (豆包)** - OpenAI兼容接口
4. **Hunyuan (混元)** - OpenAI兼容接口  
5. **DeepSeek** - 官方API接口
6. **OpenAI** - 模拟响应（需手动集成）

### 启用真实AI服务

对于尚未集成的服务，在对应的提供者文件中取消注释相应的SDK导入并配置API密钥。

示例（OpenAI）：

```typescript
// 在 src/lib/providers/openai.ts 中
import OpenAI from 'openai';

// 取消注释并配置真实API调用
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const stream = await openai.chat.completions.create({
  model: request.model,
  messages: [{ role: 'user', content: request.message }],
  max_tokens: request.maxTokens,
  temperature: request.temperature,
  stream: true
});
```

## 🎯 使用说明

### 基本操作

1. 在右上角选择想要使用的AI模型
2. 在输入框中输入问题
3. 点击发送按钮或按Enter键发送消息
4. 观察AI回复的流式输出效果

### 高级功能

- **复制消息**: 点击消息下方的复制按钮
- **重新生成**: 点击重新生成按钮获取新的回复（基于对应的用户消息）
- **⏹️ 终止生成**: 在AI回答过程中点击终止按钮停止生成
- **反馈**: 对AI回复进行好评或差评
- **会话管理**: 在侧边栏创建新对话或切换对话
- **Markdown 渲染**: AI回复支持代码高亮、列表、引用等格式

### 流式输出体验

- AI回复会逐字显示，提供打字机效果
- 用户可以看到AI正在"思考"和"回复"
- 响应速度更快，无需等待完整回复
- 支持随时终止生成过程

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **UI库**: React 19 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks
- **API**: Next.js API Routes
- **Markdown**: React Markdown + Remark GFM
- **流式处理**: Web Streams API
- **终止控制**: AbortController API

## 📝 开发计划

### ✅ 已完成功能

- ✅ **💾 消息历史保存** - 完整的对话记录存储
- ✅ **✨ 代码高亮** - 语法高亮显示
- ✅ **📝 Markdown渲染** - 丰富的格式支持
- ✅ **🔄 消息重新生成** - 重新生成AI回复
- ✅ **🤖 多模型支持** - 多个AI模型集成
- ✅ **🔌 真实AI服务** - 真实API调用集成
- ✅ **🛡️ Hydration修复** - React Hydration错误修复
- ✅ **🔄 模型自动映射** - 前端模型名→服务商真实模型名
- ✅ **📋 详细错误信息** - 完整的错误提示
- ✅ **⚡ Token限制处理** - 自动处理Token限制
- ✅ **🔗 消息配对重新生成** - 基于对应用户消息重新生成
- ✅ **⏰ 响应式时间显示** - 客户端时间渲染
- ✅ **🌐 多服务商兼容** - 支持多个服务商兼容端点
- ✅ **🚀 流式输出功能** - 实时流式响应
- ✅ **⏹️ 终止生成功能** - 随时终止AI回答
- ✅ **🔧 代码重构模块化** - 代码结构优化
- ✅ **🗄️ MySQL数据库集成** - 完整数据库支持
- ✅ **💾 数据持久化** - 自动保存聊天记录
- ✅ **🔍 数据库记录修复** - 确保API响应包含provider信息

### 🔄 即将添加的功能

- 🔄 **📁 文件上传支持** - 支持文件上传和处理
- 🔄 **🎤 语音输入** - 语音识别输入
- 🔄 **✏️ 消息编辑/删除** - 消息管理功能
- 🔄 **📤 导出聊天记录** - 导出为多种格式
- 🔄 **👤 用户认证** - 用户注册登录系统
- 🔄 **🌐 多语言支持** - 国际化界面
- 🔄 **⚡ 流式响应优化** - 流式性能优化
- 🔄 **📚 对话历史持久化** - 历史记录管理
- 🔄 **💬 多轮对话上下文** - 上下文管理功能

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. 🍴 **Fork 项目** - Fork 本仓库到您的账户
2. 🌿 **创建分支** - `git checkout -b feature/AmazingFeature`
3. 💾 **提交更改** - `git commit -m 'Add some AmazingFeature'`
4. 📤 **推送分支** - `git push origin feature/AmazingFeature`
5. 🔄 **提交PR** - 打开 Pull Request 并描述您的更改

### 📋 贡献规范

- ✅ 遵循现有的代码风格和规范
- ✅ 添加适当的注释和文档
- ✅ 确保所有测试通过
- ✅ 更新相关文档和README

## 📄 许可证

本项目采用 **MIT 许可证** - 查看 [LICENSE](LICENSE) 文件了解详情。

📜 **MIT 许可证特点：**

- 🆓 允许自由使用、修改和分发
- 📝 要求保留版权声明
- ⚖️ 不提供任何担保
- 🔓 非常宽松的开源许可证

## 🙏 致谢

感谢以下优秀项目和服务的支持：

- ⚡ **[Next.js](https://nextjs.org/)** - 全栈 React 框架
- ⚛️ **[React](https://reactjs.org/)** - 声明式 UI 库
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- 🌙 **[月之暗面](https://www.moonshot.cn/)** - Kimi 大模型
- 🤖 **[OpenAI](https://openai.com/)** - GPT 系列模型
- 🚀 **[字节跳动](https://www.bytedance.com/)** - 豆包大模型
- 🦁 **[腾讯](https://www.tencent.com/)** - 混元大模型
- 🔍 **[深度求索](https://deepseek.com/)** - DeepSeek 模型
- ☁️ **[阿里云](https://www.aliyun.com/)** - 通义千问模型
- 🗄️ **[MySQL](https://www.mysql.com/)** - 关系型数据库
- 💙 **[TypeScript](https://www.typescriptlang.org/)** - JavaScript 超集

## 📞 支持与帮助

如果您在使用过程中遇到问题，请按以下步骤排查：

### 🔍 常见问题排查

1. 📖 **查看文档** - 仔细阅读 [MYSQL_CONFIG_GUIDE.md](MYSQL_CONFIG_GUIDE.md) 获取数据库配置帮助
2. ⚙️ **检查配置** - 确认环境变量配置正确无误
3. 🗄️ **数据库状态** - 确保MySQL服务正常运行且可连接
4. 🐛 **查看日志** - 检查浏览器控制台和服务器日志中的错误信息
5. 🐛 **提交Issue** - 提交 [Issue](https://github.com/your-username/your-repo/issues) 描述详细问题

### 🚨 紧急问题

- 🔥 **数据库连接失败** - 检查MySQL服务状态和连接参数
- 🔑 **API密钥错误** - 确认AI模型API密钥有效且正确配置
- 💾 **磁盘空间不足** - 确保服务器有足够的存储空间
- 🌐 **网络问题** - 检查网络连接和防火墙设置

---

## 🎉 开始使用

现在您已经完成了所有配置，可以开始享受与AI聊天的乐趣了！

✨ **功能体验建议：**

- 🎯 尝试不同的AI模型，体验各自的特色
- 💬 测试流式输出的实时效果
- ⏹️ 体验终止生成功能的便捷性
- 🔄 使用重新生成功能获得更好的回答
- 💾 验证数据持久化功能的可靠性

**祝您使用愉快！** 🎊

