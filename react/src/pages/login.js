import React, { useState } from "react";
import { Page } from "../components/page.js";
import { Input } from "../components/input.js";
import { Flex } from "../components/flex.js";
import { Button } from "../components/button.js";
import axios from "axios";
import https from "https";

export const LoginPage = (props) => {
	const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");
    return (
		<Page {...props}>
			<Flex flexDirection="column">
				<h1>Login</h1>
				<div>Username</div>
				<Input defaultValue="Enter username" onChange={setUsername} />
				<div>Password</div>
				<Input defaultValue="Enter password" onChange={setPassword} />
				<Button onClick={() => {
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
								// TODO: Switch to user page
								break;
							case 'admin':
								// TODO: Switch to admin page
								break;
							default:
								// TODO: Update web page to signify failed login
						}
					});
				}}>
					Log In
				</Button>
			</Flex>
		</Page>
	);
}
