import React from "react";
import { Page } from "../components/page.js";
import { Input } from "../components/input.js";
import { Flex } from "../components/flex.js";

export const LoginPage = (props) => {
    return (
		<Page {...props}>
			<Flex>
				<div>Dog</div>
				<div>Cat</div>
			</Flex>
		</Page>
	);
}
