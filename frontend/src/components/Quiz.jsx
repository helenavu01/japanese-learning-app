import { useState, useEffect } from 'react';

function Quiz({ onAnswered }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    setResult(null);
    setSelectedAnswer(null);
    try {
      const res = await fetch('/api/quiz/random');
      const data = await res.json();
      if (data.id) {
        setQuiz(data);
      } else {
        setLoading(false);
        setResult({ message: 'Chưa có từ vựng. Hãy thêm từ trước!' });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAnswer = async (answer) => {
    setSelectedAnswer(answer);
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json();
      setResult({
        is_correct: data.is_correct,
        correct_answer: quiz.correct_answer,
        example: quiz.example,
        example_meaning: quiz.example_meaning,
      });
      onAnswered?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="quiz-page"><p>Đang tải...</p></div>;

  return (
    <div className="quiz-page">
      {!result ? (
        <div className="quiz-card">
          <div className="quiz-word-jp">{quiz?.word_ja}</div>
          <div className="quiz-reading">{quiz?.reading}</div>

          {quiz?.example && (
            <div className="quiz-example">
              <p className="label">Ví dụ:</p>
              <p>{quiz.example}</p>
            </div>
          )}

          <div className="quiz-answers">
            {quiz?.answers?.map((answer, idx) => (
              <button
                key={idx}
                className="answer-btn"
                onClick={() => handleAnswer(answer)}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`quiz-result ${result.is_correct ? 'correct' : 'incorrect'}`}>
          <div className="result-icon">{result.is_correct ? '✅' : '❌'}</div>
          <h3>{result.is_correct ? 'Đúng rồi!' : 'Sai rồi'}</h3>
          <p className="correct-answer">Đáp án: <strong>{result.correct_answer}</strong></p>
          {result.example_meaning && (
            <p className="example-meaning">Nghĩa của ví dụ: {result.example_meaning}</p>
          )}

          <button className="btn-primary" onClick={fetchQuiz}>
            Câu hỏi tiếp theo
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
