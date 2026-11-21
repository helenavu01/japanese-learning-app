import { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Home from './components/Home';
import VocabularyList from './components/VocabularyList';
import AddVocabulary from './components/AddVocabulary';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>🗾 Japanese Learning</h1>
        <div className="nav-links">
          <button onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>
            Home
          </button>
          <button onClick={() => setPage('quiz')} className={page === 'quiz' ? 'active' : ''}>
            Quiz
          </button>
          <button onClick={() => setPage('vocabulary')} className={page === 'vocabulary' ? 'active' : ''}>
            Danh sách
          </button>
          <button onClick={() => setPage('add')} className={page === 'add' ? 'active' : ''}>
            Thêm từ
          </button>
        </div>
      </nav>

      <main className="main-content">
        {page === 'home' && <Home stats={stats} onRefresh={fetchStats} />}
        {page === 'quiz' && <Quiz onAnswered={fetchStats} />}
        {page === 'vocabulary' && <VocabularyList />}
        {page === 'add' && <AddVocabulary onAdded={fetchStats} />}
      </main>
    </div>
  );
}

export default App;
