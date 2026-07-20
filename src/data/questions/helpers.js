// M = multiple choice, F = fill in the blank. Difficulty is 'easy' | 'medium' | 'hard'.
export const M = (prompt, choices, answer, concept, difficulty) => ({ prompt, choices, answer, concept, difficulty })
export const F = (prompt, answer, concept, difficulty) => ({ type: 'fill', prompt, answer, concept, difficulty })
