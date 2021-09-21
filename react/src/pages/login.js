import React, { useState, useContext } from "react";
import { Box } from "../components/box";
import { Page } from "../components/page";
import { Input } from "../components/input";
import { Flex } from "../components/flex";
import { Button } from "../components/button";
import axios from "axios";
import https from "https";
import MasterContext from "../reducer/context";
import { actions, pages } from "../reducer/constants.js";

export const LoginPage = (props) => {
	const dispatch = useContext(MasterContext);
	const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");
    return (
		<Page {...props}>
			<Flex flexDirection="column" width={300}>
				<h1>Login</h1>
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
				<Input defaultValue="Enter username" onChange={setUsername} />
				<div>Password</div>
				<Input defaultValue="Enter password" onChange={setPassword} />
				<Button 
					onClick={() => {
						const postData = {
							'name': username,
							'pass': password,
						};
						const addr = '52.7.114.65';
						const port = 9000;
						const url = `${addr}:${port}`;
						axios.post(url, postData, {
							headers: {
								'Content-Type': 'application/json',
							},
							timeout: 1000,
							httpsAgent: new https.Agent({ keepAlive: true }),
						}).then((res) => {
							if(res.status != 200) {
								return;
							}
							
							switch(res.data) {
								case 'user':
									dispatch({type: actions.change_page, value: pages.user})
									break;
								case 'admin':
									dispatch({type: actions.change_page, value: pages.admin})
									break;
								default:
									setErrorMessage("Invalid username and password credentials passed!");
							}
						});
					}}
					width={150}
				>
					Log In
				</Button>
			</Flex>
		</Page>
	);
}
