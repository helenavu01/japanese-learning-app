const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Storage: Postgres when DATABASE_URL is set, otherwise in-memory (local dev)
const { Pool } = require('pg');
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
    })
  : null;

const mem = { vocabularies: [], quizzes: [] };

async function initDb() {
  if (!pool) {
    console.log('DATABASE_URL not set: using in-memory storage');
    return;
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vocabularies (
      id SERIAL PRIMARY KEY,
      word_ja TEXT NOT NULL,
      reading TEXT NOT NULL DEFAULT '',
      meaning_vi TEXT NOT NULL,
      example TEXT NOT NULL DEFAULT '',
      example_meaning TEXT NOT NULL DEFAULT '',
      level TEXT NOT NULL DEFAULT 'N4',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      vocab_id INTEGER NOT NULL REFERENCES vocabularies(id) ON DELETE CASCADE,
      is_correct BOOLEAN NOT NULL,
      answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Postgres connected');
}

const db = {
  async addVocab(v) {
    if (!pool) {
      const vocab = { id: mem.vocabularies.length + 1, ...v, created_at: new Date() };
      mem.vocabularies.push(vocab);
      return vocab;
    }
    const { rows } = await pool.query(
      `INSERT INTO vocabularies (word_ja, reading, meaning_vi, example, example_meaning, level)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [v.word_ja, v.reading, v.meaning_vi, v.example, v.example_meaning, v.level]
    );
    return rows[0];
  },
  async listVocab() {
    if (!pool) return mem.vocabularies;
    return (await pool.query('SELECT * FROM vocabularies ORDER BY id')).rows;
  },
  async getVocab(id) {
    if (!pool) return mem.vocabularies.find(v => v.id == id);
    if (!/^\d+$/.test(String(id))) return undefined;
    return (await pool.query('SELECT * FROM vocabularies WHERE id = $1', [id])).rows[0];
  },
  async randomQuiz() {
    const all = await this.listVocab();
    if (all.length === 0) return null;
    const vocab = all[Math.floor(Math.random() * all.length)];
    const wrong = all
      .filter(v => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.meaning_vi);
    return { vocab, answers: [vocab.meaning_vi, ...wrong].sort(() => Math.random() - 0.5) };
  },
  async addQuiz(vocab_id, is_correct) {
    if (!pool) {
      const q = { vocab_id, is_correct, answered_at: new Date() };
      mem.quizzes.push(q);
      return q;
    }
    const { rows } = await pool.query(
      'INSERT INTO quizzes (vocab_id, is_correct) VALUES ($1,$2) RETURNING vocab_id, is_correct, answered_at',
      [vocab_id, is_correct]
    );
    return rows[0];
  },
  async quizCounts() {
    if (!pool) {
      return { total: mem.quizzes.length, correct: mem.quizzes.filter(q => q.is_correct).length };
    }
    const { rows } = await pool.query(
      'SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_correct)::int AS correct FROM quizzes'
    );
    return rows[0];
  },
};

// Express 5 forwards rejected promises to the error handler
// API: Thêm từ vựng (tự động từ Claude API)
app.post('/api/vocabulary', async (req, res) => {
  const { word_ja, reading, meaning_vi, example, example_meaning, level } = req.body;

  if (!word_ja || !meaning_vi) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const vocab = await db.addVocab({
    word_ja,
    reading: reading || '',
    meaning_vi,
    example: example || '',
    example_meaning: example_meaning || '',
    level: level || 'N4',
  });
  res.status(201).json(vocab);
});

// API: Lấy từ random để quiz
app.get('/api/quiz/random', async (req, res) => {
  const quiz = await db.randomQuiz();
  if (!quiz) {
    return res.status(200).json({ message: 'No vocabularies yet' });
  }
  const { vocab, answers } = quiz;
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
app.post('/api/quiz/:id/answer', async (req, res) => {
  const { answer } = req.body;
  const vocab = await db.getVocab(req.params.id);

  if (!vocab) {
    return res.status(404).json({ error: 'Vocabulary not found' });
  }

  const q = await db.addQuiz(vocab.id, answer === vocab.meaning_vi);
  res.json({ vocab_id: vocab.id, is_correct: q.is_correct, answered_at: q.answered_at });
});

// API: Lấy thống kê
app.get('/api/stats', async (req, res) => {
  const total_vocab = (await db.listVocab()).length;
  const { total, correct } = await db.quizCounts();
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;

  res.json({
    total_vocab,
    total_quizzes: total,
    correct_answers: correct,
    accuracy: `${accuracy}%`,
  });
});

// API: Danh sách từ vựng
app.get('/api/vocabulary', async (req, res) => {
  res.json(await db.listVocab());
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
initDb()
  .then(() => app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`)))
  .catch(err => {
    console.error('Failed to initialise database', err);
    process.exit(1);
  });
