import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { queryServer } from "../util/helpers";
import { Flex } from "../components/Flex";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";

import "ace-builds/src-noconflict/mode-python";

const TakeExamPage = (props) => {
    const { state } = useContext(MasterContext);
    const { examID } = state;
    const [ localState, setLocalState ] = useState({
        questionPool: null,
        currentQuestion: null,
        success: false,
        currentQuestionIdx: 0,
        answers: {},
    });
    const {
        questionPool, currentQuestion, success,
        currentQuestionIdx, answers
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateQuestionPool = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        const newQuestionPool = res.data;
        let newAnswers = { ...answers };
        setLocalState({
            ...localState,
            questionPool: newQuestionPool,
            currentQuestion: newQuestionPool[currentQuestionIdx],
            answers: newAnswers,
        });
    }

    const handleSubmitAnswers = (res) => {
        if(res.data == 'bad attempt') {
            // TODO: add error handling
            return;
        }
        setLocalState({
            ...localState,
            success: true
        });
    }

    if(!questionPool) {
        queryServer('get_an_exam', {
            id: userID,
            sesID: sesID,
            exam_id: examID,
        }, populateQuestionPool);
    } else if(!questionPool.length) {
        console.log('INVALID TEST');
    }

    return (
        !success ?
        <UserPage pageTitle="Take Exam" {...props}>
            {currentQuestion &&
            <Flex flexDirection="column">
                {questionPool && questionPool.length > 1 &&
                <Flex>
                    <Button
                        onClick={() => {
                            const newIdx = (currentQuestionIdx - 1) >= 0 ? currentQuestionIdx - 1 : questionPool.length - 1;
                            setLocalState({
                                ...localState,
                                currentQuestionIdx: newIdx,
                                currentQuestion: questionPool[newIdx]
                            });
                        }}
                    >
                        Prev
                    </Button>
                    <Button
                        onClick={() => {
                            const newIdx = (currentQuestionIdx + 1) < questionPool.length ? currentQuestionIdx + 1 : 0;
                            setLocalState({
                                ...localState,
                                currentQuestionIdx: newIdx,
                                currentQuestion: questionPool[newIdx]
                            });
                        }}
                    >
                        Next
                    </Button>
                </Flex>
                }
                <div>
                    {currentQuestion.name}
                </div>
                <div>
                    Points: {currentQuestion.point_value}
                </div>
                <AceEditor
                    mode="python"
                    name="code-editor"
                    height="200px"
                    value={answers[questionPool[currentQuestionIdx].question_id] || ""}
                    onChange={(value) => {
                        setLocalState({
                            ...localState,
                            answers: {
                                ...answers,
                                [questionPool[currentQuestionIdx].question_id]: value,
                            }
                        });
                    }}
                />
                <Button
                    onClick={() => {
                        if(currentQuestion && Object.keys(answers).length === questionPool.length) {
                            console.log(`questions: ${questionPool.map(question => question.question_id)}`);
                            queryServer('add_many_answer', {
                                id: userID,
                                sesID: sesID,
                                exam_id: examID,
                                answer_list: questionPool.map((question) => ({question_id: question.question_id, answer: answers[question.question_id]}))
                            }, handleSubmitAnswers);
                        }
                    }}
                >
                    Submit
                </Button>
            </Flex>
            }
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default TakeExamPage;