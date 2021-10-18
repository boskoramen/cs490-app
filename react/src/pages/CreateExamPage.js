import React, { useState } from "react";
import UserPage from "./UserPage";
import { Input } from "../components/Input";
import { queryServer } from "../util/helpers";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import cookie from "react-cookies";

const CreateQuestionPage = (props) => {
    const [ examName, setExamName ] = useState('');
    const [ questionPool, setQuestionPool ] = useState([]);
    const [ questions, setQuestions ] = useState([]);
    const [ addingQuestion, setAddingQuestion ] = useState(false);
    const [ examID, setExamID ] = useState('');

    const populateQuestionPool = (res) => {
        // Figure out format for response before populating questionPool
    }

    const handleSubmitExam = (res) => {
        if(!res.data) {
            // TODO: add error messages
            return;
        }
        // Confirm contents of res.data
        setExamID(res.data);
        for(let question in questions) {
            queryServer('add_question_exam', {
                question_id: question.id,
                exam_id: examID,
                point_value: question.point_value
            });
        }
    }

    queryServer('get_question', {}, populateQuestionPool);

    return (
        <UserPage pageTitle="Create an Exam" {...props}>
            <Flex flexDirection="column">
                <div>
                    Exam Name:
                </div>
                <Input
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
                    // TODO: Populate select element with questions from question pool (need to figure out data structure)
                    <Flex>
                        <div>
                            Question type:
                        </div>
                        <select/>
                        <div>
                            Point value:
                        </div>
                        <Input />
                        <Button>
                            Submit
                        </Button>
                    </Flex>
                }
                {questions.map((question) => {
                    return (
                        <Box>
                            <div>
                                {question.formattedName}
                            </div>
                            <div>
                                {question.pointValue}
                            </div>
                        </Box>
                    );
                })}
                <Button
                    onClick={() => {
                        if(!examID) {
                            const userID = cookie.load('userID');
                            queryServer('exam', {
                                name: examName,
                                id: userID,
                            }, handleSubmitExam);
                        } else {
                            
                        }
                    }}
                >
                    Submit
                </Button>
            </Flex>
        </UserPage>
    );
};

export default CreateQuestionPage;