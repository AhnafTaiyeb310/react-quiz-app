import { useEffect, useReducer } from "react"

import Loader from "./Loader"
import Error from "./Error"
import Header from "./Header"
import StartScreen from "./StartScreen"
import Question  from "./Question"
import NextButton from "./NextButton"
import Progress from "./Progress"
import FinishScreen from "./FinishScreen"
import Timer from "./Timer"

function reducer(state, action){
    switch (action.type) {
        case "dataReceived":
            return {
                ...state, questions: action.payload, status:"ready"
            }
        case "dataFailed":
            return{
                ...state, status:"error"
            }
        case "start":
            return{...state, status:"active", remainingTime: state.questions.length * 15}
        case "newAnswer":{
            const question = state.questions.at(state.index);
            return{
                ...state, 
                answer:action.payload,
                points: action.payload == question.correctOption 
                            ? state.points + question.points
                            : state.points
            }}
        case "nextQuestion":
            return {
                ...state, index:state.index + 1, answer:null
            }
        case "finish":
            return{
                ...state, status: "finished", 
                highscore: state.points > state.highscore ? state.points : state.highscore 
            }
        case "restart":
            return {...initState, questions: state.questions, highscore:state.highscore, status:"ready"}
        case "tick":
            return {...state, 
                remainingTime: state.remainingTime - 1, 
                status: state.remainingTime == 0 ? "finished" : state.status}
        default:
            throw new Error("Action Unknown");
    }
}

const initState = {
    questions: [],
    status:  "loading",
    index: 0,
    answer:null,
    points:0,
    highscore:0,
    remainingTime:0,
}

export default function App(){
    const [{questions, status, index, answer, points, remainingTime}, dispatch] = useReducer(reducer,initState)
    const numQuestions = questions.length;
    const maxPoints = questions.reduce((acc,cur)=>acc+cur.points,0)

    useEffect(function(){
        async function fetchData(){
            try {
                const res = await fetch("http://localhost:8000/questions");
                const data = await res.json();
                dispatch({type: "dataReceived", payload: data})

            } catch (error) {
                dispatch({type:"dataFailed"})
            }
        }
        fetchData();
    },[])
    return(
        <div className="app">
            <Header />

        <main className="main">
            {status == "loading" && <Loader />}
            {status == "error" && <Error />}
            {status == "ready" && <StartScreen numQuestions= {numQuestions} dispatch={dispatch}/>}
            {status == "active" && 
            <>
            <Progress 
            index={index} 
            numQuestions={numQuestions} 
            points={points} 
            maxPoints= {maxPoints} 
            answer= {answer}/>
            <Question 
            numQuestions= {numQuestions} 
            question={questions[index]}   
            dispatch={dispatch} 
            answer={answer} />
            <NextButton dispatch= {dispatch} answer= {answer} numQuestions={numQuestions} index= {index}/>
            <Timer dispatch={dispatch} remainingTime={remainingTime}/>
            </>
            }
            {status === "finished" && <FinishScreen points={points} maxPoints={maxPoints} dispatch={dispatch}/>}

        </main>

        </div>
    )
}