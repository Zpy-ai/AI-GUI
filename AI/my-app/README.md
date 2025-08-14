# AI聊天助手 - 多模型支持

一个类似豆包的现代化AI聊天界面，支持多个不同的AI模型，具有美观的UI和丰富的功能。

## ✨ 功能特性

### 🤖 支持的AI模型
- **GPT-4o** - OpenAI最新多模态模型
- **豆包 Pro** - 字节跳动豆包大模型，通用对话与创作
- **腾讯混元 Pro** - 腾讯混元大模型，中文与工具调用能力强
- **DeepSeek Chat** - DeepSeek 对话/推理模型，性价比高
- **千问3-4B** - 阿里云开源模型，中文能力强

### 🎨 界面功能
- 现代化聊天界面设计
- 实时消息发送和接收
- 多模型选择器
- 消息操作按钮（复制、重新生成、反馈）
- 侧边栏会话管理
- 响应式设计，支持移动端
- 加载状态和错误处理
- **Markdown 渲染支持** - 代码高亮、列表、引用、标题等格式
- **消息重新生成** - 基于对应用户消息重新生成AI回复
- **Hydration 错误修复** - 解决服务端渲染时间显示问题
- **模型自动映射** - 前端模型名自动映射到服务商真实模型名
- **错误处理优化** - 详细的API错误信息显示
- **Token 限制处理** - 自动裁剪超出范围的 max_tokens 参数

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd my-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `env.example` 为 `.env.local`：
```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入你的API密钥：
```env
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
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔧 配置说明

### 最近修复与改进

#### 🐛 问题修复
- **Hydration 错误**：修复服务端与客户端时间渲染不一致导致的 React 水合错误
- **重新生成功能**：修复点击重新生成总是针对最后一条消息的问题，现在基于对应用户消息
- **Token 限制**：修复 DeepSeek 等模型的 max_tokens 超出范围导致的 400 错误
- **模型映射**：修复前端模型名与服务商真实模型名不匹配的问题

#### ✨ 功能增强
- **错误处理**：后端返回详细的错误信息，便于调试和问题定位
- **模型自动映射**：支持不同服务商的模型名自动映射（如 qwen2.5-72b → qwen-plus）
- **Markdown 支持**：完整的 Markdown 渲染，支持代码高亮、列表、引用等
- **多服务商兼容**：统一的 OpenAI 兼容接口，支持多个国内AI服务商

#### 🔧 技术优化
- **环境变量配置**：支持每个服务商的独立配置（API密钥、端点、模型名）
- **响应式设计**：优化移动端显示和交互体验
- **状态管理**：改进消息状态管理和重新生成逻辑

### API密钥获取

1. **OpenAI API**
   - 访问 [OpenAI Platform](https://platform.openai.com/)
   - 注册账号并获取API密钥

2. **Qwen API (阿里云百炼)**
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
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI最新多模态模型，支持图像和文本',
    maxTokens: 128000,
    pricing: '$5/1M tokens'
  },
  {
    id: 'doubao-pro',
    name: '豆包 Pro',
    description: '字节跳动豆包大模型，通用对话与创作',
    maxTokens: 32768,
    pricing: '按量计费'
  },
  // ... 其他模型
];
```

## 📁 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── route.ts          # 聊天API路由
│   │       └── stream/
│   │           └── route.ts      # 流式聊天API路由
│   ├── layout.tsx
│   └── page.tsx                  # 主页面
├── components/
│   ├── ModelSelector.tsx         # 模型选择器
│   ├── MessageActions.tsx        # 消息操作按钮
│   └── Sidebar.tsx               # 侧边栏
└── lib/
    └── api.ts                    # API服务
```

## 🔌 API集成

### 已集成的AI服务

项目已集成以下AI服务的真实API调用：

1. **Qwen (千问)** - 支持阿里云百炼兼容模式
2. **Doubao (豆包)** - OpenAI兼容接口
3. **Hunyuan (混元)** - OpenAI兼容接口  
4. **DeepSeek** - 官方API接口
5. **OpenAI** - 模拟响应（需手动集成）

### 启用真实AI服务

对于尚未集成的服务，在 `src/app/api/chat/route.ts` 中取消注释相应的SDK导入并配置API密钥。

示例（OpenAI）：
```typescript
import OpenAI from 'openai';

class OpenAIProvider implements AIProvider {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: request.model,
      messages: [{ role: 'user', content: request.message }],
      max_tokens: request.maxTokens,
      temperature: request.temperature
    });
    
    return {
      message: completion.choices[0].message.content || '',
      conversationId: request.conversationId || `conv_${Date.now()}`,
      model: request.model,
      usage: completion.usage
    };
  }
}
```

## 🎯 使用说明

### 基本操作
1. 在右上角选择想要使用的AI模型
2. 在输入框中输入问题
3. 点击发送按钮或按Enter键发送消息
4. 等待AI回复

### 高级功能
- **复制消息**: 点击消息下方的复制按钮
- **重新生成**: 点击重新生成按钮获取新的回复（基于对应的用户消息）
- **反馈**: 对AI回复进行好评或差评
- **会话管理**: 在侧边栏创建新对话或切换对话
- **Markdown 渲染**: AI回复支持代码高亮、列表、引用等格式

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **UI库**: React 19 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks
- **API**: Next.js API Routes
- **Markdown**: React Markdown + Remark GFM

## 📝 开发计划

### 已完成功能
- [x] 消息历史保存
- [x] 代码高亮
- [x] Markdown渲染
- [x] 消息重新生成
- [x] 多模型支持
- [x] 真实AI服务集成
- [x] Hydration 错误修复
- [x] 模型自动映射（前端模型名 → 服务商真实模型名）
- [x] 详细错误信息显示
- [x] Token 限制自动处理
- [x] 消息配对重新生成（基于对应用户消息）
- [x] 响应式时间显示（客户端渲染）
- [x] 多服务商兼容端点支持

### 即将添加的功能
- [ ] 文件上传支持
- [ ] 语音输入
- [ ] 消息编辑/删除
- [ ] 导出聊天记录
- [ ] 用户认证
- [ ] 多语言支持
- [ ] 流式响应优化

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交Issue或联系开发者。
