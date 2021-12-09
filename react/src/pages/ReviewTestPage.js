import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Textbox } from "../components/Textbox";
import { queryServer, deepCopy } from "../util/helpers";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";
import { constraint_description } from "../util/constants";

import "ace-builds/src-noconflict/mode-python";
import { Input } from "../components/Input";

const ReviewTestPage = (props) => {
    const { state } = useContext(MasterContext);
    const { test } = state;
    const {
        username, test_answer_data, test_id
    } = test;
    const [ localState, setLocalState ] = useState({
        success: false,
        currentAnswerIdx: 0,
        review: {
            setup: false,
        },
    });
    const {
        success, currentAnswerIdx, review
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    // Populate review if it's empty
    if(!review.setup) {
        let newReview = {
            setup: true,
        };
        for(const answer of test_answer_data) {
            const { test_answer_id, test_case_data, constraint_data, point_value } = answer;
            newReview = {
                ...newReview,
                [test_answer_id]: {
                    review: '',
                    test_case_data: deepCopy(test_case_data),
                    constraint_data: deepCopy(constraint_data),
                    max_point_value: point_value,
                }
            }
        }
        setLocalState({
            ...localState,
            review: newReview
        });
    }

    const currentAnswer = test_answer_data[currentAnswerIdx];
    const { test_case_data, constraint_data } = currentAnswer;
    let totalScore = 0;
    if(review.setup) {
        for(let answer of test_answer_data) {
            for(let constraint of review[answer.test_answer_id].constraint_data) {
                totalScore += constraint.score;
            }
            for(let testCase of review[answer.test_answer_id].test_case_data) {
                totalScore += testCase.score;
            }
        }
    }
    return (
        !success ?
        <UserPage pageTitle="Review Exam" {...props}>
            <Flex flexDirection="column">
                {test_answer_data.length > 1 &&
                <Flex>
                    <Button
                        onClick={() => {
                            const newIdx = (currentAnswerIdx - 1) >= 0 ? currentAnswerIdx - 1 : test_answer_data.length - 1;
                            setLocalState({
                                ...localState,
                                currentAnswerIdx: newIdx,
                            });
                        }}
                    >
                        Prev
                    </Button>
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
                </Flex>
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
                    value={review.setup && review[currentAnswer.test_answer_id].review}
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
                    {constraint_data.map((constraint, idx) => {
                        if(!review.setup) {
                            return;
                        }
                        const currentReview = review[currentAnswer.test_answer_id];
                        const reviewConstraint = currentReview.constraint_data[idx];
                        return (
                            <Flex
                                key={constraint.id}
                                backgroundColor="gray"
                            >
                                <Box
                                >
                                    Constraint:
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {constraint_description[constraint.name]}
                                </Box>
                                <Box
                                    backgroundColor="beige"
                                >
                                    {constraint.score}
                                </Box>
                                    <Input
                                        type="number"
                                        value={reviewConstraint.score}
                                        onChange={(val) => {
                                            if(val === NaN) {
                                                val = 0;
                                            }
                                            reviewConstraint.score = Math.min(0, val);
                                            setLocalState({
                                                ...localState,
                                                review: {
                                                    ...review,
                                                    [currentAnswer.test_answer_id]: {
                                                        ...currentReview
                                                    },
                                                }
                                            });
                                        }}
                                    />
                            </Flex>
                        );
                    })}
                    {test_case_data.map((testCase, idx) => {
                        if(!review.setup) {
                            return;
                        }
                        const currentReview = review[currentAnswer.test_answer_id];
                        const reviewTestCase = currentReview.test_case_data[idx];
                        return (
                            <Flex
                                key={testCase.id}
                                backgroundColor="gray"
                            >
                                <Flex
                                    flexDirection="column"
                                >
                                    <Box>
                                        <Box
                                        >
                                            Test Case {idx+1}:
                                        </Box>
                                        <Flex>
                                            <Box
                                                backgroundColor="beige"
                                            >
                                                {testCase.score}
                                            </Box>
                                            <Input
                                                type="number"
                                                value={reviewTestCase.score}
                                                onChange={(val) => {
                                                    if(val === NaN) {
                                                        val = 0;
                                                    }
                                                    reviewTestCase.score = Math.max(0, val);
                                                    setLocalState({
                                                        ...localState,
                                                        review: {
                                                            ...review,
                                                            [currentAnswer.test_answer_id]: {
                                                                ...currentReview
                                                            },
                                                        }
                                                    });
                                                }}
                                            />
                                        </Flex>
                                    </Box>
                                    <Flex>
                                        <Box>
                                            Input:
                                        </Box>
                                        <Box
                                            backgroundColor="beige"
                                        >
                                            {testCase.input}
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <Box>
                                            Expected Output:
                                        </Box>
                                        <Box
                                            backgroundColor="beige"
                                        >
                                            {testCase.expected_output}
                                        </Box>
                                    </Flex>
                                    <Flex>
                                        <Box>
                                            Actual Output:
                                        </Box>
                                        <Box
                                            backgroundColor="beige"
                                        >
                                            {testCase.output}
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Flex>
                        );
                    })}
                </Flex>
                <Box
                    backgroundColor="purple"
                >
                    <Flex>
                        <Box
                            backgroundColor="beige"
                        >
                            {currentAnswer.point_value}
                        </Box>
                        <Box
                            backgroundColor="beige"
                        >
                            {totalScore}
                        </Box>
                    </Flex>
                </Box>
                <Button
                    onClick={() => {
                        if(totalScore < 0) {
                            // TODO: add error messages
                            return;
                        }
                        queryServer('review', {
                            answer_list: Object.keys(review).filter((val) => val !== 'setup').map((answerID) => ({
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