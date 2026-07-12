import { useEffect, useMemo, useState } from 'react'
import { questions } from './data/curriculum'

const storageKey = 'developer-academy-progress'
const initial = { completed: 2, streak: 2, scores: [90, 80] }

function getStoredProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}')
    return {
      completed: Number.isFinite(stored.completed) ? stored.completed : initial.completed,
      streak: Number.isFinite(stored.streak) ? stored.streak : initial.streak,
      scores: Array.isArray(stored.scores) ? stored.scores.filter(Number.isFinite) : initial.scores,
    }
  } catch {
    return initial
  }
}

export default function App() {
  const [screen, setScreen] = useState('dashboard')
  const [progress, setProgress] = useState(getStoredProgress)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(progress)), [progress])
  const percentage = Math.round((progress.completed / 60) * 100)
  const mastery = useMemo(() => Math.round(progress.scores.reduce((sum, score) => sum + score, 0) / (progress.scores.length || 1)), [progress])
  const correct = questions.filter((q, i) => answers[i] === q.answer).length
  const startLesson = () => { setScreen('lesson'); setSubmitted(false); setAnswers({}) }
  const submitQuiz = () => { setSubmitted(true); if (correct >= 2 && progress.completed < 3) setProgress(p => ({ ...p, completed: 3, streak: p.streak + 1, scores: [...p.scores, Math.round(correct / 3 * 100)] })) }
  return <main className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => setScreen('dashboard')}><span>DEVELOPER</span> ACADEMY</button><div className="day-pill">DAY {String(progress.completed + 1).padStart(2, '0')} <i /></div><button className="reset" onClick={() => { localStorage.removeItem(storageKey); setProgress(initial); setScreen('dashboard') }}>RESET</button></header>
    {screen === 'dashboard' && <Dashboard progress={progress} percentage={percentage} mastery={mastery} onStart={startLesson} onQuiz={() => setScreen('quiz')} />}
    {screen === 'lesson' && <Lesson onQuiz={() => setScreen('quiz')} onBack={() => setScreen('dashboard')} />}
    {screen === 'quiz' && <Quiz answers={answers} setAnswers={setAnswers} submitted={submitted} correct={correct} onSubmit={submitQuiz} onBack={() => setScreen('dashboard')} />}
  </main>
}

function Dashboard({ progress, percentage, mastery, onStart, onQuiz }) { return <>
  <section className="hero"><div><p className="eyebrow">60-DAY REBUILD</p><h1>BUILD<br />YOUR<br /><em>COMEBACK.</em></h1></div><div className="hero-actions"><button className="action-card" onClick={onQuiz}><b>⌁</b><span>TEST</span><small>QUICK QUIZ</small></button><button className="action-card" onClick={onStart}><b>+</b><span>START</span><small>TODAY'S LESSON</small></button></div></section>
  <section className="stats"><Stat label="CURRENT DAY" value={progress.completed + 1} note="OF 60" /><Stat label="PROGRESS" value={`${percentage}%`} note="KEEP MOVING" accent="yellow" /><Stat label="STREAK" value={progress.streak} note="DAYS IN A ROW" accent="green" /><Stat label="MASTERY" value={`${mastery}%`} note="AVG. QUIZ SCORE" accent="blue" /></section>
  <section className="today-grid"><article className="lesson-card"><div className="card-marker">TODAY / DAY {String(progress.completed + 1).padStart(2, '0')}</div><p className="eyebrow">JAVASCRIPT FUNDAMENTALS</p><h2>Arrays &<br />Objects</h2><p className="description">Learn the data structures that make JavaScript applications useful, expressive, and easy to reason about.</p><div className="lesson-meta"><span>10 QUESTIONS</span><span>~25 MIN</span><span>1 CHALLENGE</span></div><button className="primary-button" onClick={onStart}>OPEN TODAY'S LESSON <b>→</b></button></article><article className="path-card"><p className="eyebrow">YOUR PATH</p><h2>WEEK 1 / 8</h2><div className="path-line">{[1,2,3,4,5,6,7].map(n => <div key={n} className={`path-day ${n <= progress.completed ? 'done' : n === progress.completed + 1 ? 'active' : ''}`}><b>{n <= progress.completed ? '✓' : String(n).padStart(2, '0')}</b><span>{n === progress.completed + 1 ? 'TODAY' : n <= progress.completed ? 'DONE' : 'LOCKED'}</span></div>)}</div><button className="text-button" onClick={onStart}>VIEW CURRICULUM →</button></article></section>
</> }
function Stat({ label, value, note, accent = '' }) { return <div className={`stat ${accent}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }
function Lesson({ onQuiz, onBack }) { return <section className="learning-view"><button className="back" onClick={onBack}>← DASHBOARD</button><p className="eyebrow">DAY 03 / JAVASCRIPT FUNDAMENTALS</p><h1>Arrays &<br /><em>Objects.</em></h1><div className="lesson-layout"><article className="objectives"><p className="eyebrow">TODAY YOU'LL LEARN</p><ol><li>How to create and update arrays</li><li>When to use array methods</li><li>How objects organize related data</li><li>How to access nested values safely</li></ol></article><article className="code-card"><span>EXAMPLE.JS</span><pre>{"const player = {\n  name: 'Jordan',\n  points: [18, 24, 31],\n}\n\nplayer.points.map(p => p * 2)"}</pre></article></div><button className="primary-button" onClick={onQuiz}>TAKE THE KNOWLEDGE CHECK <b>→</b></button></section> }
function Quiz({ answers, setAnswers, submitted, correct, onSubmit, onBack }) { return <section className="quiz-view"><button className="back" onClick={onBack}>← DASHBOARD</button><p className="eyebrow">DAY 03 / KNOWLEDGE CHECK</p><h1>Show what<br />you <em>know.</em></h1>{questions.map((q, qi) => <article className="question" key={q.prompt}><span>0{qi + 1} / 03</span><h2>{q.prompt}</h2><div className="choices">{q.choices.map((choice, ci) => <button disabled={submitted} className={`${answers[qi] === ci ? 'selected ' : ''}${submitted && ci === q.answer ? 'correct' : submitted && answers[qi] === ci ? 'incorrect' : ''}`} key={choice} onClick={() => setAnswers(a => ({...a, [qi]: ci}))}><i>{String.fromCharCode(65 + ci)}</i>{choice}</button>)}</div>{submitted && <p className="explanation"><b>{answers[qi] === q.answer ? 'Correct.' : 'Review:'}</b> This checks your understanding of {q.concept.toLowerCase()}.</p>}</article>)}{submitted ? <div className="result">SCORE <strong>{correct}/3</strong><button className="primary-button" onClick={onBack}>BACK TO DASHBOARD <b>→</b></button></div> : <button className="primary-button" disabled={Object.keys(answers).length !== questions.length} onClick={onSubmit}>SUBMIT ANSWERS <b>→</b></button>}</section> }
