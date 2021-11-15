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

// TODO: have a shared state for everything
// TODO: change state to localState, add localState helper???
const TakeExamPage = (props) => {
    const context = useContext(MasterContext);
    const { examID } = context.state;
    const [ state, setState ] = useState({
        questionPool: null,
        currentQuestion: null,
        success: false,
        currentQuestionIdx: 0,
        answers: {},
    });
    const { 
        questionPool, currentQuestion, success,
        currentQuestionIdx, answers
    } = state;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateQuestionPool = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        const newQuestionPool = res.data;
        let newAnswers = { ...answers };
        newQuestionPool.map((question) => {
            const question_args = question.function_parameters.split(',').map((param) => (param.trim().replace(/\s+/g, ' ').split(' ')[1])).join(', ')
            newAnswers = {
                ...newAnswers,
                [question.question_id]: `def ${question.function_name}(${question_args}):\n\t`,
        };});
        setState({
            ...state,
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
        setState({
            ...state,
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
                <Button
                    onClick={() => {
                        const newIdx = (currentQuestionIdx + 1) < questionPool.length ? currentQuestionIdx + 1 : 0;
                        setState({
                            ...state,
                            currentQuestionIdx: newIdx,
                            currentQuestion: questionPool[newIdx]
                        });
                    }}
                >
                    Next
                </Button>
                }
                <div>
                    {currentQuestion.name}
                </div>
                <AceEditor
                    mode="python"
                    name="code-editor"
                    height={200}
                    value={answers[questionPool[currentQuestionIdx].question_id] || ""}
                    onChange={(value) => {
                        setState({
                            ...state,
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