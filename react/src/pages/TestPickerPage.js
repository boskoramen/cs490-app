import React, { useState, useContext } from "react";
import UserPage from "./UserPage";
import { Redirect } from "react-router-dom";
import { queryServer } from "../util/helpers";
import cookie from "react-cookies";
import { Button } from "../components/Button";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants";
import styles from "../styles/main.scss";

const { roundButton } = styles;

const TestPickerPage = (props) => {
    const { state, dispatch } = useContext(MasterContext);
    const [ testPool, setTestPool ] = useState(null);
    const [ testID, setTestID ] = useState(null);

    const userID = cookie.load('userID');
    const sesID = cookie.load('sesID');

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
    }

    // TODO: turn button into anchor
    return (
        testID === null ?
        <UserPage pageTitle="Pick an Exam">
            {testPool && testPool.map((entry) => {
                return (
                    <Button
                        className={roundButton}
                        onClick={()=>{
                            dispatch({type: actions.reviewTest, value: entry});
                            setTestID(entry.test_id);
                        }}
                        key={entry.test_id}
                    >
                        {entry.username}
                    </Button>
                );
            })
            }
        </UserPage>
        : <Redirect to="/review_exam" />
    );
}

export default TestPickerPage;