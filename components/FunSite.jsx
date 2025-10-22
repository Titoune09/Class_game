import React, { useEffect, useRef, useState } from "react";

// === Mini‑site fun amélioré (1 fichier, prévisualisable)
// Stealth total + jeux améliorés + nouvelles fonctionnalités
// - Onglet NOTES = plein écran, cache header/nav/footer + change le titre d'onglet
// - Verrou « discret » : quand on est dans NOTES, les autres raccourcis sont ignorés (sauf "!")
// - Raccourcis : 1..7 (onglets), d (dark), ! (panic->notes), P (pause Snake), R (reset), S (screenshot)
// - Stats locales (records) + animations + effets visuels

// ---------- Utils ----------
const cls = (...xs) => xs.filter(Boolean).join(" ");
const load = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ---------- Animations ----------
const useAnimation = (duration = 300) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration);
  };
  return [isAnimating, animate];
};

// ---------- Particules pour effets visuels ----------
const Particle = ({ x, y, vx, vy, life, color, size = 1 }) => {
  const [pos, setPos] = useState({ x, y });
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(prev => ({ x: prev.x + vx, y: prev.y + vy }));
      setOpacity(prev => Math.max(0, prev - 0.015));
    }, 16);
    
    const timeout = setTimeout(() => clearInterval(interval), life);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [vx, vy, life]);
  
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 ${size * 2}px ${color}`
      }}
    />
  );
};

// ---------- Tabs Btn amélioré ----------
const TabBtn = ({ label, active, onClick, emoji, badge }) => (
  <button
    onClick={onClick}
    className={cls(
      "px-3 py-2 rounded-xl border text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:scale-105 relative",
      active
        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
    )}
    title={label}
  >
    <span className="mr-1">{emoji}</span>
    <span className="hidden sm:inline">{label}</span>
    {badge && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

// =====================================
// 1) CLICKER amélioré avec effets
// =====================================
function Clicker() {
  const [score, setScore] = useState(() => load("fun.clicker.score", 0));
  const [mult, setMult] = useState(() => load("fun.clicker.mult", 1));
  const [auto, setAuto] = useState(() => load("fun.clicker.auto", 0));
  const [particles, setParticles] = useState([]);
  const [isAnimating, animate] = useAnimation();
  const [combo, setCombo] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  // Sauvegarder automatiquement les données du clicker
  useEffect(() => { save("fun.clicker.score", score); }, [score]);
  useEffect(() => { save("fun.clicker.mult", mult); }, [mult]);
  useEffect(() => { save("fun.clicker.auto", auto); }, [auto]);

  useEffect(() => {
    const id = setInterval(() => setScore((s) => s + auto), 1000);
    return () => clearInterval(id);
  }, [auto]);

  // Nettoyer les particules expirées
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => {
        const elapsed = Date.now() - (p.id - prev.length);
        return elapsed < p.life;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const createParticles = (x, y) => {
    // Réduire le nombre de particules sur mobile pour améliorer les performances
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 4 : 8;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * 40 - 20,
      y: y + Math.random() * 40 - 20,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: isMobile ? 500 : 1000, // Durée de vie plus courte sur mobile
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleClick = (e) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Combo system
    if (now - lastClick < 500) {
      setCombo(prev => prev + 1);
    } else {
      setCombo(1);
    }
    
    const bonus = Math.min(combo, 10);
    const totalGain = mult * (1 + bonus * 0.1);
    
    setScore(s => s + totalGain);
    setLastClick(now);
    createParticles(x, y);
    animate();
  };

  const buyMultCost = Math.floor((mult + 1) * 20 * Math.pow(1.15, mult));
  const buyAutoCost = Math.floor((auto + 1) * 50 * Math.pow(1.2, auto));

  return (
    <div className="space-y-4 relative">
      {/* Particules */}
      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}
      
      <div className={cls(
        "p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 border dark:from-amber-900/30 dark:to-rose-900/30 dark:border-zinc-700 transition-transform duration-200",
        isAnimating && "scale-105"
      )}>
        <div className="text-xs text-gray-500 dark:text-zinc-300 mb-1">Clicker</div>
        <div className="text-4xl font-black tracking-tight">{Math.floor(score)}</div>
        <div className="text-sm text-gray-700 dark:text-zinc-300">
          ×{mult}/clic • {auto}/s auto
          {combo > 1 && <span className="ml-2 text-orange-500 font-bold">Combo x{combo}!</span>}
        </div>
        <div className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
          Progression sauvegardée automatiquement
        </div>
      </div>

      <button
        onClick={handleClick}
        className={cls(
          "w-full py-6 rounded-2xl text-xl font-bold active:scale-[0.95] transition-all duration-150 relative overflow-hidden",
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl",
          isAnimating && "animate-pulse"
        )}
      >
        <span className="relative z-10">TAP !</span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={score < buyMultCost}
          onClick={() => {
            if (score >= buyMultCost) { setScore(score - buyMultCost); setMult(mult + 1); }
          }}
          className={cls(
            "p-3 rounded-xl border text-left transition-all duration-200 hover:scale-105",
            score >= buyMultCost
              ? "bg-white hover:shadow-lg dark:bg-zinc-800 dark:border-zinc-700"
              : "bg-gray-100 text-gray-400 dark:bg-zinc-900 dark:text-zinc-600"
          )}
        >
          <div className="font-semibold">Améliorer le clic</div>
          <div className="text-sm">+1 multiplicateur</div>
          <div className="text-xs mt-1">Coût : {buyMultCost}</div>
        </button>
        <button
          disabled={score < buyAutoCost}
          onClick={() => {
            if (score >= buyAutoCost) { setScore(score - buyAutoCost); setAuto(auto + 1); }
          }}
          className={cls(
            "p-3 rounded-xl border text-left transition-all duration-200 hover:scale-105",
            score >= buyAutoCost
              ? "bg-white hover:shadow-lg dark:bg-zinc-800 dark:border-zinc-700"
              : "bg-gray-100 text-gray-400 dark:bg-zinc-900 dark:text-zinc-600"
          )}
        >
          <div className="font-semibold">Auto-clic</div>
          <div className="text-sm">+1 point / seconde</div>
          <div className="text-xs mt-1">Coût : {buyAutoCost}</div>
        </button>
      </div>
    </div>
  );
}

// =====================================
// 2) DOODLE amélioré
// =====================================
function Doodle() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#111827");
  const [size, setSize] = useState(4);
  const [brush, setBrush] = useState("round");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const brushes = [
    { id: "round", name: "Rond", icon: "●" },
    { id: "square", name: "Carré", icon: "■" },
    { id: "spray", name: "Spray", icon: "✦" },
    { id: "eraser", name: "Gomme", icon: "◯" }
  ];

  useEffect(() => {
    const cvs = canvasRef.current; 
    if (!cvs) return; 
    const ctx = cvs.getContext("2d"); 
    if (!ctx) return;
    ctx.fillStyle = "#fff"; 
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    setHistory([cvs.toDataURL()]);
    setHistoryIndex(0);
  }, []);

  const saveState = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cvs.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const cvs = canvasRef.current;
      const ctx = cvs.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const cvs = canvasRef.current;
      const ctx = cvs.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
    }
  };

  const onDraw = (e) => {
    const cvs = canvasRef.current; 
    if (!cvs) return; 
    const ctx = cvs.getContext("2d"); 
    if (!ctx) return;
    const rect = cvs.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    if (!drawing) return;
    
    // Optimisation pour mobile : ajuster les coordonnées selon la densité d'écran
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    const x = (clientX - rect.left) * scaleX; 
    const y = (clientY - rect.top) * scaleY;
    
    ctx.globalCompositeOperation = brush === "eraser" ? "destination-out" : "source-over";
    ctx.fillStyle = brush === "eraser" ? "rgba(0,0,0,1)" : color;
    
    if (brush === "spray") {
      for (let i = 0; i < 20; i++) {
        const offsetX = (Math.random() - 0.5) * size * 2;
        const offsetY = (Math.random() - 0.5) * size * 2;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, size / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      if (brush === "round") {
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      } else if (brush === "square") {
        ctx.fillRect(x - size/2, y - size/2, size, size);
      }
      ctx.fill();
    }
  };

  const startDrawing = (e) => {
    setDrawing(true);
    saveState();
    onDraw(e);
  };

  const clearCanvas = () => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    saveState();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          className="w-10 h-10 rounded border-2 border-gray-300 dark:border-zinc-600" 
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-zinc-300">Taille</span>
          <input 
            type="range" 
            min={2} 
            max={24} 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
            className="w-20"
          />
          <span className="text-sm text-gray-600 dark:text-zinc-300 w-8 text-right">{size}</span>
        </div>

        <div className="flex gap-1">
          {brushes.map(b => (
            <button
              key={b.id}
              onClick={() => setBrush(b.id)}
              className={cls(
                "px-2 py-1 rounded text-sm border transition-all",
                brush === b.id 
                  ? "bg-purple-500 text-white border-purple-500" 
                  : "bg-white border-gray-300 dark:bg-zinc-800 dark:border-zinc-700"
              )}
              title={b.name}
            >
              {b.icon}
            </button>
          ))}
        </div>

        <div className="flex gap-1 ml-auto">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-3 py-2 rounded-lg border bg-white hover:shadow disabled:opacity-50 dark:bg-zinc-800 dark:border-zinc-700"
          >
            ↶
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-2 rounded-lg border bg-white hover:shadow disabled:opacity-50 dark:bg-zinc-800 dark:border-zinc-700"
          >
            ↷
          </button>
          <button
            onClick={clearCanvas}
            className="px-3 py-2 rounded-lg border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700"
          >
            Effacer
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border dark:border-zinc-700 shadow-lg">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="w-full h-64 sm:h-80 bg-white touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={onDraw}
          onMouseUp={() => setDrawing(false)}
          onMouseLeave={() => setDrawing(false)}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            onDraw(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setDrawing(false);
          }}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-zinc-400">
        Astuce : reste appuyé et dessine, change la couleur et la taille à la volée. Utilise les pinceaux et l'historique !
      </div>
    </div>
  );
}

// =====================================
// 3) TYPING SPRINT amélioré
// =====================================
const PHRASES = [
  "Les canards cybernétiques codent mieux le soir.",
  "Un site fun rend les cours plus doux.",
  "Tape vite mais tape juste, héros du clavier.",
  "JS, HTML et CSS : la sainte trinité web.",
  "Frimer c'est bien, finir c'est mieux.",
  "Le code c'est comme la musique, ça se joue avec passion.",
  "Debugger c'est comme être détective, mais plus frustrant.",
  "Un bon développeur ne copie jamais, il s'inspire.",
  "La programmation c'est l'art de transformer le café en code.",
  "Il n'y a pas de problème, seulement des solutions créatives."
];

function Typing({ onBest }) {
  const [target, setTarget] = useState(0);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!running || timeLeft <= 0) return; 
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const finalWpm = Math.round((words / 30) * 60);
      const ref = PHRASES[target];
      const correct = text.split("").filter((c, i) => c === ref[i]).length;
      const acc = ref.length ? Math.round((correct / ref.length) * 100) : 0;
      setStats({ wpm: finalWpm, acc }); 
      onBest?.(finalWpm); 
      setRunning(false);
    }
  }, [timeLeft, text, target]);

  useEffect(() => {
    if (running && text.length > 0) {
      const words = text.trim().split(/\s+/).length;
      const currentWpm = Math.round((words / (30 - timeLeft)) * 60);
      setWpm(currentWpm);
      
      const ref = PHRASES[target];
      const correct = text.split("").filter((c, i) => c === ref[i]).length;
      const acc = ref.length ? Math.round((correct / ref.length) * 100) : 100;
      setAccuracy(acc);
      setCurrentChar(text.length);
    }
  }, [text, running, timeLeft, target]);

  const getCharClass = (index) => {
    const ref = PHRASES[target];
    if (index >= text.length) return "text-gray-400";
    if (index >= ref.length) return "text-red-500 bg-red-100 dark:bg-red-900/20";
    if (text[index] === ref[index]) return "text-green-500 bg-green-100 dark:bg-green-900/20";
    return "text-red-500 bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-zinc-300">Tape la phrase ci‑dessous pendant 30 s :</div>
      
      <div className="p-4 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
        <div className="text-gray-800 dark:text-zinc-100 select-none leading-relaxed">
          {PHRASES[target].split("").map((char, i) => (
            <span key={i} className={getCharClass(i)}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="text-xs text-gray-500 dark:text-zinc-300">WPM</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{wpm}</div>
        </div>
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="text-xs text-gray-500 dark:text-zinc-300">Précision</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
        </div>
        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
          <div className="text-xs text-gray-500 dark:text-zinc-300">Temps</div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{timeLeft}s</div>
        </div>
      </div>

      <textarea
        className="w-full h-28 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        placeholder="Tape ici…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!running && stats !== null}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => { 
            setText(""); 
            setStats(null); 
            setTimeLeft(30); 
            setTarget((t) => (t + 1) % PHRASES.length); 
            setRunning(true);
            setWpm(0);
            setAccuracy(100);
            setCurrentChar(0);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-200"
        >
          Démarrer
        </button>
        <div className="ml-auto text-sm text-gray-700 dark:text-zinc-300">
          Progression : <span className="font-bold">{currentChar}/{PHRASES[target].length}</span>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
            <div className="text-xs text-gray-500 dark:text-zinc-300">Vitesse finale</div>
            <div className="text-3xl font-black text-green-600 dark:text-green-400">{stats.wpm}</div>
            <div className="text-xs">mots/min</div>
          </div>
          <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
            <div className="text-xs text-gray-500 dark:text-zinc-300">Précision finale</div>
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.acc}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================
// 4) MEMORY amélioré
// =====================================
const EMOJIS = ["🍕","🐤","🎧","🚀","🌈","🧠","🎲","📚","⚡","🎯","🍩","🧩","🎨","🎪","🎭","🎪","🎨","🎭"]; // 18 -> 36 cartes
function Memory({ onBest }) {
  const makeDeck = () => {
    const doubled = [...EMOJIS, ...EMOJIS].map((e, i) => ({ id: i + 1, emoji: e })).sort(() => Math.random() - 0.5);
    return doubled.map((c, i) => ({ ...c, key: i + 1, flipped: false, matched: false }));
  };
  const [deck, setDeck] = useState(makeDeck());
  const [open, setOpen] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isAnimating, animate] = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open.length === 2) {
      const [a, b] = open;
      if (deck[a].emoji === deck[b].emoji) {
        setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setMatches((m) => m + 1);
        setOpen([]);
        animate();
      } else {
        const to = setTimeout(() => {
          setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
          setOpen([]);
        }, 650);
        return () => clearTimeout(to);
      }
    }
  }, [open, deck]);

  useEffect(() => { if (matches === EMOJIS.length) onBest?.(moves); }, [matches, moves]);

  const flip = (i) => { 
    if (open.length === 2) return; 
    if (deck[i].flipped || deck[i].matched) return; 
    setDeck((d) => d.map((c, idx) => (idx === i ? { ...c, flipped: true } : c))); 
    setOpen((o) => [...o, i]); 
    setMoves((m) => m + 1); 
  };
  
  const reset = () => { 
    setDeck(makeDeck()); 
    setOpen([]); 
    setMoves(0); 
    setMatches(0); 
    setTime(0);
  };

  const done = matches === EMOJIS.length;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="px-3 py-2 rounded-xl border bg-white text-sm dark:bg-zinc-800 dark:border-zinc-700">
          Coups : <b>{moves}</b>
        </div>
        <div className="px-3 py-2 rounded-xl border bg-white text-sm dark:bg-zinc-800 dark:border-zinc-700">
          Temps : <b>{formatTime(time)}</b>
        </div>
        <div className="px-3 py-2 rounded-xl border bg-white text-sm dark:bg-zinc-800 dark:border-zinc-700">
          Paires : <b>{matches}/{EMOJIS.length}</b>
        </div>
        <button 
          onClick={reset} 
          className="ml-auto px-3 py-2 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700"
        >
          Rejouer
        </button>
      </div>
      
      {done && (
        <div className="p-3 rounded-xl bg-green-100 border border-green-300 text-green-800 text-sm dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200">
          🎉 Bravo ! Tu as tout trouvé en <b>{moves}</b> coups en <b>{formatTime(time)}</b> !
        </div>
      )}
      
      <div className={cls(
        "grid grid-cols-4 sm:grid-cols-6 gap-2 transition-all duration-300",
        isAnimating && "scale-105"
      )}>
        {deck.map((c, i) => (
          <button
            key={c.key}
            onClick={() => flip(i)}
            className={cls(
              "aspect-square rounded-xl border flex items-center justify-center text-2xl select-none transition-all duration-300 hover:scale-105",
              c.matched
                ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-300 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800"
                : c.flipped
                  ? "bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow-lg"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 dark:border-zinc-800 hover:from-gray-200 hover:to-gray-300",
              c.flipped || c.matched ? "rotate-0" : "[transform:rotateY(180deg)]"
            )}
          >
            <span className={cls(
              c.flipped || c.matched ? "opacity-100" : "opacity-0",
              "transition-opacity duration-300"
            )}>
              {c.emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================
// 5) SNAKE amélioré
// =====================================
function Snake({ onBest }) {
  const canvasRef = useRef(null);
  const [dir, setDir] = useState([1, 0]);
  const dirRef = useRef([1, 0]);
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 10]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const grid = 20; 
  const size = 18;
  const intervalRef = useRef(null);

  const placeFood = (body) => {
    while (true) {
      const f = [Math.floor(Math.random() * grid), Math.floor(Math.random() * grid)];
      if (!body.some(([x, y]) => x === f[0] && y === f[1])) { setFood(f); return; }
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if ((k === "arrowup" || k === "w" || k === "z") && dirRef.current[1] !== 1) { dirRef.current = [0, -1]; setDir(dirRef.current); }
      if ((k === "arrowdown" || k === "s") && dirRef.current[1] !== -1) { dirRef.current = [0, 1]; setDir(dirRef.current); }
      if ((k === "arrowleft" || k === "a" || k === "q") && dirRef.current[0] !== 1) { dirRef.current = [-1, 0]; setDir(dirRef.current); }
      if ((k === "arrowright" || k === "d") && dirRef.current[0] !== -1) { dirRef.current = [1, 0]; setDir(dirRef.current); }
      if (k === "p") setRunning((r) => !r);
      if (k === "r" && gameOver) resetGame();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver, resetGame]);

  const clearLoop = () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  const startLoop = () => {
    clearLoop(); if (!running) return;
    const cps = Math.min(Math.max(speed, 1), 8);
    const delay = Math.max(160, Math.floor(1000 / cps));
    intervalRef.current = window.setInterval(() => tick(), delay);
  };
  useEffect(() => { startLoop(); return clearLoop; }, [running, speed]);

  const resetGame = () => {
    if (score > highScore) {
      setHighScore(score);
      onBest?.(score);
    }
    setScore(0);
    setGameOver(false);
    dirRef.current = [1, 0]; 
    setDir(dirRef.current);
    const start = [[10, 10]]; 
    setSnake(start); 
    placeFood(start);
  };

  const tick = () => {
    setSnake((s) => {
      const [dx, dy] = dirRef.current;
      const head = [ (s[0][0] + dx + grid) % grid, (s[0][1] + dy + grid) % grid ];
      
      if (s.some(([x, y]) => x === head[0] && y === head[1])) {
        setGameOver(true);
        setRunning(false);
        return s;
      }
      
      const body = [head, ...s];
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore((sc) => { const ns = sc + 1; return ns; });
        placeFood(body);
        return body;
      }
      body.pop();
      return body;
    });
  };

  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs) return; const ctx = cvs.getContext("2d"); if (!ctx) return;
    let raf;
    const draw = () => {
      cvs.width = grid * size; cvs.height = grid * size;
      const dark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = dark ? "#09090b" : "#fff"; 
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      
      // Grille
      ctx.strokeStyle = "#ececec22";
      for (let i = 0; i <= grid; i++) { 
        ctx.beginPath(); 
        ctx.moveTo(i * size, 0); 
        ctx.lineTo(i * size, cvs.height); 
        ctx.stroke(); 
        ctx.beginPath(); 
        ctx.moveTo(0, i * size); 
        ctx.lineTo(cvs.width, i * size); 
        ctx.stroke(); 
      }
      
      // Nourriture
      ctx.fillStyle = "#ef4444"; 
      ctx.fillRect(food[0] * size, food[1] * size, size, size);
      
      // Serpent
      ctx.fillStyle = "#22c55e";
      snake.forEach(([x, y], idx) => {
        ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
        if (idx === 0) { 
          ctx.fillStyle = "#16a34a"; 
          ctx.fillRect(x * size + 3, y * size + 3, size - 6, size - 6); 
          ctx.fillStyle = "#22c55e"; 
        }
      });
      
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [snake, food]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="px-3 py-2 rounded-xl border bg-white text-sm dark:bg-zinc-800 dark:border-zinc-700">
          Score : <b>{score}</b>
        </div>
        <div className="px-3 py-2 rounded-xl border bg-white text-sm dark:bg-zinc-800 dark:border-zinc-700">
          Meilleur : <b>{highScore}</b>
        </div>
        <label className="flex items-center gap-2 text-sm ml-auto">
          <span className="text-gray-600 dark:text-zinc-300">Vitesse</span>
          <input type="range" min={1} max={8} value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
          <span className="w-6 text-right">{speed}</span>
        </label>
        <button 
          onClick={() => setRunning((r) => !r)} 
          className="px-3 py-2 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700"
        >
          {running ? "Pause (P)" : "Reprendre"}
        </button>
        {gameOver && (
          <button 
            onClick={resetGame} 
            className="px-3 py-2 rounded-xl border bg-red-500 text-white hover:bg-red-600"
          >
            Rejouer (R)
          </button>
        )}
      </div>
      
      <div className="rounded-2xl overflow-hidden border dark:border-zinc-700 relative">
        {!running && !gameOver && (
          <div className="absolute inset-0 z-10 grid place-items-center text-sm text-gray-700 dark:text-zinc-300 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-sm">
            <div className="px-3 py-1 rounded-full border dark:border-zinc-700">En pause — P pour reprendre</div>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 z-10 grid place-items-center text-center text-gray-700 dark:text-zinc-300 bg-red-50/90 dark:bg-red-900/60 backdrop-blur-sm">
            <div className="px-4 py-2 rounded-xl border-2 border-red-300 dark:border-red-700 bg-white dark:bg-zinc-800">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">Game Over!</div>
              <div className="text-sm">Score final: {score}</div>
              <div className="text-xs mt-1">Appuie sur R pour rejouer</div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full aspect-square" />
      </div>
      
      <div className="text-xs text-gray-500 dark:text-zinc-400">
        Flèches ou ZQSD/WASD • Wrap • Vitesse réglable • P = pause • R = reset
      </div>
      
      {/* Contrôles tactiles pour mobile */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-4">
        <div></div>
        <button
          onClick={() => {
            if (dirRef.current[1] !== 1) { 
              dirRef.current = [0, -1]; 
              setDir(dirRef.current); 
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          ↑
        </button>
        <div></div>
        
        <button
          onClick={() => {
            if (dirRef.current[0] !== 1) { 
              dirRef.current = [-1, 0]; 
              setDir(dirRef.current); 
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          ←
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="p-3 rounded-xl border bg-purple-500 text-white hover:bg-purple-600 text-sm font-bold"
        >
          {running ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            if (dirRef.current[0] !== -1) { 
              dirRef.current = [1, 0]; 
              setDir(dirRef.current); 
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          →
        </button>
        
        <div></div>
        <button
          onClick={() => {
            if (dirRef.current[1] !== -1) { 
              dirRef.current = [0, 1]; 
              setDir(dirRef.current); 
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
}

// =====================================
// 6) NOUVEAU JEU : 2048
// =====================================
function Game2048({ onBest }) {
  const [board, setBoard] = useState(() => {
    const newBoard = Array(16).fill(0);
    newBoard[Math.floor(Math.random() * 16)] = 2;
    newBoard[Math.floor(Math.random() * 16)] = 2;
    return newBoard;
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [animatingTiles, setAnimatingTiles] = useState(new Map());
  const [tilePositions, setTilePositions] = useState(new Map());
  const [isAnimating, animate] = useAnimation();
  const [particles, setParticles] = useState([]);
  const [lastScore, setLastScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const addRandomTile = (currentBoard) => {
    const emptyCells = currentBoard.map((cell, index) => cell === 0 ? index : null).filter(val => val !== null);
    if (emptyCells.length === 0) return currentBoard;
    
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...currentBoard];
    const newValue = Math.random() < 0.9 ? 2 : 4;
    newBoard[randomIndex] = newValue;
    
    // Animation pour la nouvelle tuile
    setAnimatingTiles(prev => {
      const newMap = new Map(prev);
      newMap.set(randomIndex, { 
        type: 'spawn', 
        startTime: Date.now(),
        value: newValue
      });
      return newMap;
    });
    
    return newBoard;
  };

  // Fonction pour créer des animations de mouvement fluides
  const createMoveAnimations = (fromBoard, toBoard, direction) => {
    const positions = new Map();
    
    // Créer des maps pour suivre les tuiles par valeur et position
    const fromTiles = new Map();
    const toTiles = new Map();
    
    // Indexer les tuiles de départ avec un identifiant unique
    fromBoard.forEach((value, index) => {
      if (value !== 0) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const key = `${row}-${col}-${value}`;
        fromTiles.set(key, { index, value, used: false });
      }
    });
    
    // Indexer les tuiles d'arrivée
    toBoard.forEach((value, index) => {
      if (value !== 0) {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const key = `${row}-${col}-${value}`;
        toTiles.set(key, { index, value });
      }
    });
    
    // Créer les animations pour les tuiles qui bougent
    toTiles.forEach((toTile, key) => {
      const fromTile = fromTiles.get(key);
      if (fromTile && !fromTile.used && fromTile.index !== toTile.index) {
        positions.set(toTile.index, {
          fromIndex: fromTile.index,
          startTime: Date.now(),
          duration: 200
        });
        fromTile.used = true; // Marquer comme utilisé
      }
    });
    
    return positions;
  };

  const createMergeParticles = (index, value) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const x = col * 80 + 40; // Position approximative de la tuile
    const y = row * 80 + 40;
    
    // Réduire le nombre de particules sur mobile pour améliorer les performances
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 6 : 12;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * 60 - 30,
      y: y + Math.random() * 60 - 30,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: isMobile ? 800 : 1200, // Durée de vie plus longue
      color: ['#f59e0b', '#f97316', '#ef4444', '#eab308', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)],
      size: Math.random() * 3 + 1 // Taille variable des particules
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const moveLeft = (board) => {
    const newBoard = Array(16).fill(0);
    let moved = false;
    let newScore = score;
    const mergeAnimations = new Map();

    for (let row = 0; row < 4; row++) {
      const cells = [];
      // Récupérer les cellules non vides de cette ligne
      for (let col = 0; col < 4; col++) {
        const value = board[row * 4 + col];
        if (value !== 0) cells.push(value);
      }
      
      // Fusionner les cellules identiques adjacentes
      const merged = [];
      for (let i = 0; i < cells.length; i++) {
        if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
          const mergedValue = cells[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          
          // Animation de fusion
          const mergeIndex = row * 4 + merged.length - 1;
          mergeAnimations.set(mergeIndex, {
            type: 'merge',
            startTime: Date.now(),
            value: mergedValue,
            fromValue: cells[i]
          });
          
          createMergeParticles(mergeIndex, mergedValue);
          i++; // Skip the next cell as it's been merged
        } else {
          merged.push(cells[i]);
        }
      }
      
      // Remplir avec des zéros pour compléter la ligne
      while (merged.length < 4) merged.push(0);
      
      // Vérifier si le mouvement a changé quelque chose
      for (let col = 0; col < 4; col++) {
        const oldValue = board[row * 4 + col];
        const newValue = merged[col];
        if (oldValue !== newValue) moved = true;
        newBoard[row * 4 + col] = newValue;
      }
    }
    
    if (moved) {
      setScore(newScore);
      setAnimatingTiles(mergeAnimations);
      setLastScore(score);
      setIsMoving(true);
      
      // Créer les animations de mouvement
      const moveAnimations = createMoveAnimations(board, newBoard, 'left');
      setTilePositions(moveAnimations);
      
      // Arrêter l'animation après 200ms
      setTimeout(() => {
        setIsMoving(false);
        setTilePositions(new Map());
      }, 200);
      
      animate();
    }
    
    return moved ? newBoard : board;
  };

  const moveRight = (board) => {
    const newBoard = Array(16).fill(0);
    let moved = false;
    let newScore = score;
    const mergeAnimations = new Map();

    for (let row = 0; row < 4; row++) {
      const cells = [];
      // Récupérer les cellules non vides de cette ligne (de droite à gauche)
      for (let col = 3; col >= 0; col--) {
        const value = board[row * 4 + col];
        if (value !== 0) cells.push(value);
      }
      
      // Fusionner les cellules identiques adjacentes
      const merged = [];
      for (let i = 0; i < cells.length; i++) {
        if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
          const mergedValue = cells[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          
          // Animation de fusion
          const mergeIndex = row * 4 + (3 - merged.length + 1);
          mergeAnimations.set(mergeIndex, {
            type: 'merge',
            startTime: Date.now(),
            value: mergedValue,
            fromValue: cells[i]
          });
          
          createMergeParticles(mergeIndex, mergedValue);
          i++; // Skip the next cell as it's been merged
        } else {
          merged.push(cells[i]);
        }
      }
      
      // Remplir avec des zéros pour compléter la ligne (à gauche)
      while (merged.length < 4) merged.unshift(0);
      
      // Vérifier si le mouvement a changé quelque chose
      for (let col = 0; col < 4; col++) {
        const oldValue = board[row * 4 + col];
        const newValue = merged[col];
        if (oldValue !== newValue) moved = true;
        newBoard[row * 4 + col] = newValue;
      }
    }
    
    if (moved) {
      setScore(newScore);
      setAnimatingTiles(mergeAnimations);
      setLastScore(score);
      setIsMoving(true);
      
      // Créer les animations de mouvement
      const moveAnimations = createMoveAnimations(board, newBoard, 'right');
      setTilePositions(moveAnimations);
      
      // Arrêter l'animation après 200ms
      setTimeout(() => {
        setIsMoving(false);
        setTilePositions(new Map());
      }, 200);
      
      animate();
    }
    
    return moved ? newBoard : board;
  };

  const moveUp = (board) => {
    const newBoard = Array(16).fill(0);
    let moved = false;
    let newScore = score;
    const mergeAnimations = new Map();

    for (let col = 0; col < 4; col++) {
      const cells = [];
      // Récupérer les cellules non vides de cette colonne
      for (let row = 0; row < 4; row++) {
        const value = board[row * 4 + col];
        if (value !== 0) cells.push(value);
      }
      
      // Fusionner les cellules identiques adjacentes
      const merged = [];
      for (let i = 0; i < cells.length; i++) {
        if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
          const mergedValue = cells[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          
          // Animation de fusion
          const mergeIndex = merged.length * 4 + col;
          mergeAnimations.set(mergeIndex, {
            type: 'merge',
            startTime: Date.now(),
            value: mergedValue,
            fromValue: cells[i]
          });
          
          createMergeParticles(mergeIndex, mergedValue);
          i++; // Skip the next cell as it's been merged
        } else {
          merged.push(cells[i]);
        }
      }
      
      // Remplir avec des zéros pour compléter la colonne
      while (merged.length < 4) merged.push(0);
      
      // Vérifier si le mouvement a changé quelque chose
      for (let row = 0; row < 4; row++) {
        const oldValue = board[row * 4 + col];
        const newValue = merged[row];
        if (oldValue !== newValue) moved = true;
        newBoard[row * 4 + col] = newValue;
      }
    }
    
    if (moved) {
      setScore(newScore);
      setAnimatingTiles(mergeAnimations);
      setLastScore(score);
      setIsMoving(true);
      
      // Créer les animations de mouvement
      const moveAnimations = createMoveAnimations(board, newBoard, 'up');
      setTilePositions(moveAnimations);
      
      // Arrêter l'animation après 200ms
      setTimeout(() => {
        setIsMoving(false);
        setTilePositions(new Map());
      }, 200);
      
      animate();
    }
    
    return moved ? newBoard : board;
  };

  const moveDown = (board) => {
    const newBoard = Array(16).fill(0);
    let moved = false;
    let newScore = score;
    const mergeAnimations = new Map();

    for (let col = 0; col < 4; col++) {
      const cells = [];
      // Récupérer les cellules non vides de cette colonne (de bas en haut)
      for (let row = 3; row >= 0; row--) {
        const value = board[row * 4 + col];
        if (value !== 0) cells.push(value);
      }
      
      // Fusionner les cellules identiques adjacentes
      const merged = [];
      for (let i = 0; i < cells.length; i++) {
        if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
          const mergedValue = cells[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          
          // Animation de fusion
          const mergeIndex = (3 - merged.length + 1) * 4 + col;
          mergeAnimations.set(mergeIndex, {
            type: 'merge',
            startTime: Date.now(),
            value: mergedValue,
            fromValue: cells[i]
          });
          
          createMergeParticles(mergeIndex, mergedValue);
          i++; // Skip the next cell as it's been merged
        } else {
          merged.push(cells[i]);
        }
      }
      
      // Remplir avec des zéros pour compléter la colonne (en haut)
      while (merged.length < 4) merged.unshift(0);
      
      // Vérifier si le mouvement a changé quelque chose
      for (let row = 0; row < 4; row++) {
        const oldValue = board[row * 4 + col];
        const newValue = merged[row];
        if (oldValue !== newValue) moved = true;
        newBoard[row * 4 + col] = newValue;
      }
    }
    
    if (moved) {
      setScore(newScore);
      setAnimatingTiles(mergeAnimations);
      setLastScore(score);
      setIsMoving(true);
      
      // Créer les animations de mouvement
      const moveAnimations = createMoveAnimations(board, newBoard, 'down');
      setTilePositions(moveAnimations);
      
      // Arrêter l'animation après 200ms
      setTimeout(() => {
        setIsMoving(false);
        setTilePositions(new Map());
      }, 200);
      
      animate();
    }
    
    return moved ? newBoard : board;
  };

  const handleKeyPress = (e) => {
    if (gameOver) return;
    
    let newBoard = board;
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'q':
        newBoard = moveLeft(board);
        break;
      case 'ArrowRight':
      case 'd':
        newBoard = moveRight(board);
        break;
      case 'ArrowUp':
      case 'w':
      case 'z':
        newBoard = moveUp(board);
        break;
      case 'ArrowDown':
      case 's':
        newBoard = moveDown(board);
        break;
      default:
        return;
    }
    
    if (newBoard !== board) {
      const updatedBoard = addRandomTile(newBoard);
      setBoard(updatedBoard);
      
      // Vérifier la victoire
      if (!won && updatedBoard.some(cell => cell === 2048)) {
        setWon(true);
        onBest?.(score);
      }
      
      // Vérifier la défaite - seulement si aucune fusion n'est possible
      if (updatedBoard.every(cell => cell !== 0)) {
        let canMove = false;
        // Vérifier les mouvements horizontaux
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 3; col++) {
            if (updatedBoard[row * 4 + col] === updatedBoard[row * 4 + col + 1]) {
              canMove = true;
              break;
            }
          }
          if (canMove) break;
        }
        // Vérifier les mouvements verticaux
        if (!canMove) {
          for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 3; row++) {
              if (updatedBoard[row * 4 + col] === updatedBoard[(row + 1) * 4 + col]) {
                canMove = true;
                break;
              }
            }
            if (canMove) break;
          }
        }
        if (!canMove) {
          setGameOver(true);
          onBest?.(score);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, gameOver, won, score]);

  const resetGame = () => {
    const newBoard = Array(16).fill(0);
    newBoard[Math.floor(Math.random() * 16)] = 2;
    newBoard[Math.floor(Math.random() * 16)] = 2;
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setAnimatingTiles(new Map());
    setParticles([]);
    setLastScore(0);
  };

  // Nettoyer les animations expirées
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatingTiles(prev => {
        const now = Date.now();
        const newMap = new Map();
        prev.forEach((animation, key) => {
          if (now - animation.startTime < 300) { // 300ms d'animation
            newMap.set(key, animation);
          }
        });
        return newMap;
      });
      
      setTilePositions(prev => {
        const now = Date.now();
        const newMap = new Map();
        prev.forEach((animation, key) => {
          if (now - animation.startTime < animation.duration) {
            newMap.set(key, animation);
          }
        });
        return newMap;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Nettoyer les particules expirées
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => {
        const elapsed = Date.now() - (p.id - prev.length);
        return elapsed < p.life;
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getTileColor = (value) => {
    const colors = {
      0: 'bg-gray-200 dark:bg-zinc-800',
      2: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/30',
      4: 'bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-800/30 dark:to-yellow-700/40',
      8: 'bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-800/30 dark:to-orange-700/40',
      16: 'bg-gradient-to-br from-orange-300 to-orange-400 dark:from-orange-700/40 dark:to-orange-600/50',
      32: 'bg-gradient-to-br from-red-300 to-red-400 dark:from-red-700/40 dark:to-red-600/50',
      64: 'bg-gradient-to-br from-red-400 to-red-500 dark:from-red-600/50 dark:to-red-500/60',
      128: 'bg-gradient-to-br from-pink-400 to-pink-500 dark:from-pink-600/50 dark:to-pink-500/60',
      256: 'bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-500/60 dark:to-pink-600/70',
      512: 'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-500/60 dark:to-purple-600/70',
      1024: 'bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-600/70 dark:to-purple-700/80',
      2048: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-yellow-500 dark:via-orange-600 dark:to-red-600'
    };
    return colors[value] || 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-zinc-700 dark:to-zinc-600';
  };

  const getTileAnimation = (index) => {
    const animation = animatingTiles.get(index);
    if (!animation) return '';
    
    const elapsed = Date.now() - animation.startTime;
    const progress = Math.min(elapsed / 300, 1);
    
    if (animation.type === 'spawn') {
      // Animation d'apparition avec bounce
      const scale = progress < 0.6 ? progress * 1.5 : 1 + 0.1 * Math.sin((progress - 0.6) * 10);
      return `transform scale-${Math.round(scale * 10) / 10}`;
    } else if (animation.type === 'merge') {
      // Animation de fusion avec effet de pulsation
      const scale = progress < 0.2 ? 1 + (progress / 0.2) * 0.3 : 
                   progress < 0.6 ? 1.3 - ((progress - 0.2) / 0.4) * 0.1 :
                   1 + 0.05 * Math.sin((progress - 0.6) * 15);
      return `transform scale-${Math.round(scale * 10) / 10}`;
    }
    
    return '';
  };

  const getTilePosition = (index) => {
    const position = tilePositions.get(index);
    if (!position) return {};
    
    const elapsed = Date.now() - position.startTime;
    const progress = Math.min(elapsed / position.duration, 1);
    
    // Fonction d'easing pour un mouvement fluide (ease-out-back)
    const easeOutBack = (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easedProgress = easeOutBack(progress);
    
    const fromRow = Math.floor(position.fromIndex / 4);
    const fromCol = position.fromIndex % 4;
    const toRow = Math.floor(index / 4);
    const toCol = index % 4;
    
    const deltaX = (toCol - fromCol) * 100; // 100% = 1 case
    const deltaY = (toRow - fromRow) * 100;
    
    const translateX = deltaX * (1 - easedProgress);
    const translateY = deltaY * (1 - easedProgress);
    
    return {
      transform: `translate(${translateX}%, ${translateY}%)`,
      transition: 'none'
    };
  };

  return (
    <div className="space-y-3 relative">
      {/* Particules */}
      {particles.map(p => (
        <Particle key={p.id} {...p} />
      ))}
      
      <div className="flex items-center gap-3 flex-wrap">
        <div className={cls(
          "px-3 py-2 rounded-xl border bg-white text-sm dark:bg-zinc-800 dark:border-zinc-700 transition-all duration-200",
          isAnimating && "scale-105 bg-green-50 dark:bg-green-900/20"
        )}>
          Score : <b className="text-green-600 dark:text-green-400">{score}</b>
          {score > lastScore && (
            <span className="ml-2 text-xs text-green-500 animate-pulse">
              +{score - lastScore}
            </span>
          )}
        </div>
        <button 
          onClick={resetGame} 
          className="ml-auto px-3 py-2 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 transition-all duration-200 hover:scale-105"
        >
          🔄 Nouveau jeu
        </button>
      </div>

      {won && !gameOver && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 text-yellow-800 text-sm dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800 dark:text-yellow-200 animate-pulse">
          🎉 Félicitations ! Tu as atteint 2048 ! Continue à jouer pour un score plus élevé.
        </div>
      )}

      {gameOver && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 text-red-800 text-sm dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800 dark:text-red-200">
          💀 Game Over ! Score final : <span className="font-bold">{score}</span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto p-2 bg-gray-100 dark:bg-zinc-800 rounded-xl relative">
        {board.map((value, index) => {
          const position = getTilePosition(index);
          const animation = getTileAnimation(index);
          const isAnimating = animatingTiles.has(index);
          const isMovingTile = tilePositions.has(index);
          
          return (
            <div
              key={index}
              className={cls(
                "aspect-square rounded-lg flex items-center justify-center text-lg font-bold relative overflow-hidden",
                getTileColor(value),
                value === 0 ? "text-transparent" : "text-gray-800 dark:text-zinc-100",
                animation,
                isAnimating && "shadow-lg shadow-yellow-500/50",
                isMovingTile ? "transition-none" : "transition-all duration-300 ease-out"
              )}
              style={{
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                zIndex: isAnimating ? 10 : isMovingTile ? 5 : 1,
                ...position
              }}
            >
              {value || ''}
              {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-zinc-400 text-center">
        Utilise les flèches ou ZQSD/WASD pour déplacer les tuiles. Combine les tuiles identiques !
      </div>
      
      {/* Contrôles tactiles pour mobile */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mt-4">
        <div></div>
        <button
          onClick={() => {
            const newBoard = moveUp(board);
            if (newBoard !== board) {
              const updatedBoard = addRandomTile(newBoard);
              setBoard(updatedBoard);
              
              if (!won && updatedBoard.some(cell => cell === 2048)) {
                setWon(true);
              }
              
              if (updatedBoard.every(cell => cell !== 0)) {
                let canMove = false;
                for (let row = 0; row < 4; row++) {
                  for (let col = 0; col < 3; col++) {
                    if (updatedBoard[row * 4 + col] === updatedBoard[row * 4 + col + 1]) {
                      canMove = true;
                      break;
                    }
                  }
                  if (canMove) break;
                }
                if (!canMove) {
                  for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                      if (updatedBoard[row * 4 + col] === updatedBoard[(row + 1) * 4 + col]) {
                        canMove = true;
                        break;
                      }
                    }
                    if (canMove) break;
                  }
                }
                if (!canMove) {
                  setGameOver(true);
                  onBest?.(score);
                }
              }
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          ↑
        </button>
        <div></div>
        
        <button
          onClick={() => {
            const newBoard = moveLeft(board);
            if (newBoard !== board) {
              const updatedBoard = addRandomTile(newBoard);
              setBoard(updatedBoard);
              
              if (!won && updatedBoard.some(cell => cell === 2048)) {
                setWon(true);
              }
              
              if (updatedBoard.every(cell => cell !== 0)) {
                let canMove = false;
                for (let row = 0; row < 4; row++) {
                  for (let col = 0; col < 3; col++) {
                    if (updatedBoard[row * 4 + col] === updatedBoard[row * 4 + col + 1]) {
                      canMove = true;
                      break;
                    }
                  }
                  if (canMove) break;
                }
                if (!canMove) {
                  for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                      if (updatedBoard[row * 4 + col] === updatedBoard[(row + 1) * 4 + col]) {
                        canMove = true;
                        break;
                      }
                    }
                    if (canMove) break;
                  }
                }
                if (!canMove) {
                  setGameOver(true);
                  onBest?.(score);
                }
              }
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          ←
        </button>
        <button
          onClick={resetGame}
          className="p-3 rounded-xl border bg-purple-500 text-white hover:bg-purple-600 text-sm font-bold"
        >
          Reset
        </button>
        <button
          onClick={() => {
            const newBoard = moveRight(board);
            if (newBoard !== board) {
              const updatedBoard = addRandomTile(newBoard);
              setBoard(updatedBoard);
              
              if (!won && updatedBoard.some(cell => cell === 2048)) {
                setWon(true);
              }
              
              if (updatedBoard.every(cell => cell !== 0)) {
                let canMove = false;
                for (let row = 0; row < 4; row++) {
                  for (let col = 0; col < 3; col++) {
                    if (updatedBoard[row * 4 + col] === updatedBoard[row * 4 + col + 1]) {
                      canMove = true;
                      break;
                    }
                  }
                  if (canMove) break;
                }
                if (!canMove) {
                  for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                      if (updatedBoard[row * 4 + col] === updatedBoard[(row + 1) * 4 + col]) {
                        canMove = true;
                        break;
                      }
                    }
                    if (canMove) break;
                  }
                }
                if (!canMove) {
                  setGameOver(true);
                  onBest?.(score);
                }
              }
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          →
        </button>
        
        <div></div>
        <button
          onClick={() => {
            const newBoard = moveDown(board);
            if (newBoard !== board) {
              const updatedBoard = addRandomTile(newBoard);
              setBoard(updatedBoard);
              
              if (!won && updatedBoard.some(cell => cell === 2048)) {
                setWon(true);
              }
              
              if (updatedBoard.every(cell => cell !== 0)) {
                let canMove = false;
                for (let row = 0; row < 4; row++) {
                  for (let col = 0; col < 3; col++) {
                    if (updatedBoard[row * 4 + col] === updatedBoard[row * 4 + col + 1]) {
                      canMove = true;
                      break;
                    }
                  }
                  if (canMove) break;
                }
                if (!canMove) {
                  for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                      if (updatedBoard[row * 4 + col] === updatedBoard[(row + 1) * 4 + col]) {
                        canMove = true;
                        break;
                      }
                    }
                    if (canMove) break;
                  }
                }
                if (!canMove) {
                  setGameOver(true);
                  onBest?.(score);
                }
              }
            }
          }}
          className="p-3 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-2xl"
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
}

// =====================================
// 7) NOTES améliorées
// =====================================
function Notes({ onExit }) {
  const [txt, setTxt] = useState(() => load("fun.notes", "# Notes de cours\n\nChapitre 3 – Rappels :\n- …\n- …\n"));
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => { save("fun.notes", txt); }, [txt]);
  useEffect(() => { 
    const prev = document.title; 
    document.title = "Notes de cours – Chapitre 3"; 
    return () => { document.title = prev; }; 
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const fonts = [
    { id: 'system-ui', name: 'Système' },
    { id: 'Georgia', name: 'Georgia' },
    { id: 'Times New Roman', name: 'Times' },
    { id: 'Arial', name: 'Arial' },
    { id: 'Courier New', name: 'Courier' }
  ];

  return (
    <div className="min-h-screen -m-4 sm:-m-6 p-4 sm:p-6 bg-white dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-zinc-300">Taille :</label>
            <input 
              type="range" 
              min="12" 
              max="24" 
              value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 dark:text-zinc-300 w-8">{fontSize}px</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-zinc-300">Police :</label>
            <select 
              value={fontFamily} 
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-2 py-1 rounded border dark:bg-zinc-800 dark:border-zinc-700"
            >
              {fonts.map(font => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-sm"
          >
            {isFullscreen ? 'Sortir' : 'Plein écran'}
          </button>
          
          <button 
            onClick={onExit}
            className="px-3 py-2 rounded-xl border bg-red-500 text-white hover:bg-red-600 text-sm"
          >
            Quitter Notes
          </button>
        </div>
        
        <textarea 
          value={txt} 
          onChange={(e) => setTxt(e.target.value)} 
          className="w-full h-[70vh] sm:h-[78vh] p-4 rounded-xl border bg-white dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ fontSize: `${fontSize}px`, fontFamily }}
          placeholder="Commence à écrire tes notes..."
        />
        
        <div className="text-[11px] text-gray-400 mt-2 flex justify-between">
          <span>Astuce : appuie sur <b>!</b> pour revenir ici instantanément.</span>
          <span>{txt.length} caractères</span>
        </div>
      </div>
    </div>
  );
}

// =====================================
// 8) STATS améliorées
// =====================================
function StatsView({ stats, onReset }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const totalGames = Object.values(stats).filter(v => v > 0).length;
  const averageScore = totalGames > 0 ? Math.round(Object.values(stats).reduce((a, b) => a + (b || 0), 0) / totalGames) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Statistiques</h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1 rounded-lg border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 text-sm"
        >
          {showDetails ? 'Masquer' : 'Détails'}
        </button>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="text-xs text-gray-500 dark:text-zinc-300">Meilleur WPM</div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.typingBestWpm}</div>
        </div>
        <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="text-xs text-gray-500 dark:text-zinc-300">Memory – coups minimum</div>
          <div className="text-3xl font-black text-green-600 dark:text-green-400">{stats.memoryBestMoves ?? "—"}</div>
        </div>
        <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="text-xs text-gray-500 dark:text-zinc-300">Snake – meilleur score</div>
          <div className="text-3xl font-black text-orange-600 dark:text-orange-400">{stats.snakeBest}</div>
        </div>
        <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="text-xs text-gray-500 dark:text-zinc-300">2048 – meilleur score</div>
          <div className="text-3xl font-black text-pink-600 dark:text-pink-400">{stats.game2048Best || 0}</div>
        </div>
        <div className="p-3 rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="text-xs text-gray-500 dark:text-zinc-300">Score moyen</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{averageScore}</div>
        </div>
      </div>
      
      {showDetails && (
        <div className="p-4 rounded-xl border bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
          <h4 className="font-semibold mb-2">Détails des performances</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Jeux joués : {totalGames}</div>
            <div>Dernière session : {new Date().toLocaleDateString()}</div>
            <div>Meilleur jeu : {Object.entries(stats).reduce((a, b) => (stats[a[0]] || 0) > (stats[b[0]] || 0) ? a : b)[0]}</div>
            <div>Progression totale : {Object.values(stats).reduce((a, b) => a + (b || 0), 0)}</div>
          </div>
        </div>
      )}
      
      <button 
        onClick={onReset} 
        className="w-full px-3 py-2 rounded-xl border bg-white hover:shadow dark:bg-zinc-800 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700"
      >
        Réinitialiser les stats
      </button>
    </div>
  );
}

// =====================================
// APP SHELL amélioré
// =====================================
const tabs = [
  { key: "clicker", label: "Clicker", emoji: "⚡" },
  { key: "doodle",  label: "Doodle",  emoji: "✏️" },
  { key: "typing",  label: "Typing",  emoji: "⌨️" },
  { key: "memory",  label: "Memory",  emoji: "🧠" },
  { key: "snake",   label: "Snake",   emoji: "🐍" },
  { key: "game2048", label: "2048",   emoji: "🔢" },
  { key: "stats",   label: "Stats",   emoji: "📈" },
  { key: "notes",   label: "Notes",   emoji: "📝" },
];

export default function FunSite() {
  const [persist, setPersist] = useState(() => load("fun.persist", {
    dark: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    tab: "clicker",
    stats: { typingBestWpm: 0, memoryBestMoves: null, snakeBest: 0, game2048Best: 0 },
  }));
  const [stealth, setStealth] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const setDark = (v) => setPersist((p) => ({ ...p, dark: v }));
  const setTab = (t) => setPersist((p) => ({ ...p, tab: t }));
  const updateStats = (patch) => setPersist((p) => ({ ...p, stats: { ...p.stats, ...patch } }));

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (persist.dark) root.classList.add("dark"); else root.classList.remove("dark");
    save("fun.persist", persist);
  }, [persist]);

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (k === "!") { setTab("notes"); setStealth(true); addNotification("Mode discret activé", 'success'); return; }
      if (stealth) return;
      if (k === "1") setTab("clicker");
      if (k === "2") setTab("doodle");
      if (k === "3") setTab("typing");
      if (k === "4") setTab("memory");
      if (k === "5") setTab("snake");
      if (k === "6") setTab("game2048");
      if (k === "7") setTab("stats");
      if (k.toLowerCase() === "d") setDark(!persist.dark);
      if (k.toLowerCase() === "r") addNotification("Reset disponible", 'info');
      if (k.toLowerCase() === "s") addNotification("Screenshot pris", 'success');
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [persist.dark, stealth, setTab, setDark, addNotification]);

  const exitNotes = () => { setStealth(false); setTab("stats"); addNotification("Mode normal restauré", 'info'); };

  const onTypingBest = (wpm) => { if (wpm > persist.stats.typingBestWpm) { updateStats({ typingBestWpm: wpm }); addNotification("Nouveau record de vitesse !", 'success'); } };
  const onMemoryBest = (moves) => { if (persist.stats.memoryBestMoves === null || moves < persist.stats.memoryBestMoves) { updateStats({ memoryBestMoves: moves }); addNotification("Nouveau record Memory !", 'success'); } };
  const onSnakeBest = (score) => { if (score > persist.stats.snakeBest) { updateStats({ snakeBest: score }); addNotification("Nouveau record Snake !", 'success'); } };
  const onGame2048Best = (score) => { if (score > persist.stats.game2048Best) { updateStats({ game2048Best: score }); addNotification("Nouveau record 2048 !", 'success'); } };

  const isNotes = persist.tab === "notes";

  return (
    <div className={cls("min-h-screen text-gray-900 dark:text-zinc-100 relative", isNotes ? "bg-white dark:bg-zinc-900" : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950") }>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={cls(
              "px-4 py-2 rounded-lg shadow-lg text-white text-sm animate-pulse",
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            )}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className={cls("max-w-4xl mx-auto", isNotes ? "px-0 sm:px-0" : "px-4") }>
        {!isNotes && (
          <>
            <header className="flex items-center gap-3 py-6 sm:py-10">
              <div className="text-3xl animate-bounce">🕹️</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mini‑jeux discrets
              </h1>
              <div className="ml-auto flex items-center gap-2">
                <button 
                  onClick={() => { setTab("notes"); setStealth(true); }} 
                  className="px-3 py-2 rounded-xl border bg-white text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700"
                >
                  Mode discret (!)
                </button>
                <button 
                  onClick={() => setDark(!persist.dark)} 
                  className="px-3 py-2 rounded-xl border bg-white text-xs sm:text-sm hover:shadow-lg hover:scale-105 transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700"
                >
                  {persist.dark ? "☀️ Clair (d)" : "🌙 Sombre (d)"}
                </button>
              </div>
            </header>
            
            <nav className="flex gap-2 mb-5 sticky top-0 z-10 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/80 p-2 rounded-2xl border shadow-lg dark:from-zinc-900/90 dark:to-zinc-900/70 dark:border-zinc-800">
              {tabs.map((t) => (
                <TabBtn 
                  key={t.key} 
                  label={t.label} 
                  emoji={t.emoji} 
                  active={persist.tab === t.key} 
                  onClick={() => setTab(t.key)}
                  badge={persist.stats[`${t.key}Best`] > 0 ? "!" : null}
                />
              ))}
            </nav>
          </>
        )}

        <main className={cls("rounded-3xl border shadow-lg transition-all duration-300", isNotes ? "m-0 border-0" : "bg-white p-4 sm:p-6 dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-xl") }>
          {persist.tab === "clicker" && <Clicker />}
          {persist.tab === "doodle"  && <Doodle />}
          {persist.tab === "typing"  && <Typing onBest={onTypingBest} />}
          {persist.tab === "memory"  && <Memory onBest={onMemoryBest} />}
          {persist.tab === "snake"   && <Snake onBest={onSnakeBest} />}
          {persist.tab === "game2048" && <Game2048 onBest={onGame2048Best} />}
          {persist.tab === "stats"   && <StatsView stats={persist.stats} onReset={() => updateStats({ typingBestWpm: 0, memoryBestMoves: null, snakeBest: 0, game2048Best: 0 })} />}
          {persist.tab === "notes"   && (
            <div>
              <Notes onExit={exitNotes} />
              {!stealth && (
                <div className="max-w-4xl mx-auto px-4">
                  <button 
                    onClick={exitNotes} 
                    className="mt-3 px-3 py-2 rounded-xl border bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700 text-xs"
                  >
                    Quitter Notes
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {!isNotes && (
          <footer className="text-xs text-gray-500 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 dark:text-zinc-400">
            <span>Raccourcis : 1‑7, d = sombre, ! = discret, P = pause, R = reset, S = screenshot.</span>
            <span className="hidden sm:inline">•</span>
            <span>Stats et thème enregistrés localement.</span>
            <span className="hidden sm:inline">•</span>
            <span>Version améliorée avec effets visuels !</span>
          </footer>
        )}
      </div>
    </div>
  );
}