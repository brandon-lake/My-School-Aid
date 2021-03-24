import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

/* This file contains the quiz page, where the user will quiz themselves on their chosen deck */
const DoDeckQuiz = ({deckData, cardList, setPageState}) => {

    const [userAnswer, setUserAnswer] = useState("");
    const [questionsAsked, setQuestionsAsked] = useState(0);
    const [answeredCorrect, setAnsweredCorrect] = useState(0);
    const [shuffledCards, setShuffledCards] = useState([]);
    const [quizState, setQuizState] = useState("question");     // question/answer/score

    useEffect(() => {
        let shuffled = [...cardList];

        // now do shuffle on shuffled - Fisher-Yates shuffle
        var m = shuffled.length, t, i;
        while (m) {
            // pick a remaining element
            i = Math.floor(Math.random() * m--);

            // swap it with the current element
            t = shuffled[m];
            shuffled[m] = shuffled[i];
            shuffled[i] = t;
        }

        setShuffledCards(shuffled);
    }, []);

    const updateUserAnswer = (e) => {
        setUserAnswer(e.target.value);
    }
    const submitAnswer = () => {
        setQuizState("answer");
    }

    const getScorePercent = () => {
        if (questionsAsked === 0)
            return "";
        
        return ((answeredCorrect / questionsAsked) * 100).toFixed(0) + "%";
    }

    const indicateCorrect = () => {
        setAnsweredCorrect(answeredCorrect => answeredCorrect + 1);
        endQuestion();
    }
    const endQuestion = () => {
        if (questionsAsked === shuffledCards.length - 1) {
            setQuizState("finished");
        } else {
            setQuizState("score");
        }
        setQuestionsAsked(questionsAsked => questionsAsked + 1);
    }
    const nextQuestion = () => {
        if (questionsAsked >= shuffledCards.length) {
            setQuizState("finished");
        } else {
            setQuizState("question");
            setUserAnswer("");
        }
    }
    const endQuiz = () => {
        setPageState("results");
    }

    // modal to display the question/answer state, to emulate the "front" and "back" sides of the flashcard.
    const modal = (
        <div className="modalScreen">
            <div className="modalContent">
                <div className="container">
                    { quizState === "question" &&
                        <div>
                            <div className="row justify-content-center">
                                <h2 className="modalHeader">Next Question...</h2>
                            </div>
                            <hr></hr>
                            <div className="row justify-content-center mt-4">
                                <h5>{shuffledCards.length > 0 && shuffledCards[questionsAsked].Question}</h5>
                            </div>
                            <div className="row justify-content-center mt-2">
                                <div className="col-12">
                                    <Form.Control className="w-100" type="text" value={userAnswer} onChange={updateUserAnswer} required />
                                </div>
                            </div>
                            <div className="row justify-content-center mt-4">
                                <div className="col-12">
                                    <Button className="w-100" onClick={submitAnswer}>
                                        <h5 className="mb-0">Submit Answer</h5>
                                    </Button>
                                </div>
                            </div>
                            <div className="row justify-content-center mt-2">
                                <div className="col-7" />
                                <div className="col-5">
                                    <Button variant="danger" className="w-100" onClick={endQuiz}>
                                        End Quiz?
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                    { quizState === "answer" &&
                        <div className="container">
                            <div className="row justify-content-center">
                                <h2 className="modalHeader">Results...</h2>
                            </div>
                            <hr></hr>
                            <div className="row justify-content-center mt-4">
                                <h3><u>Correct Answer:</u></h3>
                            </div>
                            <div className="row justify-content-center mt-2">
                                <h5>{shuffledCards[questionsAsked].Answer}</h5>
                            </div>
                            <hr></hr>
                            <div className="row justify-content-center mt-4">
                                <h3><u>Your Answer:</u></h3>
                            </div>
                            <div className="row justify-content-center mt-2">
                                <h5>{userAnswer}</h5>
                            </div>
                            <hr></hr>
                            <div className="row justify-content-center mt-4">
                                <h3><i>How did you do?</i></h3>
                            </div>
                            <div className="row justify-content-center mt-1">
                                <div className="col-6">
                                    <Button variant="success" className="w-100" onClick={indicateCorrect}>
                                        <span style={iconText}>&#x2713;</span>
                                    </Button>
                                </div>
                                <div className="col-6">
                                    <Button variant="danger" className="w-100" onClick={endQuestion}>
                                        <span style={iconText}>&#x2715;</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="text-center mt-5"><h3><i><u>{deckData.Title}</u></i></h3></div>
            <div className="text-center mt-5"><h3>Current Score: {answeredCorrect}/{questionsAsked}</h3></div>
            <div className="text-center mt-3"><h1 style={bigText}>{getScorePercent()}</h1></div>
            {quizState === "score" && 
                <div className="container mt-4">
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <Button variant="primary" style={mediumText} className="w-100" onClick={nextQuestion}>
                                Next Question
                            </Button>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <div className="col-2" />
                        <div className="col-2">
                            <Button variant="danger" className="w-100" onClick={endQuiz}>
                                End Quiz?
                            </Button>
                        </div>
                    </div>
                </div>
            }
            {quizState === "finished" &&
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-4 text-right">
                            <h3>Quiz Complete!</h3>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <div className="col-2" />
                        <div className="col-2">
                            <Button variant="primary" className="w-100" onClick={endQuiz}>
                                Return
                            </Button>
                        </div>
                    </div>
                </div>
            }
            {quizState === "question" || quizState === "answer" ? modal : <></>}
        </div>
    );
};

const iconText = {
    fontSize: "2em",
    fontWeight: "bold"
}
const mediumText = {
    fontSize: "1.5em"
}
const bigText = {
    fontSize: "4.5em"
}
export default DoDeckQuiz;