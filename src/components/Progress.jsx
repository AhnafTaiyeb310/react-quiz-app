import React from 'react'
import { useQuiz } from '../contexts/QuizContext'

function Progress() {
    const {state: {index, points, answer}, numQuestions, maxPoints} = useQuiz();
    return (
    <header className='progress'>
        <progress max={numQuestions} value={index + Number(answer !== null)}/>
        <p>Question: <strong>{index + 1}</strong>/{numQuestions}</p>
        <p>{points}/ {maxPoints}</p>
    </header>
    )
}

export default Progress
