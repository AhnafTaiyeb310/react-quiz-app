import React from 'react'
import { useQuiz } from '../contexts/QuizContext';

function FinishScreen() {
    const {state: {points, maxPoint, highscore}, dispatch} = useQuiz()
    const percentage = (points/maxPoint)* 100;
    return (
        <>
    <p className='result'>
        Your Scored {points} out of {maxPoint}
        ({Math.ceil(percentage)}%)
    </p>
    <button className='btn btn-ui' onClick={()=>dispatch({type:"restart"})}>Restart Quiz</button>
    <div className='timer'>highscore is {highscore}</div>
    </>
    )
}

export default FinishScreen
