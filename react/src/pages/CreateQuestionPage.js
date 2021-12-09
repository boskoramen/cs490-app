import React, { useState, useContext, createContext } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { Checkbox } from "../components/Checkbox";
import { Textbox } from "../components/Textbox";
import { queryServer, addClassNames } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import cookie from "react-cookies";
import styles from "../styles/main.scss";

const { testCaseBox, funcParamBox, subBox } = styles;
const context = createContext(null);

const FuncParamBox = (props) => {
    return (
        <Box
            classNames={addClassNames(funcParamBox)}
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
    );
}

const TestCaseBox = (props) => {
    return (
        <Box
            classNames={addClassNames(testCaseBox)}
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
            width="35%"
            overflowY="auto"
            overflowX="hidden"
            maxHeight="750px"
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
                Question Prompt
            </Box>
            <Textbox
                value={prompt}
                onChange={(value) => {
                    setLocalState({
                        ...localState,
                        prompt: value
                    });
                }}
                height='200px'
                width='600px'
            />
            <Box>
                Topic
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
                    ['For', 'While', 'Recursion', 'If', 'Math', 'Strings'].map((entry) => ({value: entry, label: entry}))
                }
            />
            <Box>
                Difficulty
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
                Function Name
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
                Function Params
            </Box>
            {funcParams.map((funcParam) => (
                <FuncParamBox
                    key={funcParam.name}
                    type={
                        <Box
                            classNames={addClassNames(subBox)}
                        >
                            {funcParam.type}
                        </Box>
                    }
                    name={
                        <Box
                            classNames={addClassNames(subBox)}
                        >
                            {funcParam.name}
                        </Box>
                    }
                />
            ))}
            <Flex>
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
            </Flex>
            <Box>
                Test Cases
            </Box>
            {testCases.map((testCase) => (
                <TestCaseBox
                    key={testCase.input}
                    input={
                        <Box
                            classNames={addClassNames(subBox)}
                        >
                            {testCase.input}
                        </Box>
                    }
                    output={
                        <Box
                            classNames={addClassNames(subBox)}
                        >
                            {testCase.output}
                        </Box>
                    }
                />
            ))}
            <Flex>
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
            </Flex>
            <Button
                onClick={() => {
                    if(questionID === null) {
                        setLocalState({
                            ...localState,
                            errorMessage: ''
                        });
                        const funcNameRegex = new RegExp(funcName);
                        if(!funcNameRegex.test(prompt)) {
                            setLocalState({
                                ...localState,
                                errorMessage: 'The function name is not present in the question prompt. Students will not know what function name to use.'
                            });
                            return;
                        }
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
                            name: prompt.replace('\n', '\\n'),
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
        constraints, difficultySelection, topicSelection,
        difficultyPool, topicPool, questionPool, filteredQuestionPool,
        search
    } = localState;

    return (
        <Flex
            width="65%"
            height="100%"
            flexDirection="column"
            backgroundColor="brown"
        >
            <Box>
                Constraints
            </Box>
            <Flex>
                <Flex
                    flexDirection="column"
                    width="300px"
                >
                    <Flex>
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
                    <Box>
                        Difficulty
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
                        Topic
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
                    <Box>
                        Search
                    </Box>
                    <Input
                        value={search}
                        onChange={(value) => {
                            setLocalState({
                                ...localState,
                                search: value,
                            });
                        }}
                    />
                    <Flex>
                        <Button
                            onClick={() => {
                                const filtered = questionPool
                                    .filter((question) => {
                                        if(difficultySelection && question.difficulty != difficultySelection.value) {
                                            return false;
                                        } else if(topicSelection && question.topic !== topicSelection.value) {
                                            return false;
                                        }
                                        if(!question.name.match(new RegExp(search))) {
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
                                    search: '',
                                })
                            }}
                        >
                            Clear
                        </Button>
                    </Flex>
                </Flex>
                <Flex
                    overflowY="auto"
                    overflowX="hidden"
                    maxHeight="750px"
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
                            </Flex>
                        );
                    })}
                </Flex>
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
        difficultyPool: [],
        difficultySelection: null,
        // This is actually an Object for the Select component
        topic: null,
        topicPool: [],
        topicSelection: null,
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
        search: '',
        questionPool: null,
        filteredQuestionPool: [],
    });
    const {
        testCases, success, questionPool
    } = localState;

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

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

    if(!questionPool) {
        queryServer('get_question', {
            instructor_id: userID,
            id: userID,
            sesID: sesID,
        }, populateQuestionPool);
    }

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
                    height="100%"
                >
                    <LeftPanel />
                    <RightPanel />
                </Flex>
            </context.Provider>
          </UserPage>
    );
};

export default CreateQuestionPage;