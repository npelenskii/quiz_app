import React from "react";
import Question from "./components/Question";
import He from "he";

export default function App() {
    const [questions, setQuestions] = React.useState([]);
    const [start, setStart] = React.useState(false);
    const [gameOver, setGameOver] = React.useState([false, 0]);
    const [restart, setRestart] = React.useState(false);

    function startApp() {
        setStart((prevVal) => !prevVal);
    }

    React.useEffect(
        function () {
            fetch("https://opentdb.com/api.php?amount=5")
                .then((res) => res.json())
                .then((data) => getQuestions(data.results));
        },
        //eslint-disable-next-line
        [restart]
    );

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    function getQuestions(data) {
        setQuestions(
            data.map((item) => {
                let answersFromApi = item.incorrect_answers;
                answersFromApi.push(item.correct_answer);
                shuffle(answersFromApi);
                let answersToPage = answersFromApi.map((item) =>
                    He.decode(item)
                );
                return {
                    question: He.decode(item.question),
                    correct_answer: He.decode(item.correct_answer),
                    answers: answersToPage,
                    answer: "",
                };
            })
        );
    }

    function takeAnswer(answer, question) {
        if (!gameOver[0]) {
            setQuestions((prevQuest) => {
                const newQuest = prevQuest.map((item) => {
                    return item.question === question
                        ? {
                              ...item,
                              answer: answer,
                          }
                        : item;
                });
                return newQuest;
            });
        }
    }

    const questionsElements = questions.map((item) => (
        <Question
            key={item.question}
            question={item.question}
            correct_answer={item.correct_answer}
            answers={item.answers}
            answer={item.answer}
            takeAnswer={takeAnswer}
            gameOver={gameOver[0]}
        />
    ));

    function checkAnswer() {
        let count = 0;
        questions.map((item) => {
            if (item.correct_answer === item.answer) {
                count++;
            }
            return count;
        });
        setGameOver([true, count]);
    }

    function restartGame() {
        setGameOver([false, 0]);
        setRestart((prevVal) => !prevVal);
    }

    return (
        <main className="App">
            {!start ? (
                <div className="start--div">
                    <h1 className="start--heading">Quizzical</h1>
                    <h4 className="start--text">Trivia game</h4>
                    <button className="start--button" onClick={startApp}>
                        Start quiz
                    </button>
                </div>
            ) : (
                <div className="questions--div">
                    {questionsElements}
                    <div className="result--box">
                        {gameOver[0] && (
                            <h1 className="result--text">
                                You scored {gameOver[1]}/5 correct answers
                            </h1>
                        )}
                        {!gameOver[0] ? (
                            <button
                                className="check--button"
                                onClick={checkAnswer}
                            >
                                Check answers
                            </button>
                        ) : (
                            <button
                                className="restart--button"
                                onClick={restartGame}
                            >
                                Play again
                            </button>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
