import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authResult = useAuth();
  
  const user = authResult?.user || null;
  const loading = authResult?.loading || false;

  const [kviz, setKviz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_API_URL}/kviz/${id}`)
      .then((res) => res.json())
      .then((data) => setKviz(data))
      .catch((err) => console.error("Greška pri učitavanju:", err));
  }, [id]);

  useEffect(() => {
    if (!userId || !id) return;

    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/completed`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const done = data.find((q) => q.quizId === id);
          if (done) setAlreadyDone(true);
        }
      })
      .catch((err) => console.error("Greška pri proveri:", err));
  }, [userId, id]);

  useEffect(() => {
    if (finished && userId && id) {
      fetch(`${process.env.REACT_APP_API_URL}/kviz/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, score }),
      })
        .then((res) => res.json())
        .catch((err) => console.error("Greška pri slanju:", err));
    }
  }, [finished, userId, id]);

  const handleAnswer = (i) => {
    if (alreadyDone || showFeedback) return;

    setSelectedAnswer(i);
    setShowFeedback(true);

    if (i === kviz.questions[currentQ].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setCurrentQ((prev) => {
        const next = prev + 1;
        if (next >= kviz.questions.length) {
          setFinished(true);
          return prev;
        }
        setSelectedAnswer(null);
        setShowFeedback(false);
        return next;
      });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" }}>
        <div className="text-center">
          <div className="spinner-border text-white mb-3" role="status" style={{ width: "60px", height: "60px" }}>
            <span className="visually-hidden">Učitavanje...</span>
          </div>
          <p className="text-white fs-5">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
        <div className="card border-0 shadow-lg" style={{ borderRadius: "30px", maxWidth: "500px" }}>
          <div className="card-body p-5 text-center">
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔐</div>
            <h2 className="card-title mb-3" style={{ color: "#f5576c", fontWeight: "bold" }}>Nisi logovan</h2>
            <p className="card-text text-muted fs-5">Moraš da se loguješ da bi rešio kviz i sakupio poene!</p>
          </div>
        </div>
      </div>
    );
  }

  if (!kviz) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" }}>
        <div className="text-center">
          <div style={{ fontSize: "60px", animation: "bounce 1s infinite" }} className="mb-3">📚</div>
          <p className="text-white fs-5">Učitavanje kviza...</p>
        </div>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" }}>
        <div className="card border-0 shadow-lg" style={{ borderRadius: "30px", maxWidth: "500px" }}>
          <div className="card-body p-5 text-center">
            <div style={{ fontSize: "100px", marginBottom: "20px" }}>✅</div>
            <h2 className="card-title mb-3" style={{ color: "#2ecc71", fontWeight: "bold" }}>Već si rešio kviz!</h2>
            <p className="card-text text-muted fs-5">Ovaj kviz možeš rešiti samo jednom. Pokušaj sa drugim kvizom!</p>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / kviz.questions.length) * 100);
    let message = "";
    let emoji = "";
    let color = "";

    if (percentage === 100) {
      message = "Savršeno! Sve si tačno!";
      emoji = "🏆";
      color = "#f39c12";
    } else if (percentage >= 80) {
      message = "Fantastično! Odličan rezultat!";
      emoji = "🌟";
      color = "#e74c3c";
    } else if (percentage >= 60) {
      message = "Bravo! Dobar pokušaj!";
      emoji = "😊";
      color = "#3498db";
    } else if (percentage >= 40) {
      message = "Nastavi da vežbaš!";
      emoji = "💪";
      color = "#9b59b6";
    } else {
      message = "Pokušaj ponovo!";
      emoji = "🚀";
      color = "#1abc9c";
    }

    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
        <div className="card border-0 shadow-lg" style={{ borderRadius: "30px", maxWidth: "500px", overflow: "hidden" }}>
          <div className="card-body p-5 text-center">
            <div style={{ fontSize: "120px", marginBottom: "30px", animation: "pulse 1s infinite" }}>{emoji}</div>
            
            <h2 className="card-title mb-2" style={{ color: color, fontWeight: "bold", fontSize: "32px" }}>Završio si kviz!</h2>
            <p className="text-muted mb-4" style={{ fontSize: "18px" }}>{message}</p>
            
            <div className="mb-4" style={{
              background: "#f8f9fa",
              borderRadius: "20px",
              padding: "30px",
              border: `4px solid ${color}`
            }}>
              <div style={{ fontSize: "60px", fontWeight: "bold", color: color }}>
                {score}/{kviz.questions.length}
              </div>
              <div className="text-muted" style={{ fontSize: "18px", marginTop: "10px" }}>
                Tačnih odgovora: <strong>{percentage}%</strong>
              </div>
            </div>

            <div className="progress mb-4" style={{ height: "25px", borderRadius: "15px", background: "#e0e0e0" }}>
              <div 
                className="progress-bar" 
                style={{ width: `${percentage}%`, background: `linear-gradient(90deg, #667eea 0%, ${color} 100%)`, borderRadius: "15px" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = kviz.questions[currentQ];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;

  return (
    <div className="min-vh-100 p-2" style={{ background: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)" }}>
      <div className="container" style={{ maxWidth: "600px", paddingTop: "15px", paddingBottom: "30px" }}>
        
        {/* Header */}
        <div className="mb-3 text-center text-white">
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
            {kviz.icon} {kviz.title}
          </h1>
          <p style={{ fontSize: "16px", opacity: 0.9, margin: 0 }}>{kviz.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "16px" }}>
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ff6a88" }}>
                Pitanje {currentQ + 1} od {kviz.questions.length}
              </span>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ff6a88" }}>
                ⭐ Poena: {score}
              </span>
            </div>
            <div className="progress" style={{ height: "14px", borderRadius: "10px" }}>
              <div 
                className="progress-bar" 
                style={{
                  width: `${((currentQ + 1) / kviz.questions.length) * 100}%`,
                  background: "linear-gradient(90deg, #ff9a56 0%, #ff6a88 100%)"
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card border-0 shadow-lg mb-3" style={{ borderRadius: "22px", overflow: "hidden" }}>
          <div className="card-body p-4 text-center">
            <div style={{ fontSize: "48px", marginBottom: "18px" }}>❓</div>
            <h3 style={{ color: "#333", fontWeight: "bold", fontSize: "22px", lineHeight: "1.6" }}>
              {question.text}
            </h3>
          </div>
        </div>

        {/* Answer Options */}
        <div className="row g-2 mb-3">
          {question.options.map((option, i) => {
            let buttonStyle = {
              background: "#ffffff",
              border: "3px solid #ddd",
              color: "#333",
              fontWeight: "bold",
              fontSize: "18px",
              borderRadius: "16px",
              padding: "18px",
              cursor: alreadyDone ? "not-allowed" : showFeedback ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              transform: "scale(1)"
            };

            if (showFeedback && isAnswered) {
              if (i === question.correctAnswer) {
                buttonStyle.background = "#2ecc71";
                buttonStyle.border = "3px solid #27ae60";
                buttonStyle.color = "white";
                buttonStyle.transform = "scale(1.05)";
              } else if (i === selectedAnswer && !isCorrect) {
                buttonStyle.background = "#e74c3c";
                buttonStyle.border = "3px solid #c0392b";
                buttonStyle.color = "white";
                buttonStyle.transform = "scale(0.95)";
              } else {
                buttonStyle.opacity = 0.5;
              }
            } else if (i === selectedAnswer && !showFeedback) {
              buttonStyle.background = "#ff9a56";
              buttonStyle.border = "3px solid #ff9a56";
              buttonStyle.color = "white";
              buttonStyle.transform = "scale(1.05)";
            }

            return (
              <div key={i} className="col-12">
                <button
                  onClick={() => handleAnswer(i)}
                  className="btn w-100"
                  style={buttonStyle}
                  disabled={alreadyDone || showFeedback}
                >
                  <span style={{ fontSize: "18px", marginRight: "10px" }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                  {showFeedback && i === question.correctAnswer && <span style={{ marginLeft: "10px" }}>✅</span>}
                  {showFeedback && i === selectedAnswer && !isCorrect && <span style={{ marginLeft: "10px" }}>❌</span>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className="card border-0 shadow-sm" style={{
            borderRadius: "16px",
            background: isCorrect ? "#d4edda" : "#f8d7da",
            border: `2px solid ${isCorrect ? "#28a745" : "#f5c6cb"}`
          }}>
            <div className="card-body text-center p-3">
              <div style={{ fontSize: "42px", marginBottom: "10px" }}>
                {isCorrect ? "🎉" : "💭"}
              </div>
              <p style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: isCorrect ? "#155724" : "#721c24",
                margin: 0
              }}>
                {isCorrect ? "Odličan odgovor!" : "Pokušaj ponovo!"}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}