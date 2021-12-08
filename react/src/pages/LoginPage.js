import React, { useState, useContext } from "react";
import { Box } from "../components/Box";
import { Input } from "../components/Input";
import { Flex } from "../components/Flex";
import { Button } from "../components/Button";
import MasterContext from "../reducer/context";
import { actions } from "../reducer/constants.js";
import CodingPracticePage from "./CodingPracticePage";
import cookie from "react-cookies";
import { queryServer } from "../util/helpers";

const LoginPage = (props) => {
	const { dispatch } = useContext(MasterContext);
	const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	const handleLogin = (res) => {
		if(res.status > 400) {
			setErrorMessage("Unable to communicate with server!");
			console.log(`Error: Bad response: ${res.status} ${res.statusText}`);
		} else if(res.status != 200) {
			return;
		}
		const [ result, sesID, userID ] = res.data.split(";");
		if(sesID && userID) {
			cookie.save('sesID', sesID);
			cookie.save('userID', userID);
		}
		switch(result) {
			case 'student':
			case 'instructor':
				dispatch({type: actions.setLoggedIn, value: true, userType: result});
				break;
			default:
				setErrorMessage("Invalid username and password credentials passed!");
		}
	};

	const handleError = (error) => {
		if(error.request) {
			setErrorMessage("Unable to communicate with server!");
			console.log(`Error: ${error.message}\n${error.stack}`);
		}
	};

    return (
		<CodingPracticePage {...props} pageTitle="Login">
			<Flex flexDirection="column" width={300}>
				{errorMessage &&
				<Box
					padding={20}
					borderStyle="solid"
					borderWidth="2px"
					borderColor="red"
					color="red"
					fontStyle="italic"
				>
					{errorMessage}
				</Box>
				}
				<div>Username</div>
				<Input
					defaultValue="Enter username"
					value={username}
					onChange={setUsername}
				/>
				<div>Password</div>
				<Input
					isPassword={true}
					defaultValue="Enter password"
					value={password}
					onChange={setPassword}
				/>
				<Button
					onClick={() => {
						queryServer('login', {
							name: username,
							pass: password
						}, handleLogin, handleError);
					}}
				>
					Log In
				</Button>
			</Flex>
		</CodingPracticePage>
	);
}

export default LoginPage;
