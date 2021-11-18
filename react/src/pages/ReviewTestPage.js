import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Textbox } from "../components/Textbox";
import { queryServer, replaceChar } from "../util/helpers";
import { Checkbox } from "../components/Checkbox";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";

import "ace-builds/src-noconflict/mode-python";

const ReviewTestPage = (props) => {
    const { state } = useContext(MasterContext);
    const { test } = state;
    const {
        username, test_answer_data, test_id
    } = test;
    const [ localState, setLocalState ] = useState({
        success: false,
        currentAnswerIdx: 0,
        review: {}
    });
    const {
        success, currentAnswerIdx, review
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    // Populate review if it's empty
    if(Object.keys(review).length == 0) {
        let newReview = {};
        for(const answer of test_answer_data) {
            const testCaseScore = JSON.parse(answer.test_case_score);
            const constraints = testCaseScore.constraints;
            const inputOutputData = Object.keys(testCaseScore.test_case).map((key) => {
                return {
                    input: testCaseScore.test_case[key].input,
                    expected_output: testCaseScore.test_case[key].expected_output,
                    actual_output: testCaseScore.test_case[key].function_output,
                };
            });
            newReview = {
                ...newReview,
                [answer.test_answer_id]: {
                    review: '',
                    score: answer.score,
                    input_output_data: inputOutputData,
                    test_case_value: testCaseScore.value,
                    constraints
                }
            }
        }
        setLocalState({
            ...localState,
            review: newReview
        });
    }

    const currentAnswer = test_answer_data[currentAnswerIdx];
    const testCaseData = JSON.parse(currentAnswer.test_case_score);
    return (
        !success ?
        <UserPage pageTitle="Review Exam" {...props}>
            <Flex flexDirection="column">
                {test_answer_data.length > 1 &&
                <Button
                    onClick={() => {
                        const newIdx = (currentAnswerIdx + 1) < test_answer_data.length ? currentAnswerIdx + 1 : 0;
                        setLocalState({
                            ...localState,
                            currentAnswerIdx: newIdx,
                        });
                    }}
                >
                    Next
                </Button>
                }
                <AceEditor
                    mode="python"
                    name="code-editor"
                    readOnly={true}
                    value={currentAnswer.answer || ""}
                    height="200px"
                />
                <div>
                    Review:
                </div>
                <Textbox
                    value={Object.keys(review).length && review[currentAnswer.test_answer_id].review}
                    onChange={(value) => {
                        const curReview = review[currentAnswer.test_answer_id];
                        setLocalState({
                            ...localState,
                            review: {
                                ...review,
                                [currentAnswer.test_answer_id]: {
                                    ...curReview,
                                    review: value,
                                }
                            }
                        });
                    }}
                />
                <Flex
                    flexDirection="column"
                >
                    {Object.keys(testCaseData.constraints).map((constraint, idx) => {
                        const currentScore = Object.keys(review).length && review[currentAnswer.test_answer_id].score;
                        return (
                            <Flex
                                key={constraint}
                                backgroundColor="gray"
                            >
                                <Checkbox
                                    checked={currentScore[idx] == currentAnswer.score[idx]}
                                    onClick={() => {
                                        setLocalState({
                                            ...localState,
                                            review: {
                                                ...review,
                                                [currentAnswer.test_answer_id]: {
                                                    ...review[currentAnswer.test_answer_id],
                                                    score: replaceChar(currentScore, idx, (currentScore[idx] == 1 ? 0 : 1))
                                                }
                                            },
                                        });
                                    }}
                                />
                                <Box
                                >
                                    Constraint {constraint}:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {testCaseData.constraints[constraint]}
                                </Box>
                            </Flex>
                        );
                    })}
                    {Object.keys(testCaseData.test_case).map((testCase, idx) => {
                        // Next level mental gymnastics below
                        // Everything is based on modifying the review score SPECIFICALLY
                        const constraintCount = Object.keys(testCaseData.constraints).length;
                        const currentScore = Object.keys(review).length && review[currentAnswer.test_answer_id].score;
                        return (
                            <Flex
                                key={testCase}
                                backgroundColor="gray"
                            >
                                <Checkbox
                                    checked={currentScore[idx + constraintCount] == currentAnswer.score[idx + constraintCount]}
                                    onClick={() => {
                                        setLocalState({
                                            ...localState,
                                            review: {
                                                ...review,
                                                [currentAnswer.test_answer_id]: {
                                                    ...review[currentAnswer.test_answer_id],
                                                    score: replaceChar(currentScore, idx + constraintCount, (currentScore[idx + constraintCount] == 1 ? 0 : 1))
                                                }
                                            },
                                        });
                                    }}
                                />
                                <Box
                                >
                                    Test Case {testCase}:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {testCaseData.test_case[testCase].score}
                                </Box>
                            </Flex>
                        );
                    })}
                </Flex>
                <Button
                    onClick={() => {
                        queryServer('review', {
                            answer_list: Object.keys(review).map((answerID) => ({
                                test_answer_id: answerID,
                                ...review[answerID],
                            })),
                            test_id,
                        }, (res) => {
                            if(res.data == 'bad attempt') {
                                console.log(`bad attempt???`);
                                return;
                            }

                            console.log('success');

                            setLocalState({
                                ...localState,
                                success: true,
                            });
                        })
                    }}
                >
                    Submit
                </Button>
            </Flex>
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default ReviewTestPage;