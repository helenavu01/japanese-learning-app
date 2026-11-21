import { useState } from 'react';

function AddVocabulary({ onAdded }) {
  const [form, setForm] = useState({
    word_ja: '',
    reading: '',
    meaning_vi: '',
    example: '',
    example_meaning: '',
    level: 'N4',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({
          word_ja: '',
          reading: '',
          meaning_vi: '',
          example: '',
          example_meaning: '',
          level: 'N4',
        });
        setMessage('✅ Thêm từ thành công!');
        onAdded?.();
      } else {
        setMessage('❌ Lỗi thêm từ');
      }
    } catch (err) {
      setMessage('❌ Lỗi: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="add-vocab-page">
      <h2>Thêm từ vựng</h2>

      <form className="vocab-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Từ Nhật *</label>
          <input
            type="text"
            name="word_ja"
            value={form.word_ja}
            onChange={handleChange}
            placeholder="VD: 友達"
            required
          />
        </div>

        <div className="form-group">
          <label>Hiragana</label>
          <input
            type="text"
            name="reading"
            value={form.reading}
            onChange={handleChange}
            placeholder="VD: ともだち"
          />
        </div>

        <div className="form-group">
          <label>Nghĩa Việt *</label>
          <input
            type="text"
            name="meaning_vi"
            value={form.meaning_vi}
            onChange={handleChange}
            placeholder="VD: Bạn bè"
            required
          />
        </div>

        <div className="form-group">
          <label>Ví dụ</label>
          <input
            type="text"
            name="example"
            value={form.example}
            onChange={handleChange}
            placeholder="VD: 友達と一緒に行く"
          />
        </div>

        <div className="form-group">
          <label>Nghĩa của ví dụ</label>
          <input
            type="text"
            name="example_meaning"
            value={form.example_meaning}
            onChange={handleChange}
            placeholder="VD: Đi cùng bạn bè"
          />
        </div>

        <div className="form-group">
          <label>Mức độ JLPT</label>
          <select name="level" value={form.level} onChange={handleChange}>
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Thêm từ'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default AddVocabulary;
