import { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";

const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];

function App() {
  const [slots, setSlots] = useState(["🍒", "🍒", "🍒"]);
  const [message, setMessage] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const spinSound = useRef(null);
  const winSound = useRef(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("carbot86_username");
    const savedScore = localStorage.getItem("carbot86_score");
    const savedLeaderboard = localStorage.getItem("carbot86_leaderboard");

    if (savedUsername) {
      setUsername(savedUsername);
      setLoggedIn(true);
    }
    if (savedScore) {
      setScore(parseInt(savedScore));
    }
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("carbot86_username", username);
      localStorage.setItem("carbot86_score", score.toString());

      const updatedLeaderboard = [...leaderboard];
      const existing = updatedLeaderboard.find((entry) => entry.username === username);

      if (existing) {
        existing.score = score;
      } else {
        updatedLeaderboard.push({ username, score });
      }

      updatedLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem("carbot86_leaderboard", JSON.stringify(updatedLeaderboard));
    }
  }, [score]);

  const spin = () => {
    setSpinning(true);
    setMessage("");
    spinSound.current?.play();

    const interval = setInterval(() => {
      const newSlots = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
      setSlots(newSlots);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalSlots = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
      setSlots(finalSlots);
      setSpinning(false);

      if (finalSlots.every((val) => val === finalSlots[0])) {
        setMessage("Kamu Menang!");
        winSound.current?.play();
        setScore((prev) => prev + 100);
      } else {
        setMessage("Coba Lagi!");
      }
    }, 2000);
  };

  const handleLogin = () => {
    if (username.trim()) {
      setLoggedIn(true);
      setScore(0);
      localStorage.setItem("carbot86_username", username);
      localStorage.setItem("carbot86_score", "0");
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Carbot86 Slot Game</h1>
        <input
          type="text"
          placeholder="Masukkan nama kamu"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "0.25rem", marginBottom: "1rem", color: "black" }}
        />
        <Button onClick={handleLogin}>Masuk</Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f172a, #334155)", color: "white", textAlign: "center", padding: "2rem" }}>
      <audio ref={spinSound} src="/sounds/spin.mp3" preload="auto" />
      <audio ref={winSound} src="/sounds/win.mp3" preload="auto" />

      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Carbot86 Slot Game</h1>
      <p>Selamat datang, <strong>{username}</strong></p>
      <div style={{ fontSize: "3rem", margin: "1rem 0" }}>{slots.join(" ")}</div>
      <p>Skor: {score}</p>
      <Button onClick={spin} disabled={spinning}>{spinning ? "Memutar..." : "Putar!"}</Button>
      {message && <p style={{ marginTop: "1rem", fontSize: "1.25rem" }}>{message}</p>}

      <div style={{ marginTop: "2rem", maxWidth: "400px", margin: "auto", background: "white", color: "black", borderRadius: "0.5rem", padding: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Leaderboard</h2>
        <ul style={{ textAlign: "left" }}>
          {leaderboard.map((entry, index) => (
            <li key={entry.username} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ccc", padding: "0.25rem 0" }}>
              <span>{index + 1}. {entry.username}</span>

              <span>{entry.score}</span>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;