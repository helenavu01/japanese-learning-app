# 🤖 Claude Integration Guide - Thêm từ vựng tự động

Hướng dẫn sử dụng Claude AI để tự động thêm từ vựng tiếng Nhật vào ứng dụng.

## 📋 Setup (Chỉ làm 1 lần)

### 1. Lấy Claude API Key

1. Vào https://console.anthropic.com
2. Đăng nhập hoặc tạo tài khoản
3. Vào **API Keys** → **Create Key**
4. Copy key (dạng `sk-ant-...`)

### 2. Cấu hình `.env`

Mở file `backend/.env`:

```bash
PORT=5000
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx  # Paste key vào đây
```

### 3. Install dependencies

```bash
npm install  # Nếu chưa cài
```

---

## 🎯 Cách sử dụng

### Setup 2 terminal

**Terminal 1** - Chạy Backend:
```bash
cd backend
npm start
# Output: Backend running on http://localhost:5000
```

**Terminal 2** - Chạy Frontend:
```bash
cd frontend
npm run dev
# Output: VITE v... ready in ... ms
```

**Terminal 3** - Chạy script add vocab:
```bash
node claude-add-vocab.js "hỏi từ vựng tiếng Nhật"
```

---

## 📝 Ví dụ sử dụng

### Hỏi 1 từ:
```bash
node claude-add-vocab.js "友達 って何ですか？"
```

**Output**:
```
📝 Hỏi Claude: "友達 って何ですか？"

Claude response: {"word_ja":"友達","reading":"ともだち","meaning_vi":"Bạn bè","example":"友達と一緒に行く","example_meaning":"Đi cùng bạn bè","level":"N4"}

📤 Adding to app...

✅ Từ vựng đã được thêm vào app!

📚 Chi tiết:
   Từ Nhật: 友達
   Reading: ともだち
   Nghĩa: Bạn bè
   Ví dụ: 友達と一緒に行く
   Mức độ: N4

🎯 Vào ứng dụng để ôn tập: http://localhost:3000
```

### Hỏi ngữ pháp:
```bash
node claude-add-vocab.js "〜ている の用法を教えてください"
```

### Hỏi cách dùng:
```bash
node claude-add-vocab.js "とても と 非常に の違いは何ですか？"
```

---

## 🔄 Luồng hoạt động

```
Đồng chí chạy script
       ↓
node claude-add-vocab.js "..."
       ↓
Claude API (trích xuất từ + giải thích)
       ↓
JSON response
       ↓
POST /api/vocabulary
       ↓
Backend lưu DB
       ↓
✅ App cập nhật (reload trang để thấy)
```

---

## ⚙️ Troubleshooting

### ❌ Error: CLAUDE_API_KEY not set
**Giải pháp**: 
```bash
export CLAUDE_API_KEY=sk-ant-xxxxx
# hoặc điền vào file backend/.env
```

### ❌ Error: Backend not responding
**Giải pháp**:
```bash
# Terminal 1: Chắc chắn backend chạy
cd backend && npm start

# Check: http://localhost:5000/api/stats
```

### ❌ Error: Could not parse JSON from Claude
**Giải pháp**: 
- Claude response không hợp lệ
- Thử hỏi lại với cách khác
- VD: `node claude-add-vocab.js "日本語の「学ぶ」の意味は？"`

---

## 💡 Tips & Tricks

### 1. Batch add multiple vocabularies
```bash
# Viết script để loop:
for word in "学ぶ" "教える" "読む"; do
  node claude-add-vocab.js "$word"
done
```

### 2. Add từ theo chủ đề
```bash
# Từ vựng du lịch
node claude-add-vocab.js "駅 (eki) - trạm/nhà ga"
node claude-add-vocab.js "ホテル (hoteru) - khách sạn"
node claude-add-vocab.js "地図 (chizu) - bản đồ"
```

### 3. Thêm thủ công qua Web UI
Nếu không muốn dùng script, vào app → tab "Thêm từ" → paste từ

---

## 📱 Mobile workflow

1. **Học trên di động**: Vào http://localhost:3000 trên browser mobile
2. **Thêm từ từ máy tính**: Chạy script trên terminal
3. **Reload app mobile**: Từ mới sẽ hiển thị

---

## 🚀 Next: Tự động hơn (v2+)

- [ ] Discord bot: `/vocab 友達` → tự động thêm
- [ ] Telegram bot: Hỏi từ qua Telegram
- [ ] Browser extension: Highlight từ trên web → thêm vào app
- [ ] Voice input: Hỏi từ bằng giọng nói

---

**Cần giúp?** Báo cáo lỗi hoặc tạo issue trên GitHub.

Happy learning! 🗾✨
