import { NextRequest, NextResponse } from 'next/server';
import {
  getConversations,
  getConversation,
  getMessages,
  deleteConversation
} from '@/lib/chatService';

// 获取对话列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const conversations = await getConversations(limit, offset);
    
    return NextResponse.json({
      success: true,
      data: conversations,
      pagination: {
        limit,
        offset,
        total: conversations.length
      }
    });
  } catch (error) {
    console.error('获取对话列表失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '获取对话列表失败',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// 获取特定对话的详细信息
export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();
    
    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          message: '对话ID不能为空'
        },
        { status: 400 }
      );
    }
    
    const conversation = await getConversation(conversationId);
    const messages = await getMessages(conversationId);
    
    return NextResponse.json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    console.error('获取对话详情失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '获取对话详情失败',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// 删除对话
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');
    
    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          message: '对话ID不能为空'
        },
        { status: 400 }
      );
    }
    
    await deleteConversation(conversationId);
    
    return NextResponse.json({
      success: true,
      message: '对话删除成功'
    });
  } catch (error) {
    console.error('删除对话失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '删除对话失败',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}