import { useEffect, useMemo, useState } from 'react'
import { questionsByDay, lessonTitles, trackForDay, codeForDay, objectivesForDay, TOTAL_DAYS } from './data/curriculum'

const storageKey = 'developer-academy-progress'
const initial = { completed: 0, streak: 0, scores: [] }

const isCorrect = (q, a) => q.type === 'fill'
  ? typeof a === 'string' && a.trim().toLowerCase() === q.answer.toLowerCase()
  : a === q.answer
const isAnswered = a => typeof a === 'string' ? a.trim() !== '' : Number.isFinite(a)

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
  const day = progress.completed + 1
  const questions = questionsByDay[day] ?? []
  const lesson = { day, track: trackForDay(day), title: lessonTitles[day] ?? 'Course Complete', objectives: objectivesForDay(day), code: codeForDay(day) }
  const percentage = Math.round((progress.completed / TOTAL_DAYS) * 100)
  const mastery = useMemo(() => Math.round(progress.scores.reduce((sum, score) => sum + score, 0) / (progress.scores.length || 1)), [progress])
  const correct = questions.filter((q, i) => isCorrect(q, answers[i])).length
  const startLesson = () => { setScreen('lesson'); setSubmitted(false); setAnswers({}) }
  const submitQuiz = () => setSubmitted(true)
  const finishQuiz = () => {
    if (submitted && progress.completed < TOTAL_DAYS) setProgress(p => ({ ...p, completed: p.completed + 1, streak: p.streak + 1, scores: [...p.scores, Math.round(correct / questions.length * 100)] }))
    setSubmitted(false); setAnswers({}); setScreen('dashboard')
  }
  return <main className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => setScreen('dashboard')}><span>DEVELOPER</span> ACADEMY</button><div className="day-pill">DAY {String(progress.completed + 1).padStart(2, '0')} <i /></div><button className="reset" onClick={() => { localStorage.removeItem(storageKey); setProgress(initial); setScreen('dashboard') }}>RESET</button></header>
    {screen === 'dashboard' && <Dashboard progress={progress} lesson={lesson} questionCount={questions.length} percentage={percentage} mastery={mastery} onStart={startLesson} onQuiz={() => setScreen('quiz')} />}
    {screen === 'lesson' && <Lesson lesson={lesson} onQuiz={() => setScreen('quiz')} onBack={() => setScreen('dashboard')} />}
    {screen === 'quiz' && <Quiz questions={questions} answers={answers} setAnswers={setAnswers} submitted={submitted} correct={correct} onSubmit={submitQuiz} onBack={finishQuiz} />}
  </main>
}

function Dashboard({ progress, lesson, questionCount, percentage, mastery, onStart, onQuiz }) {
  const totalWeeks = Math.ceil(TOTAL_DAYS / 7)
  const week = Math.ceil(lesson.day / 7)
  const weekStart = (week - 1) * 7 + 1
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i).filter(n => n <= TOTAL_DAYS)
  return <>
  <section className="hero"><div><p className="eyebrow">{TOTAL_DAYS}-DAY REBUILD</p><h1>BUILD<br />YOUR<br /><em>COMEBACK.</em></h1></div><div className="hero-actions"><button className="action-card" onClick={onQuiz}><b>⌁</b><span>TEST</span><small>QUICK QUIZ</small></button><button className="action-card" onClick={onStart}><b>+</b><span>START</span><small>TODAY'S LESSON</small></button></div></section>
  <section className="stats"><Stat label="CURRENT DAY" value={lesson.day} note={`OF ${TOTAL_DAYS}`} /><Stat label="PROGRESS" value={`${percentage}%`} note="KEEP MOVING" accent="yellow" /><Stat label="STREAK" value={progress.streak} note="DAYS IN A ROW" accent="green" /><Stat label="MASTERY" value={`${mastery}%`} note="AVG. QUIZ SCORE" accent="blue" /></section>
  <section className="today-grid"><article className="lesson-card"><div className="card-marker">TODAY / DAY {String(lesson.day).padStart(2, '0')}</div><p className="eyebrow">{lesson.track}</p><h2>{lesson.title}</h2><p className="description">Today's focus in the {lesson.track.toLowerCase()} track. Work through the objectives, then test yourself with the knowledge check.</p><div className="lesson-meta"><span>{questionCount} QUESTIONS</span><span>~25 MIN</span><span>1 CHALLENGE</span></div><button className="primary-button" onClick={onStart}>OPEN TODAY'S LESSON <b>→</b></button></article><article className="path-card"><p className="eyebrow">YOUR PATH</p><h2>WEEK {week} / {totalWeeks}</h2><div className="path-line">{weekDays.map(n => <div key={n} className={`path-day ${n <= progress.completed ? 'done' : n === lesson.day ? 'active' : ''}`}><b>{n <= progress.completed ? '✓' : String(n).padStart(2, '0')}</b><span>{n === lesson.day ? 'TODAY' : n <= progress.completed ? 'DONE' : 'LOCKED'}</span></div>)}</div><button className="text-button" onClick={onStart}>VIEW CURRICULUM →</button></article></section>
