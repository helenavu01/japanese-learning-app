# 🗾 Japanese Learning App - MVP

Ứng dụng học tiếng Nhật với flashcard + quiz random. Hỏi từ vựng qua Claude → tự động cập nhật vào ứng dụng để ôn tập hàng ngày.

## 🎯 Công dụng chính

- **Flashcard + Quiz**: Mỗi ngày vài phút làm quiz từ random
- **Học tập hiệu quả**: Từ từ nhiều ngày khác nhau, có giải thích chi tiết
- **Tự động cập nhật**: Hỏi từ vựng qua Claude → tự động lưu vào database

## 🏗️ Kiến trúc

```
japanese-learning-app/
├── backend/              # Node.js + Express API
│   ├── server.js         # API endpoints
│   ├── package.json
│   └── .env.example
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/   # Home, Quiz, VocabularyList, AddVocabulary
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
└── docs/                 # Tài liệu
```

## 🚀 Cài đặt & Chạy

### 1. Cài đặt Backend

```bash
cd backend
npm install
npm start
# Server chạy tại http://localhost:5000
```

### 2. Cài đặt Frontend

```bash
cd frontend
npm install
npm run dev
# App chạy tại http://localhost:3000
```

### 3. Thêm từ vựng (thủ công hoặc qua Claude)

**Qua UI**: Vào tab "Thêm từ" → điền thông tin → submit

**Qua API** (khi Claude tự động gọi):
```bash
curl -X POST http://localhost:5000/api/vocabulary \
  -H "Content-Type: application/json" \
  -d '{
    "word_ja": "友達",
    "reading": "ともだち",
    "meaning_vi": "Bạn bè",
    "example": "友達と一緒に行く",
    "example_meaning": "Đi cùng bạn bè",
    "level": "N4"
  }'
```

## 📋 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/vocabulary` | Lấy danh sách tất cả từ |
| POST | `/api/vocabulary` | Thêm từ vựng mới |
| GET | `/api/quiz/random` | Lấy 1 quiz random |
| POST | `/api/quiz/:id/answer` | Ghi nhận đáp án |
| GET | `/api/stats` | Lấy thống kê |

## 🎓 Cách sử dụng

1. **Mở ứng dụng**: http://localhost:3000
2. **Thêm từ vựng**: Tab "Thêm từ" → paste từ hoặc hỏi Claude
3. **Làm bài tập**: Tab "Quiz" → chọn đáp án → xem giải thích
4. **Xem danh sách**: Tab "Danh sách" → review tất cả từ đã học
5. **Tracking**: Tab "Home" → xem stats (tổng từ, bài tập làm, độ chính xác)

## 🔧 Tính năng MVP

- ✅ Thêm từ vựng (manual + auto từ Claude)
- ✅ Quiz random với 4 đáp án
- ✅ Giải thích chi tiết (ví dụ, cách dùng)
- ✅ Danh sách từ đã học
- ✅ Thống kê (tổng từ, % đúng)
- ⏳ SRS (Space Repetition System) - v2 sau
- ⏳ Import CSV từ bên ngoài - v2 sau

## 🔐 Environment Variables

Tạo file `.env` trong folder `backend`:

```
PORT=5000
CLAUDE_API_KEY=your_key_here
```

## 📱 Mobile-friendly

Frontend đã responsive với mobile. Deploy lên Vercel/Netlify để sử dụng trên điện thoại.

## 🚀 Deploy

**Frontend** (Vercel):
```bash
cd frontend
npm run build
# Deploy build/ folder to Vercel
```

**Backend** (Railway/Render):
```bash
cd backend
npm start
```

## 📝 Tương lai (v2+)

- [ ] SRS (spaced repetition)
- [ ] Heatmap học tập
- [ ] Import/Export CSV
- [ ] Mobile app (React Native)
- [ ] Authentication & cloud sync
- [ ] Lịch học (daily reminder)
- [ ] Phát âm (audio từ)

---

**Tác giả**: Helen & Tien  
**Ngôn ngữ**: Tiếng Nhật + Tiếng Việt + Code (Tiếng Anh)  
**License**: MIT
