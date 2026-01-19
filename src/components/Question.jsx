import React from 'react'
import Options from './Options';
import { useQuiz } from '../contexts/QuizContext';

function Question() {
    const {state: {questions, index}} = useQuiz();
    const question = questions[index];
    return (
    <div>
        <h4>{question.question}</h4>

        <Options/>
    </div>
    )
}

export default Question
