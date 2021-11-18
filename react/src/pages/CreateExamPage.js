import React, { useState, useContext, createContext } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import Select from "react-select";
import { Redirect } from "react-router-dom";

const context = createContext(null);

const LeftPanel = () => {
    const {
        setLocalState,
        localState,
        handleSubmitExam,
        userID,
        sesID
    } = useContext(context);
    const {
        examName, questions,
    } = localState;

    return (
        <Flex
            width="30%"
            flexDirection="column"
        >
            <div>
                Exam Name:
            </div>
            <Input
                value={examName}
                onChange={(value) => {
                    setLocalState({
                        ...localState,
                        examName: value,
                    });
                }}
            />
            <div>
                Questions:
            </div>
            {questions.map((question) => {
                return (
                    <Box key={question.formattedName}>
                        <div>
                            Name: {question.formattedName}
                        </div>
                        <div>
                            Value: {question.pointValue}
                        </div>
                    </Box>
                );
            })}
            <Button
                onClick={() => {
                    if(!questions.length || !examName) {
                        return;
                    }
                    queryServer('exam', {
                        name: examName,
                        question_list: questions.map((question) => ({
                            question_id: question.id,
                            point_value: question.pointValue,
                        })),
                        id: userID,
                        sesID: sesID,
                    }, handleSubmitExam);
                }}
            >
                Submit
            </Button>
        </Flex>
    )
};

const RightPanel = () => {
    const {
        localState,
        setLocalState,
    } = useContext(context);

    const {
        difficultyPool, difficultySelection,
        topicPool, topicSelection,
        questionPool, filteredQuestionPool,
        questions, newQuestionValue
    } = localState;

    return (
        <Flex
            width="70%"
            backgroundColor="brown"
        >
            <Flex
                flexDirection="column"
            >
                <Box>
                    Difficulty:
                </Box>
                <Select
                    value={difficultySelection}
                    onChange={(value) => {
                        setLocalState({
                            ...localState,
                            difficultySelection: value
                        });
                    }}
                    options={
                        difficultyPool?.map((entry) => ({value: entry, label: entry}))
                    }
                />
                <Box>
                    Topic:
                </Box>
                <Select
                    value={topicSelection}
                    onChange={(value) => {
                        setLocalState({
                            ...localState,
                            topicSelection: value
                        });
                    }}
                    options={
                        topicPool?.map((entry) => ({value: entry, label: entry}))
                    }
                />
                <Flex>
                    <Button
                        onClick={() => {
                            const filtered = questionPool
                                .filter((question) => {
                                    for(const questionObj of questions) {
                                        if(questionObj.id == question.question_id) {
                                            return false;
                                        }
                                    }
                                    if(difficultySelection && question.difficulty != difficultySelection.value) {
                                        return false;
                                    } else if(topicSelection && question.topic !== topicSelection.value) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((question) => ({...question, value: 0}));

                            setLocalState({
                                ...localState,
                                filteredQuestionPool: filtered
                            });
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            setLocalState({
                                ...localState,
                                difficultySelection: null,
                                topicSelection: null,
                                filteredQuestionPool: [],
                            })
                        }}
                    >
                        Clear
                    </Button>
                </Flex>
            </Flex>
            <Flex
                flexDirection="column"
            >
                {filteredQuestionPool.map((question) => {
                    return (
                        <Flex
                            flexDirection="column"
                            backgroundColor="beige"
                            width="-moz-fit-content"
                            height="-moz-fit-content"
                            style={{
                                margin: "5px",
                            }}
                            key={question.question_id}
                        >
                            <Box>
                                {`${question.function_name}(${question.function_parameters})`}
                            </Box>
                            <Box>
                                {question.name}
                            </Box>
                            <Flex>
                            <Input
                                value={question.value}
                                onChange={(val) => {
                                    const value = Number(val);
                                    if(isNaN(value)) {
                                        return;
                                    }
                                    const filtered = filteredQuestionPool.map((filteredQ) => {
                                        if(filteredQ.question_id != question.question_id) {
                                            return filteredQ;
                                        }

                                        return {
                                            ...filteredQ,
                                            value: value
                                        }
                                    });
                                    setLocalState({
                                        ...localState,
                                        filteredQuestionPool: filtered,
                                    });
                                }}
                            />
                            <Button
                                onClick={() => {
                                    if(!question.value) {
                                        // Add error messages
                                        console.log("invalid question");
                                        return;
                                    }
                                    const filtered = filteredQuestionPool
                                        .filter(filteredQ => filteredQ.question_id != question.question_id)
                                        .map((filteredQ) => ({...filteredQ, value: 0}));
                                    setLocalState({
                                        ...localState,
                                        questions: [
                                            ...questions,
                                            {
                                                id: question.question_id,
                                                formattedName: question.function_name,
                                                pointValue: question.value,
                                            }
                                        ],
                                        filteredQuestionPool: filtered
                                    });
                                }}
                            >
                                Add
                            </Button>
                            </Flex>
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};

const CreateExamPage = (props) => {
    const [ localState, setLocalState ] = useState({
        examName: '',
        questionPool: null,
        filteredQuestionPool: [],
        difficultyPool: null,
        difficultySelection: null,
        topicPool: null,
        topicSelection: null,
        questions: [],
        success: false,
    });
    const {
        examName, questionPool, questions,
        success
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateQuestionPool = (res) => {
        if(!res.data) {
            // Add error messages
            return;
        }
        const newQuestionPool = res.data;
        let difficultySet = new Set();
        let topicSet = new Set();
        for(const question of newQuestionPool) {
            difficultySet.add(question.difficulty);
            topicSet.add(question.topic);
        }
        setLocalState({
            ...localState,
            questionPool: res.data,
            difficultyPool: [...difficultySet],
            topicPool: [...topicSet],
        });
    }

    const handleSubmitExam = (res) => {
        if(!res.data) {
            // TODO: add error messages
            return;
        } else if(res.data == 'bad attempt') {
            // TODO: add error messages
            return;
        }
        setLocalState({
            ...localState,
            success: true
        });
    }

    if(!questionPool) {
        queryServer('get_question', {
            instructor_id: userID,
            id: userID,
            sesID: sesID,
        }, populateQuestionPool);
    }

    return (
        !success ?
        <UserPage pageTitle="Create an Exam" {...props}>
            <context.Provider
                value={{
                    localState,
                    setLocalState,
                    handleSubmitExam,
                    userID,
                    sesID,
                }}
            >
                <Flex>
                    <LeftPanel />
                    <RightPanel />
                </Flex>
            </context.Provider>
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default CreateExamPage;