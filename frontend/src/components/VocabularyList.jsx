import { API_URL } from '../api';
import { useState, useEffect } from 'react';

function VocabularyList() {
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocabs();
  }, []);

  const fetchVocabs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vocabulary`);
      const data = await res.json();
      setVocabs(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="vocab-list-page">
      <h2>Danh sách từ vựng ({vocabs.length})</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : vocabs.length === 0 ? (
        <p className="empty-message">Chưa có từ vựng. Hãy thêm từ!</p>
      ) : (
        <table className="vocab-table">
          <thead>
            <tr>
              <th>Từ Nhật</th>
              <th>Hiragana</th>
              <th>Nghĩa Việt</th>
              <th>Ví dụ</th>
              <th>Mức độ</th>
            </tr>
          </thead>
          <tbody>
            {vocabs.map(v => (
              <tr key={v.id}>
                <td>{v.word_ja}</td>
                <td>{v.reading}</td>
                <td>{v.meaning_vi}</td>
                <td>{v.example}</td>
                <td>{v.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VocabularyList;
