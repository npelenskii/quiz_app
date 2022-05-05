export default function Question(props) {
    const answers = props.answers.map((item) => {
        let styled;
        if (!props.gameOver) {
            styled =
                item === props.answer
                    ? { backgroundColor: "#D6DBF5", border: "none" }
                    : { backgroundColor: "#FFFFFF" };
        } else {
            if (
                (item === props.correct_answer && item === props.answer) ||
                (item === props.correct_answer && item !== props.answer)
            ) {
                styled = {
                    backgroundColor: "#94D7A2",
                    border: "none",
                };
            } else if (item !== props.correct_answer && item === props.answer) {
                styled = {
                    backgroundColor: "#F8BCBC",
                    border: "none",
                    opacity: "0.5",
                };
            } else {
                styled = {
                    opacity: "0.5",
                };
            }
        }

        return (
            <div
                key={item}
                className="answer--label_box"
                onClick={() => props.takeAnswer(item, props.question)}
                style={styled}
            >
                <h4 className="answer--text">{item}</h4>
            </div>
        );
    });
    return (
        <div className="quesion--box">
            <legend className="question--text">{props.question}</legend>
            <div className="answer--box">{answers}</div>
            <hr />
        </div>
    );
}
