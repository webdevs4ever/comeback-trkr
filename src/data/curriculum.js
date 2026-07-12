export const lessons = [
  { day: 1, title: 'Values, types & variables', status: 'complete', score: 90 },
  { day: 2, title: 'Functions & scope', status: 'complete', score: 80 },
  { day: 3, title: 'Arrays & objects', status: 'current', score: 0 }
]

export const questions = [
  { prompt: 'Which method creates a new array by transforming every item?', choices: ['forEach()', 'map()', 'find()', 'some()'], answer: 1, concept: 'Array methods' },
  { prompt: 'What does a const declaration prevent?', choices: ['Changing an object', 'Reassigning the binding', 'Reading a value', 'Calling a function'], answer: 1, concept: 'Variables' },
  { prompt: 'Which value is returned when a property does not exist?', choices: ['null', 'false', 'undefined', '0'], answer: 2, concept: 'Objects' }
]
