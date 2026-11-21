const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock database (in-memory, will use SQLite/PostgreSQL later)
let vocabularies = [];
let quizzes = [];

// API: Thêm từ vựng (tự động từ Claude API)
app.post('/api/vocabulary', (req, res) => {
  const { word_ja, reading, meaning_vi, example, example_meaning, level } = req.body;

  if (!word_ja || !meaning_vi) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const vocab = {
    id: vocabularies.length + 1,
    word_ja,
    reading: reading || '',
    meaning_vi,
    example: example || '',
    example_meaning: example_meaning || '',
    level: level || 'N4',
    created_at: new Date(),
  };

  vocabularies.push(vocab);
  res.status(201).json(vocab);
});

// API: Lấy từ random để quiz
app.get('/api/quiz/random', (req, res) => {
  if (vocabularies.length === 0) {
    return res.status(200).json({ message: 'No vocabularies yet' });
  }

  const vocab = vocabularies[Math.floor(Math.random() * vocabularies.length)];

  // Tạo 4 đáp án (1 đúng + 3 sai random)
  const wrongAnswers = vocabularies
    .filter(v => v.id !== vocab.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(v => v.meaning_vi);

  const answers = [vocab.meaning_vi, ...wrongAnswers].sort(() => Math.random() - 0.5);

  res.json({
    id: vocab.id,
    word_ja: vocab.word_ja,
    reading: vocab.reading,
    example: vocab.example,
    example_meaning: vocab.example_meaning,
    answers,
    correct_answer: vocab.meaning_vi,
  });
});

// API: Ghi nhận đáp án
app.post('/api/quiz/:id/answer', (req, res) => {
  const { answer } = req.body;
  const vocab = vocabularies.find(v => v.id == req.params.id);

  if (!vocab) {
    return res.status(404).json({ error: 'Vocabulary not found' });
  }

  const is_correct = answer === vocab.meaning_vi;
  const quiz_response = {
    vocab_id: vocab.id,
    is_correct,
    answered_at: new Date(),
  };

  quizzes.push(quiz_response);
  res.json(quiz_response);
});

// API: Lấy thống kê
app.get('/api/stats', (req, res) => {
  const total_vocab = vocabularies.length;
  const total_quizzes = quizzes.length;
  const correct_answers = quizzes.filter(q => q.is_correct).length;
  const accuracy = total_quizzes > 0 ? ((correct_answers / total_quizzes) * 100).toFixed(2) : 0;

  res.json({
    total_vocab,
    total_quizzes,
    correct_answers,
    accuracy: `${accuracy}%`,
  });
});

// API: Danh sách từ vựng
app.get('/api/vocabulary', (req, res) => {
  res.json(vocabularies);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
