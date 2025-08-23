import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: '数据库表初始化成功'
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '数据库初始化失败',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: '数据库表初始化成功'
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '数据库初始化失败',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}