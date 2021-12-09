import React, { useState, useContext, useMemo } from "react";
import UserPage from "./UserPage";
import { Textbox } from "../components/Textbox";
import { queryServer, deepCopy, addClassNames, formatNumber } from "../util/helpers";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";
import { constraint_description } from "../util/constants";
import { correctGreen, wrongRed } from "../util/colors";
import { useTable } from "react-table";

import "ace-builds/src-noconflict/mode-python";
import { Input } from "../components/Input";

import styles from "../styles/main.scss";

const { roundButton, roundButtonBody, infoBox, tableInput } = styles;

const Table = ({columns, data}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data});

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => {
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                            return <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        })}
                    </tr>
                })}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

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
        cached_change: 0,
    });
    const {
        success, currentAnswerIdx, review, cached_change,
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
                    test_case_data: deepCopy(test_case_data.map(test_case => ({
                        ...test_case,
                        changing: false
                    }))),
                    constraint_data: deepCopy(constraint_data.map(constraint => ({
                        ...constraint,
                        changing: false,
                    }))),
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
    const { test_case_data, constraint_data, test_answer_id } = currentAnswer;
    let totalScore = 0;
    let totalPossibleScore = 0;
    let currentScore = 0;
    if(review.setup) {
        for(let answer of test_answer_data) {
            totalPossibleScore += answer.point_value;
            for(let constraint of review[answer.test_answer_id].constraint_data) {
                totalScore += constraint.score;
            }
            for(let testCase of review[answer.test_answer_id].test_case_data) {
                totalScore += testCase.score;
            }
        }

        for(let obj of [
            ...review[test_answer_id].constraint_data,
            ...review[test_answer_id].test_case_data,
        ]) {
            currentScore += obj.score;
        }
    }

    return (
        !success ?
        <UserPage pageTitle="Review Exam" {...props}>
            <Flex>
                <Flex
                    flexDirection="column"
                    width="30%"
                >
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
                <Flex
                    flexDirection="column"
                >
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Information</th>
                                <th>{test.review ? 'Previous Points Applied' : 'Autograded Point Applied'}</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {constraint_data.map((constraint, idx) => {
                                if(!review.setup) {
                                    return;
                                }
                                const currentReview = review[currentAnswer.test_answer_id];
                                const reviewConstraint = currentReview.constraint_data[idx];
                                return (
                                    <tr
                                        key={constraint.id}
                                        style={{
                                            backgroundColor: constraint.correct ? correctGreen : wrongRed,
                                        }}
                                    >
                                        <td>
                                            Constraint
                                        </td>
                                        <td>
                                            {constraint_description[constraint.name]}
                                        </td>
                                        <td>
                                            {constraint.score}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={reviewConstraint.changing ? cached_change : reviewConstraint.score}
                                                classNames={addClassNames(tableInput)}
                                                onChange={(val) => {
                                                    if(reviewConstraint.changing) {
                                                        setLocalState({
                                                            ...localState,
                                                            cached_change: val,
                                                        });
                                                    } else {
                                                        val = Number(val);
                                                        if(val === NaN) {
                                                            val = 0;
                                                        }
                                                        reviewConstraint.score = val;
                                                        console.log(`val: ${val}`);
                                                        setLocalState({
                                                            ...localState,
                                                            review: {
                                                                ...review,
                                                                [currentAnswer.test_answer_id]: {
                                                                    ...currentReview
                                                                },
                                                            }
                                                        });
                                                    }
                                                }}
                                                onFocus={() => {
                                                    reviewConstraint.changing = true;
                                                    setLocalState({
                                                        ...localState,
                                                        cached_change: reviewConstraint.score,
                                                        review: {
                                                            ...review,
                                                            [currentAnswer.test_answer_id]: {
                                                                ...currentReview
                                                            },
                                                        }
                                                    });
                                                }}
                                                onBlur={() => {
                                                    let val = Number(cached_change);
                                                    if(val === NaN) {
                                                        val = 0;
                                                    }
                                                    reviewConstraint.changing = false;
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
                                        </td>
                                    </tr>
                                );
                            })}
                            {test_case_data.map((testCase, idx) => {
                                if(!review.setup) {
                                    return;
                                }
                                const currentReview = review[currentAnswer.test_answer_id];
                                const reviewTestCase = currentReview.test_case_data[idx];
                                return (
                                    <tr
                                        key={testCase.id}
                                        style={{
                                            backgroundColor: testCase.correct ? correctGreen : wrongRed,
                                        }}
                                    >
                                        <td>
                                            Test Case
                                        </td>
                                        <td>
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
                                        </td>
                                        <td>
                                            {testCase.score}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={reviewTestCase.changing ? cached_change : reviewTestCase.score}
                                                classNames={addClassNames(tableInput)}
                                                onChange={(val) => {
                                                    if(reviewTestCase.changing) {
                                                        setLocalState({
                                                            ...localState,
                                                            cached_change: val
                                                        });
                                                    } else {
                                                        val = Number(val);
                                                        if(val === NaN) {
                                                            val = 0;
                                                        }
                                                        reviewTestCase.score = val;
                                                        setLocalState({
                                                            ...localState,
                                                            review: {
                                                                ...review,
                                                                [currentAnswer.test_answer_id]: {
                                                                    ...currentReview
                                                                },
                                                            }
                                                        });
                                                    }
                                                }}
                                                onFocus={() => {
                                                    reviewTestCase.changing = true;
                                                    setLocalState({
                                                        ...localState,
                                                        cached_change: reviewTestCase.score,
                                                        review: {
                                                            ...review,
                                                            [currentAnswer.test_answer_id]: {
                                                                ...currentReview
                                                            },
                                                        }
                                                    });
                                                }}
                                                onBlur={() => {
                                                    let val = Number(cached_change);
                                                    if(val === NaN) {
                                                        val = 0;
                                                    }
                                                    reviewTestCase.changing = false;
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
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    Total
                                </td>
                                <td>
                                    {formatNumber(currentScore)}
                                </td>
                            </tr>
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    Question Value
                                </td>
                                <td>
                                    {currentAnswer.point_value}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <Box
                        classNames={addClassNames(infoBox)}
                    >
                        <Flex
                            flexDirection="column"
                        >
                            <Box>
                                Total Score
                            </Box>
                            <Box
                                backgroundColor="beige"
                            >
                                {formatNumber(totalScore)}/{formatNumber(totalPossibleScore)} ({formatNumber(totalScore/totalPossibleScore*100)}%)
                            </Box>
                        </Flex>
                    </Box>
                </Flex>
            </Flex>
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default ReviewTestPage;