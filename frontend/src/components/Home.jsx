import { useEffect, useState } from 'react';

function Home({ stats, onRefresh }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [stats]);

  return (
    <div className="home-page">
      <h2>Hôm nay bạn có bao nhiêu từ để ôn?</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">{stats?.total_vocab || 0}</div>
            <div className="stat-label">Từ vựng</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.total_quizzes || 0}</div>
            <div className="stat-label">Bài tập làm</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.accuracy || '0%'}</div>
            <div className="stat-label">Độ chính xác</div>
          </div>
        </div>
      )}

      <button className="btn-primary" onClick={onRefresh}>
        Làm bài tập 🎯
      </button>
    </div>
  );
}

export default Home;
