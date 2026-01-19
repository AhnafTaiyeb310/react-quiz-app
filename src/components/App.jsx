import Loader from "./Loader"
import Error from "./Error"
import Header from "./Header"
import StartScreen from "./StartScreen"
import Question  from "./Question"
import NextButton from "./NextButton"
import Progress from "./Progress"
import FinishScreen from "./FinishScreen"
import Timer from "./Timer"
import { useQuiz } from "../contexts/QuizContext"

export default function App(){
    const {state: {status}} = useQuiz();
    return(
        <div className="app">
            <Header />

        <main className="main">
            {status == "loading" && <Loader />}
            {status == "error" && <Error />}
            {status == "ready" && <StartScreen/>}
            {status == "active" && 
            <>
            <Progress/>
            <Question/>
            <NextButton/>
            <Timer/>
            </>
            }
            {status === "finished" && <FinishScreen/>}

        </main>

        </div>
    )
}