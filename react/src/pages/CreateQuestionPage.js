import React, { useState, useContext, createContext } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { Checkbox } from "../components/Checkbox";
import { Textbox } from "../components/Textbox";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import cookie from "react-cookies";
import styles from "../styles/main.scss";

const { testCaseBox, funcParamBox, subBox } = styles;

// TODO: Add regex safety check for function name being present in the prompt
// TODO: Allow question header to automatically be added(?)

const context = createContext(null);

const FuncParamBox = (props) => {
    return (
        <Box
            className={funcParamBox}
        >
            <Flex
                direction="column"
            >
                <Flex>
                    <Box>
                        Type:
                    </Box>
                    {props.type}
                </Flex>
                <Flex>
                    <Box>
                        Name:
                    </Box>
                    {props.name}
                </Flex>
            </Flex>
        </Box>
    )
}

const TestCaseBox = (props) => {
    return (
        <Box
            className={testCaseBox}
        >
            <Flex
                direction="column"
            >
                <Flex>
                    <Box>
                        Input:
                    </Box>
                    {props.input}
                </Flex>
                <Flex>
                    <Box>
                        Output:
                    </Box>
                    {props.output}
                </Flex>
            </Flex>
        </Box>
    )
}

const LeftPanel = () => {
    const {
        localState,
        setLocalState,
        handleSubmitQuestion
    } = useContext(context);
    const {
        prompt, funcName, funcParams, funcParamType, funcParamName,
        difficulty, topic, testCases, inputCase, outputCase,
        questionID, errorMessage, constraints
    } = localState;

    return (
        <Flex
            width="70%"
            flexDirection="column"
        >
            {errorMessage &&
                <Box
                    padding={20}
                    borderStyle="solid"
                    borderWidth="2px"
                    borderColor="red"
                    color="red"
                    fontStyle="italic"
                    width="90%"
                >
                    {errorMessage}
                </Box>
            }
            <Box>
                Question Prompt:
            </Box>
            <Textbox
                value={prompt}
                onChange={(value) => {
                    setLocalState({
                        ...localState,
                        prompt: value
                    });
                }}
            />
            <Box>
                Topic:
            </Box>
            <Select
                value={topic}
                onChange={(value) => {
                    setLocalState({
                        ...localState,
                        topic: value
                    });
                }}
                options={
                    ['For', 'While', 'Recursion', 'If'].map((entry) => ({value: entry, label: entry}))
                }
            />
            <Box>
                Difficulty:
            </Box>
            <Select
                value={difficulty}
                onChange={(value) => {
                    setLocalState({
                        ...localState,
                        difficulty: value
                    });
                }}
                options={
                    ['Easy', 'Medium', 'Hard'].map((entry) => ({value: entry, label: entry}))
                }
            />
            <Box>
                Function Name:
            </Box>
            <Input
                value={funcName}
                onChange={(value) => {
                    setLocalState({
                        ...localState,
                        funcName: value
                    });
                }}
            />
            <Box>
                Function Params:
            </Box>
            {funcParams.map((funcParam) => (
                <FuncParamBox
                    key={funcParam.name}
                    type={
                        <Box
                            className={subBox}
                        >
                            {funcParam.type}
                        </Box>
                    }
                    name={
                        <Box
                            className={subBox}
                        >
                            {funcParam.name}
                        </Box>
                    }
                />
            ))}
            <Flex>
                <Button
                    onClick={() => {
                        if(!funcParamType) {
                            setLocalState({
                                ...localState,
                                errorMessage: 'This parameter needs a type!'
                            });
                            return;
                        } else if(!funcParamName) {
                            setLocalState({
                                ...localState,
                                errorMessage: 'This parameter needs a name!'
                            });
                            return;
                        }
                        for(let idx in funcParams) {
                            if(funcParams[idx].name == funcParamName) {
                                setLocalState({
                                    ...localState,
                                    errorMessage: 'There is already a parameter with this name!'
                                });
                                return;
                            }
                        }
                        setLocalState({
                            ...localState,
                            funcParams: [
                                ...funcParams,
                                {
                                    type: funcParamType.value,
                                    name: funcParamName,
                                },
                            ],
                            funcParamType: null,
                            funcParamName: '',
                        });
                    }}
                >
                    Add
                </Button>
                <FuncParamBox
                    type={
                        <Select
                            value={funcParamType}
                            onChange={(value) => {
                                setLocalState({
                                    ...localState,
                                    funcParamType: value
                                });
                            }}
                            options={
                                ['str', 'int', 'float', 'list', 'dict', 'set'].map((entry) => ({value: entry, label: entry}))
                            }
                        />
                    }
                    name={
                        <Input
                            value={funcParamName}
                            onChange={(value) => {
                                setLocalState({
                                    ...localState,
                                    funcParamName: value
                                });
                            }}
                        />
                    }
                />
            </Flex>
            <Box>
                Test Cases:
            </Box>
            {testCases.map((testCase) => (
                <TestCaseBox
                    key={testCase.input}
                    input={
                        <Box
                            className={subBox}
                        >
                            {testCase.input}
                        </Box>
                    }
                    output={
                        <Box
                            className={subBox}
                        >
                            {testCase.output}
                        </Box>
                    }
                />
            ))}
            <Flex>
                <Button
                    onClick={() => {
                        if(!outputCase || !inputCase) {
                            setLocalState({
                                ...localState,
                                errorMessage: 'You need both an input and output!'
                            });
                            return;
                        }
                        for(let idx in testCases) {
                            if(testCases[idx].input == inputCase) {
                                setLocalState({
                                    ...localState,
                                    errorMessage: 'There is already a test case with this input!'
                                });
                                return;
                            }
                        }
                        setLocalState({
                            ...localState,
                            testCases: [
                                ...testCases,
                                {
                                    input: inputCase,
                                    output: outputCase,
                                },
                            ],
                            inputCase: '',
                            outputCase: '',
                        });
                    }}
                >
                    Add
                </Button>
                <TestCaseBox
                    input={
                        <Input
                            value={inputCase}
                            onChange={(value) => {
                                setLocalState({
                                    ...localState,
                                    inputCase: value
                                });
                            }}
                        />
                    }
                    output={
                        <Input
                            value={outputCase}
                            onChange={(value) => {
                                setLocalState({
                                    ...localState,
                                    outputCase: value
                                });
                            }}
                        />
                    }
                />
            </Flex>
            <Button
                onClick={() => {
                    if(questionID === null) {
                        setLocalState({
                            ...localState,
                            errorMessage: ''
                        });
                        const userID = cookie.load('userID');
                        const sesID = cookie.load('sesID');
                        const funcparm = funcParams.map((funcParam) => (`${funcParam.type} ${funcParam.name}`)).join(',');
                        let constraintList = [];
                        for(var constraint in constraints) {
                            if(constraints[constraint]) {
                                constraintList.push(constraint);
                            }
                        }
                        constraint = constraintList.join(',');
                        queryServer('question', {
                            name: prompt,
                            funcname: funcName,
                            funcparm,
                            difficulty: difficulty.value,
                            topic: topic.value,
                            constraint,
                            id: userID,
                            sesID: sesID,
                        }, handleSubmitQuestion);
                    }
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
        constraints
    } = localState;

    return (
        <Flex
            width="30%"
            flexDirection="column"
            backgroundColor="brown"
        >
            <Box>
                Constraints:
            </Box>
            <Flex
                width="300px"
            >
                {Object.keys(constraints).map((key) => {
                    return (
                        <Box
                            key={key}
                        >
                            <Flex
                                justifyContent="flex-start"
                            >
                                <Checkbox
                                    checked={constraints[key]}
                                    onClick={() => {
                                        setLocalState({
                                            ...localState,
                                            constraints: {
                                                ...constraints,
                                                [key]: !constraints[key]
                                            },
                                        });
                                    }}
                                />
                                <Box
                                    padding='0px'
                                >
                                    {key}
                                </Box>
                            </Flex>
                        </Box>
                    );
                })}
            </Flex>
        </Flex>
    );
};

const CreateQuestionPage = (props) => {
    const [ localState, setLocalState ] = useState({
        prompt: '',
        funcName: '',
        funcParams: [],
        // This is actually an Object for the Select component
        funcParamType: null,
        funcParamName: '',
        difficulty: '',
        // This is actually an Object for the Select component
        topic: null,
        testCases: [],
        inputCase: '',
        outputCase: '',
        questionID: null,
        errorMessage: '',
        success: false,
        constraints: {
            for: false,
            while: false,
            if: false,
        },
    });
    const {
        testCases, success
    } = localState;

    const handleAddTestCases = (res) => {
        // TODO: make sure this actually works
        if(res.data != testCases.length) {
            setLocalState({
                ...localState,
                errorMessage: 'Invalid test cases!'
            });
            return;
        }
        setLocalState({
            ...localState,
            success: true,
        });
    };

    const handleSubmitQuestion = (res) => {
        if(res.data == 'bad attempt') {
            setLocalState({
                ...localState,
                errorMessage: 'Invalid question!'
            });
            return;
        }
        const userID = cookie.load('userID');
        const sesID = cookie.load('sesID');
        const qID = res.data[0].question_id;
        setLocalState({
            ...localState,
            questionID: qID
        });
        queryServer('many_test_case', {
            test_case_list: testCases.map((testCase) => ({
                input: testCase.input,
                output: testCase.output,
                questionID: qID,
            })),
            id: userID,
            sesID: sesID,
        }, handleAddTestCases);
    };

    return (
        success ?
        <Redirect to="/"/>
        : <UserPage pageTitle="Create a Question" {...props}>
            <context.Provider
                value={{
                    localState,
                    setLocalState,
                    handleSubmitQuestion,
                }}
            >
                <Flex
                    width="100%"
                >
                    <LeftPanel />
                    <RightPanel />
                </Flex>
            </context.Provider>
          </UserPage>
    );
};

export default CreateQuestionPage;