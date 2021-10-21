import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Redirect } from "react-router-dom";
import { queryServer } from "../util/helpers";
import cookie from "react-cookies";
import { Button } from "../components/Button";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants";

const TestPickerPage = (props) => {
    const { state, dispatch } = useContext(MasterContext);
    const [ testPool, setTestPool ] = useState(null);
    const [ studentPool, setStudentPool ] = useState(null);
    const [ testID, setTestID ] = useState(null);

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

    let studentTestList = [];

    const populateTestPool = (res) => {
        if(!res.data) {
            // Add error handling
            return;
        }
        setTestPool(res.data);
    }

    if(!testPool) {
        queryServer('get_test', {
            id: userID,
            sesID: sesID,
            exam_id: state.examID,
        }, populateTestPool);
    } else if(!studentPool) {
        queryServer('get_student', {
            id: userID,
            sesID: sesID,
        }, (res) => {setStudentPool(res.data);});
    } else {
        studentTestList = testPool.map((test) => {
            for(let i = 0; i < studentPool.length; i++) {
                const student = studentPool[i];
                if(student.id == test.student_id) {
                    return {
                        name: student.username,
                        test_id: test.test_id,
                    };
                }
            }
        })
    }

    // TODO: turn button into anchor
    return (
        testID === null ?
        <UserPage pageTitle="Pick an Exam">
            {studentTestList.map((entry) => {
                console.log(`entry: ${JSON.stringify(entry)}`);
                return (
                    <Button
                        onClick={()=>{
                            dispatch({type: actions.setTestID, value: entry.test_id});
                            setTestID(entry.test_id);
                        }}
                        key={entry.test_id}
                    >
                        {entry.name}
                    </Button>
                );
            })
            }
        </UserPage>
        : <Redirect to="/review_exam" />
    );
}

export default TestPickerPage;