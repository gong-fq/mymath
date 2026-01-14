// netlify/functions/deepseek.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, max_tokens = 600, temperature = 0.7 } = JSON.parse(event.body);
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '服务器配置错误：未设置 API 密钥' })
      };
    }

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
        stream: false // 修改：关闭流式输出以提高稳定性
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'DeepSeek API 调用失败', details: data })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) // 直接返回完整 JSON
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器内部错误', message: error.message })
    };
  }
};