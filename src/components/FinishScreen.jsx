import React from 'react'

function FinishScreen({points, maxPoints, dispatch}) {
    const percentage = (points/maxPoints)* 100;
    return (
        <>
    <p className='result'>
        Your Scored {points} out of {maxPoints}
        ({Math.ceil(percentage)}%)
    </p>
    <button className='btn btn-ui' onClick={()=>dispatch({type:"restart"})}>Restart Quiz</button>
    </>
    )
}

export default FinishScreen
