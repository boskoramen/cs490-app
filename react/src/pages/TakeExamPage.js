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
    const [ questionPool, setQuestionPool ] = useState(null);
    const [ currentQuestion, setCurrentQuestion ] = useState(null);
    const [ success, setSuccess ] = useState(false);
    const [ currentQuestionIdx, setCurrentQuestionIdx ] = useState(0);
    const [ answers, setAnswers ] = useState({});

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateQuestionPool = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        setQuestionPool(res.data);
    }

    const setQuestion = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        setCurrentQuestion(res.data || 'bruh');
    }

    const handleStartTest = (res) => {
        if(!res.data) {
            // TODO: add error handling
            return;
        }
        queryServer('add_many_answer', {
            id: userID,
            sesID: sesID,
            test_id: res.data.test_id,
            answer_list: questionPool.map((question) => ({question_id: question.question_id, answer: answers[question.question_id]}))
        }, (res) => {
            if(!res.data) {
                // TODO: add error handling
                return;
            } else if(res.data != questionPool.length) {
                // TODO: add error handling
                return;
            }
            setSuccess(true);
        });
    }

    if(!questionPool) {
        queryServer('get_exam_question', {
            id: userID,
            sesID: sesID,
            exam_id: examID,
        }, populateQuestionPool);
    } else if(!questionPool.length) {
        console.log('INVALID TEST');
    } else if(currentQuestion === null) {
        queryServer('get_question_id', {
            id: userID,
            sesID: sesID,
            question_id: questionPool[0].question_id,
        }, setQuestion);
    }

    return (
        !success ?
        <UserPage pageTitle="Take Exam" {...props}>
            {currentQuestion &&
            <Flex flexDirection="column">
                <Button
                    onClick={() => {
                        const newIdx = (currentQuestionIdx + 1) < questionPool.length ? currentQuestionIdx + 1 : 0;
                        setCurrentQuestionIdx(newIdx);
                        queryServer('get_question_id', {
                            id: userID,
                            sesID: sesID,
                            question_id: questionPool[newIdx].question_id,
                        }, setQuestion);
                    }}
                >
                    Next
                </Button>
                <div>
                    {currentQuestion.name}
                </div>
                <AceEditor
                    mode="python"
                    name="code-editor"
                    value={answers[questionPool[currentQuestionIdx].question_id] || ""}
                    onChange={(value) => {
                        setAnswers({
                            ...answers,
                            [questionPool[currentQuestionIdx].question_id]: value,
                        });
                    }}
                />
                <Button
                    onClick={() => {
                        if(currentQuestion && Object.keys(answers).length === questionPool.length) {
                            queryServer('start_test', {
                                id: userID,
                                sesID: sesID,
                                exam_id: examID,
                            }, handleStartTest);
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