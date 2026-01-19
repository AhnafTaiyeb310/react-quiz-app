import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();

function useQuiz(){
    const context = useContext(QuizContext);

    if (context == undefined)
        throw new Error ("You used context outside of the provider");
    
    return context;
}

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

function QuizProvider({children}){
    const [state, dispatch] = useReducer(reducer, initState);
    const numQuestions = state.questions.length;
    const maxPoints = state.questions.reduce((acc,cur)=>acc+cur.points,0)

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

    const value = {
        state, dispatch, numQuestions, maxPoints
    }

    return(
        <QuizContext.Provider value={value}>
            {children}
        </QuizContext.Provider>
    )
}

export { QuizProvider, useQuiz}