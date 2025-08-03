# AI聊天界面 - API接口总结表

## 概述
这是一个类似豆包的AI聊天界面，已预留好所有接口位置，等待实际AI服务集成。

## 前端接口调用

### 1. 普通聊天接口
**文件位置**: `src/lib/api.ts` - `callAIAPI` 函数
**接口地址**: `/api/chat`
**请求方法**: POST
**请求参数**:
```typescript
interface ChatRequest {
  message: string;           // 用户输入的消息
  conversationId?: string;   // 会话ID（可选）
  model?: string;           // AI模型名称（可选）
}
```
**响应格式**:
```typescript
interface ChatResponse {
  message: string;          // AI回复内容
  conversationId: string;   // 会话ID
  model: string;           // 使用的模型
  usage?: {                // 使用统计（可选）
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

### 2. 流式聊天接口
**文件位置**: `src/lib/api.ts` - `callAIStreamAPI` 函数
**接口地址**: `/api/chat/stream`
**请求方法**: POST
**功能**: 支持实时流式响应，逐字显示AI回复

## 后端API路由

### 1. 普通聊天路由
**文件位置**: `src/app/api/chat/route.ts`
**需要集成**: 实际的AI服务API（如OpenAI、Claude等）

### 2. 流式聊天路由
**文件位置**: `src/app/api/chat/stream/route.ts`
**需要集成**: 支持流式响应的AI服务API

## 支持的AI模型

### 已集成的模型：
1. **GPT-4o (OpenAI)**
   - 最新多模态模型，支持图像和文本
   - 最大长度: 128,000 tokens
   - 定价: $5/1M tokens
   - 文档: https://platform.openai.com/docs

2. **GPT-4 Turbo (OpenAI)**
   - 高性能模型，适合复杂任务
   - 最大长度: 128,000 tokens
   - 定价: $10/1M tokens

3. **Claude 3.5 Sonnet (Anthropic)**
   - 最新模型，推理能力强
   - 最大长度: 200,000 tokens
   - 定价: $3/1M tokens
   - 文档: https://docs.anthropic.com/

4. **Gemini 1.5 Pro (Google)**
   - 多模态模型，支持长文本
   - 最大长度: 1,000,000 tokens
   - 定价: $3.5/1M tokens
   - 文档: https://ai.google.dev/

5. **Qwen2.5-72B (阿里云)**
   - 开源模型，中文能力强
   - 最大长度: 32,768 tokens
   - 定价: 免费
   - 文档: https://qwen.readthedocs.io/

## 集成步骤

### 1. 安装AI服务SDK
```bash
# OpenAI
npm install openai

# Anthropic (Claude)
npm install @anthropic-ai/sdk

# Google AI
npm install @google/generative-ai

# 或其他AI服务SDK
```

### 2. 配置环境变量
复制 `env.example` 为 `.env.local` 并填入你的API密钥：
```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI API
GOOGLE_API_KEY=your_google_api_key_here

# Qwen API (阿里云或其他服务商)
QWEN_API_KEY=your_qwen_api_key_here
QWEN_API_ENDPOINT=https://api.qwen.ai/v1

# 默认配置
DEFAULT_MODEL=gpt-4o
MAX_TOKENS=1000
TEMPERATURE=0.7
```

### 3. 修改API路由
在 `src/app/api/chat/route.ts` 中：
- 取消注释相应的AI服务SDK导入
- 配置API密钥
- 替换模拟响应为真实AI调用

每个提供者类中都有详细的集成示例代码。

在 `src/app/api/chat/stream/route.ts` 中：
- 实现流式响应处理
- 配置流式AI服务

### 4. 错误处理
- API密钥验证
- 请求限制处理
- 网络错误处理
- 响应格式验证

## 界面功能

### 已实现功能：
- ✅ 现代化聊天界面
- ✅ 消息发送和接收
- ✅ 加载状态显示
- ✅ 自动滚动到最新消息
- ✅ 响应式设计
- ✅ 错误处理
- ✅ 时间戳显示
- ✅ 多模型选择器
- ✅ 消息操作按钮（复制、重新生成、反馈）
- ✅ 侧边栏会话管理
- ✅ 五个AI模型支持

### 可扩展功能：
- 🔄 消息历史保存
- 🔄 多会话管理
- 🔄 文件上传
- 🔄 语音输入
- 🔄 代码高亮
- 🔄 Markdown渲染
- 🔄 消息编辑/删除
- 🔄 导出聊天记录

## 技术栈
- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks
- **API**: Next.js API Routes

## 运行项目
```bash
npm install
npm run dev
```

访问 http://localhost:3000 查看界面

## 注意事项
1. 确保AI服务API密钥安全存储
2. 实现适当的请求频率限制
3. 添加用户认证和授权
4. 考虑数据隐私和合规性
5. 监控API使用量和成本 