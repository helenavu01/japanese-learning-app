#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Config
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

if (!CLAUDE_API_KEY) {
  console.error('❌ Error: CLAUDE_API_KEY not set');
  console.error('Set it: export CLAUDE_API_KEY=sk-ant-...');
  process.exit(1);
}

const userQuery = process.argv.slice(2).join(' ');
if (!userQuery) {
  console.error('❌ Usage: node claude-add-vocab.js "あなたの質問"');
  console.error('Example: node claude-add-vocab.js "友達 って何ですか？"');
  process.exit(1);
}

console.log(`\n📝 Hỏi Claude: "${userQuery}"\n`);

// Call Claude API
const claudePrompt = `Người dùng hỏi tiếng Nhật: "${userQuery}"

Hãy trích xuất thông tin từ vựng/ngữ pháp từ câu hỏi trên và trả về JSON với định dạng sau:
{
  "word_ja": "từ tiếng Nhật (Kanji nếu có)",
  "reading": "Hiragana hoặc Katakana",
  "meaning_vi": "Nghĩa tiếng Việt (ngắn gọn)",
  "example": "Ví dụ câu tiếng Nhật",
  "example_meaning": "Nghĩa của câu ví dụ (tiếng Việt)",
  "level": "N5|N4|N3|N2|N1 (ước lượng)"
}

CHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT KHÁC.`;

const claudeRequest = JSON.stringify({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 500,
  messages: [
    {
      role: 'user',
      content: claudePrompt,
    },
  ],
});

const options = {
  hostname: 'api.anthropic.com',
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(claudeRequest),
  },
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', async () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.error('❌ Claude API Error:', response.error.message);
        process.exit(1);
      }

      const content = response.content[0].text;
      console.log('Claude response:', content, '\n');

      // Parse JSON từ response
      let vocab;
      try {
        vocab = JSON.parse(content);
      } catch (e) {
        // Thử tìm JSON trong response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          vocab = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse JSON from Claude response');
        }
      }

      // Validate required fields
      if (!vocab.word_ja || !vocab.meaning_vi) {
        console.error('❌ Invalid response from Claude (missing required fields)');
        process.exit(1);
      }

      // Add to backend
      console.log('📤 Adding to app...\n');
      await addVocabToBackend(vocab);
    } catch (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
  process.exit(1);
});

req.write(claudeRequest);
req.end();

// Add vocabulary to backend
async function addVocabToBackend(vocab) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(vocab);

    const url = new URL(`${BACKEND_URL}/api/vocabulary`);
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 201) {
            console.log('✅ Từ vựng đã được thêm vào app!\n');
            console.log('📚 Chi tiết:');
            console.log(`   Từ Nhật: ${vocab.word_ja}`);
            console.log(`   Reading: ${vocab.reading}`);
            console.log(`   Nghĩa: ${vocab.meaning_vi}`);
            console.log(`   Ví dụ: ${vocab.example}`);
            console.log(`   Mức độ: ${vocab.level}\n`);
            console.log('🎯 Vào ứng dụng để ôn tập: http://localhost:3000');
            resolve();
          } else {
            reject(new Error(`Backend error: ${res.statusCode}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}
