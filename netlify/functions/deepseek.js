// netlify/functions/deepseek.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, max_tokens = 600, temperature = 0.7 } = JSON.parse(event.body);

    // 从环境变量获取 API 密钥
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '服务器配置错误：未设置 API 密钥' })
      };
    }

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature,
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API 错误:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'DeepSeek API 调用失败', details: errorText })
      };
    }

    // 返回流式响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      body: response.body
    };

  } catch (error) {
    console.error('Function 错误:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器内部错误', message: error.message })
    };
  }
};
