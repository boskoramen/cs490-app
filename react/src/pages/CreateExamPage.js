import React, { useState } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Box } from "../components/Box";
import cookie from "react-cookies";
import Select from "react-select";
import { Redirect } from "react-router-dom";

const CreateExamPage = (props) => {
    const [ examName, setExamName ] = useState('');
    const [ questionPool, setQuestionPool ] = useState(null);
    const [ questions, setQuestions ] = useState([]);
    const [ addingQuestion, setAddingQuestion ] = useState(false);
    // TODO: Make sure there are no duplicates for a question type in questions
    const [ newQuestionType, setNewQuestionType ] = useState(null);
    const [ newQuestionValue, setNewQuestionValue ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    const populateQuestionPool = (res) => {
        if(!res.data) {
            // Add error messages
            return;
        }
        setQuestionPool(res.data);
    }

    const handleSubmitExam = (res) => {
        if(!res.data) {
            // TODO: add error messages
            return;
        } else if(res.data == 'bad attempt') {
            // TODO: add error messages
            return;
        }
        setSuccess(true);
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
            <Flex flexDirection="column">
                <div>
                    Exam Name:
                </div>
                <Input
                    value={examName}
                    onChange={setExamName}
                />
                <div>
                    Questions:
                </div>
                <Button
                    onClick={() => {
                        setAddingQuestion(!addingQuestion);
                    }}
                >
                    Add Question
                </Button>
                {!addingQuestion ? null :
                    <Flex flexDirection="column">
                        <div>
                            Question type:
                        </div>
                        <Select
                            value={newQuestionType}
                            onChange={setNewQuestionType}
                            options={
                                questionPool.map((question) => ({value: question, label: question.function_name}))
                            }
                        />
                        <div>
                            Point value:
                        </div>
                        <Input
                            value={newQuestionValue}
                            onChange={(value) => {setNewQuestionValue(Number(value));}}
                        />
                        <Button
                            onClick={() => {
                                if(newQuestionType === null || newQuestionValue === null) {
                                    // Add error messages
                                    console.log("invalid question");
                                    return;
                                }
                                const question = newQuestionType.value;
                                setAddingQuestion(false);
                                setQuestions([
                                    ...questions,
                                    {
                                        id: question.question_id,
                                        formattedName: question.function_name,
                                        pointValue: newQuestionValue,
                                    }
                                ]);
                                setNewQuestionType(null);
                                setNewQuestionValue(null);
                            }}
                        >
                            Submit
                        </Button>
                    </Flex>
                }
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
        </UserPage>
        : <Redirect to="/"/>
    );
};

export default CreateExamPage;