</> }
function Stat({ label, value, note, accent = '' }) { return <div className={`stat ${accent}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }
function Lesson({ lesson, onQuiz, onBack }) { return <section className="learning-view"><button className="back" onClick={onBack}>← DASHBOARD</button><p className="eyebrow">DAY {String(lesson.day).padStart(2, '0')} / {lesson.track}</p><h1>{lesson.title}<em>.</em></h1><div className="lesson-layout"><article className="objectives"><p className="eyebrow">TODAY YOU'LL LEARN</p><ol>{lesson.objectives.map(o => <li key={o}>{o}</li>)}</ol></article><article className="code-card"><span>EXAMPLE.JS</span><pre>{lesson.code}</pre></article></div><button className="primary-button" onClick={onQuiz}>TAKE THE KNOWLEDGE CHECK <b>→</b></button></section> }
function Quiz({ questions, answers, setAnswers, submitted, correct, onSubmit, onBack }) { return <section className="quiz-view"><button className="back" onClick={onBack}>← DASHBOARD</button><p className="eyebrow">KNOWLEDGE CHECK</p><h1>Show what<br />you <em>know.</em></h1>{questions.map((q, qi) => <article className="question" key={q.prompt}><span>{String(qi + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')} <em className={`difficulty ${q.difficulty}`}>{q.difficulty.toUpperCase()}</em></span><h2>{q.prompt}</h2>{q.type === 'fill'
  ? <div className={`fill ${submitted ? (isCorrect(q, answers[qi]) ? 'correct' : 'incorrect') : ''}`}><input type="text" disabled={submitted} placeholder="TYPE YOUR ANSWER" value={answers[qi] ?? ''} onChange={e => setAnswers(a => ({...a, [qi]: e.target.value}))} />{submitted && !isCorrect(q, answers[qi]) && <span className="reveal">ANSWER: {q.answer}</span>}</div>
  : <div className="choices">{q.choices.map((choice, ci) => <button disabled={submitted} className={`${answers[qi] === ci ? 'selected ' : ''}${submitted && ci === q.answer ? 'correct' : submitted && answers[qi] === ci ? 'incorrect' : ''}`} key={choice} onClick={() => setAnswers(a => ({...a, [qi]: ci}))}><i>{String.fromCharCode(65 + ci)}</i>{choice}</button>)}</div>}{submitted && <p className="explanation"><b>{isCorrect(q, answers[qi]) ? 'Correct.' : 'Review:'}</b> This checks your understanding of {q.concept.toLowerCase()}.</p>}</article>)}{submitted ? <div className="result">SCORE <strong>{correct}/{questions.length}</strong><button className="primary-button" onClick={onBack}>BACK TO DASHBOARD <b>→</b></button></div> : <button className="primary-button" disabled={!questions.every((q, qi) => isAnswered(answers[qi]))} onClick={onSubmit}>SUBMIT ANSWERS <b>→</b></button>}</section> }
