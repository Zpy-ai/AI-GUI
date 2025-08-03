# AI聊天助手 - 多模型支持

一个类似豆包的现代化AI聊天界面，支持五个不同的AI模型，具有美观的UI和丰富的功能。

## ✨ 功能特性

### 🤖 支持的AI模型
- **GPT-4o** - OpenAI最新多模态模型
- **GPT-4 Turbo** - OpenAI高性能模型
- **Claude 3.5 Sonnet** - Anthropic推理模型
- **Gemini 1.5 Pro** - Google多模态模型
- **Qwen2.5-72B** - 阿里云中文模型

### 🎨 界面功能
- 现代化聊天界面设计
- 实时消息发送和接收
- 多模型选择器
- 消息操作按钮（复制、重新生成、反馈）
- 侧边栏会话管理
- 响应式设计，支持移动端
- 加载状态和错误处理

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

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI API
GOOGLE_API_KEY=your_google_api_key_here

# Qwen API
QWEN_API_KEY=your_qwen_api_key_here
QWEN_API_ENDPOINT=https://api.qwen.ai/v1
```

### 4. 安装AI服务SDK
```bash
# OpenAI
npm install openai

# Anthropic (Claude)
npm install @anthropic-ai/sdk

# Google AI
npm install @google/generative-ai
```

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔧 配置说明

### API密钥获取

1. **OpenAI API**
   - 访问 [OpenAI Platform](https://platform.openai.com/)
   - 注册账号并获取API密钥

2. **Anthropic API**
   - 访问 [Anthropic Console](https://console.anthropic.com/)
   - 注册账号并获取API密钥

3. **Google AI API**
   - 访问 [Google AI Studio](https://aistudio.google.com/)
   - 获取API密钥

4. **Qwen API**
   - 可通过阿里云或其他Qwen API服务商获取

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

### 启用真实AI服务

1. 在 `src/app/api/chat/route.ts` 中取消注释相应的SDK导入
2. 配置API密钥
3. 替换模拟响应为真实AI调用

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
- **重新生成**: 点击重新生成按钮获取新的回复
- **反馈**: 对AI回复进行好评或差评
- **会话管理**: 在侧边栏创建新对话或切换对话

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **UI库**: React 19 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks
- **API**: Next.js API Routes

## 📝 开发计划

### 即将添加的功能
- [ ] 消息历史保存
- [ ] 文件上传支持
- [ ] 语音输入
- [ ] 代码高亮
- [ ] Markdown渲染
- [ ] 消息编辑/删除
- [ ] 导出聊天记录
- [ ] 用户认证
- [ ] 多语言支持

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请提交Issue或联系开发者。
