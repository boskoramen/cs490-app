import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { constraint_description } from "../util/constants";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import { Redirect } from "react-router-dom";
import MasterContext from "../reducer/context";
import AceEditor from "react-ace";
import { Button } from "../components/Button";
import { correctGreen, wrongRed } from "../util/colors";
import { formatNumber, addClassNames } from "../util/helpers";
import "ace-builds/src-noconflict/mode-python";
import styles from "../styles/main.scss";
const { roundButton, roundButtonBody, infoBox } = styles;

const TestResultsPage = (props) => {
    const { state } = useContext(MasterContext);
    const { gradeTest } = state;
    const {
        test_answer_data, test_id
    } = gradeTest;
    const [ localState, setLocalState ] = useState({
        success: false,
        currentAnswerIdx: 0,
    });
    const {
        success, currentAnswerIdx
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const currentAnswer = test_answer_data[currentAnswerIdx];
    const { test_case_data, constraint_data } = currentAnswer;

    let totalScore = 0;
    for(let answer of test_answer_data) {
        for(let constraint of answer.constraint_data) {
            totalScore += constraint.score;
        }
        for(let testCase of answer.test_case_data) {
            totalScore += testCase.score;
        }
    }

    let totalPossibleScore = 0;
    let currentScore = 0;
    for(let answer of test_answer_data) {
        totalPossibleScore += answer.point_value;
    }
    for(let obj of [
        ...test_case_data,
        ...constraint_data,
    ]) {
        currentScore += obj.score;
    }

    return (
        !success ?
        <UserPage pageTitle="View Exam Results" {...props}>
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
                    <Box>
                        Review:
                    </Box>
                    <Box>
                        {currentAnswer.review}
                    </Box>
                    <Button
                        onClick={() => {
                            setLocalState({
                                ...localState,
                                success: true,
                            });
                        }}
                    >
                        Finish
                    </Button>
                </Flex>
                <Flex
                    flexDirection="column"
                >
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th colSpan={2}>Information</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {constraint_data.map((constraint, idx) => {
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
                                        <td colSpan={2}>
                                            {constraint_description[constraint.name]}
                                        </td>
                                        <td>
                                            {constraint.score}
                                        </td>
                                    </tr>
                                );
                            })}
                            {test_case_data.map((testCase, idx) => {
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
                                        <td colSpan={2}>
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

export default TestResultsPage;