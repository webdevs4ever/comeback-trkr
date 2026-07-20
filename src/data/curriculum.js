import { js1 } from './questions/js1.js'
import { js2 } from './questions/js2.js'
import { react1 } from './questions/react1.js'
import { react2 } from './questions/react2.js'
import { ai } from './questions/ai.js'
import { backend } from './questions/backend.js'
import { craft } from './questions/craft.js'

export const TOTAL_DAYS = 90

// Title shown for each day. The track (JAVASCRIPT / REACT / ...) is derived from
// the day number in trackForDay below, so lessons only need a title here.
export const lessonTitles = {
  1: 'Variables & Types', 2: 'Functions & Scope', 3: 'Arrays & Objects', 4: 'Array Methods',
  5: 'String Methods', 6: 'Operators & Switch', 7: 'Loops', 8: 'Destructuring',
  9: 'Spread & Rest', 10: 'Template Literals', 11: 'Logical Operators', 12: 'Truthy & Falsy',
  13: 'Type Coercion', 14: 'Error Handling', 15: 'Closures', 16: 'Higher-Order Functions',
  17: 'The this Keyword', 18: 'Prototypes', 19: 'Classes', 20: 'Promises',
  21: 'Async / Await', 22: 'The Fetch API', 23: 'ES Modules', 24: 'Iterators & Generators',
  25: 'Symbols & WeakMap', 26: 'Proxy & Reflect', 27: 'Regular Expressions', 28: 'Dates & Math',
  29: 'JSX & the Virtual DOM', 30: 'Components & Props', 31: 'useState', 32: 'useEffect',
  33: 'Event Handling', 34: 'Conditional Rendering', 35: 'Lists & Keys', 36: 'Controlled Inputs',
  37: 'Composition & children', 38: 'Context API', 39: 'useRef', 40: 'useMemo & useCallback',
  41: 'Custom Hooks', 42: 'React Router', 43: 'State Management', 44: 'useReducer',
  45: 'Performance Optimization', 46: 'Error Boundaries', 47: 'Portals', 48: 'Suspense & Lazy Loading',
  49: 'React 19 Features', 50: 'Testing with RTL', 51: 'Accessibility', 52: 'Animation',
  53: 'Forms & Validation', 54: 'Data Fetching Patterns', 55: 'TypeScript with React', 56: 'Building & Deploying',
  57: 'Intro to LLMs', 58: 'Calling LLM APIs', 59: 'Prompt Engineering', 60: 'Streaming Responses',
  61: 'Function Calling & Tools', 62: 'Retrieval-Augmented Generation', 63: 'Vector Databases', 64: 'Embeddings',
  65: 'Building a Chat UI', 66: 'System Prompts & Safety', 67: 'The Claude API', 68: 'Managing Conversations',
  69: 'AI Agents', 70: 'Evaluation & Hallucination', 71: 'The Node.js Runtime', 72: 'Express.js',
  73: 'REST APIs', 74: 'Middleware', 75: 'Authentication & JWT', 76: 'SQL Basics',
  77: 'PostgreSQL', 78: 'Prisma ORM', 79: 'File Uploads', 80: 'WebSockets',
  81: 'Caching & Redis', 82: 'API Security', 83: 'Backend Testing', 84: 'Docker',
  85: 'Scaling & Deployment', 86: 'Code Review', 87: 'Git Workflows', 88: 'Web Performance',
  89: 'Algorithms & Data Structures', 90: 'System Design',
}

const tracks = [
  { max: 28, name: 'JAVASCRIPT' },
  { max: 56, name: 'REACT' },
  { max: 70, name: 'AI / LLM INTEGRATION' },
  { max: 85, name: 'BACKEND & FULL STACK' },
  { max: 90, name: 'ENGINEERING CRAFT' },
]

export function trackForDay(day) {
  return (tracks.find(t => day <= t.max) ?? tracks[tracks.length - 1]).name
}

const trackCode = {
  'JAVASCRIPT': "const player = {\n  name: 'Jordan',\n  points: [18, 24, 31],\n}\n\nplayer.points.map(p => p * 2)",
  'REACT': "function Counter() {\n  const [count, setCount] = useState(0)\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      {count}\n    </button>\n  )\n}",
  'AI / LLM INTEGRATION': "const res = await client.messages.create({\n  model: 'claude-sonnet-4-6',\n  max_tokens: 1024,\n  messages: [{ role: 'user', content: prompt }],\n})\n\nconsole.log(res.content[0].text)",
  'BACKEND & FULL STACK': "app.get('/api/users/:id', async (req, res) => {\n  const user = await db.user.findUnique({\n    where: { id: req.params.id },\n  })\n  res.json(user)\n})",
  'ENGINEERING CRAFT': "// Binary search — O(log n)\nlet lo = 0, hi = arr.length - 1\nwhile (lo <= hi) {\n  const mid = (lo + hi) >> 1\n  if (arr[mid] === target) return mid\n  arr[mid] < target ? (lo = mid + 1) : (hi = mid - 1)\n}",
}

export function codeForDay(day) {
  return trackCode[trackForDay(day)]
}

// Lesson objectives are derived from the concepts the day's questions test.
export function objectivesForDay(day) {
  return [...new Set((questionsByDay[day] ?? []).map(q => q.concept))]
}

// 900 questions: 10 per day across 90 days. 250 are fill-in-the-blank
// (type: 'fill', answer is a string); the rest are multiple choice
// (answer is a choice index). Every question carries a difficulty of
// 'easy', 'medium', or 'hard'.
export const questionsByDay = { ...js1, ...js2, ...react1, ...react2, ...ai, ...backend, ...craft }
