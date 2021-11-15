import serverURL from "./serverinfo";
import axios from "axios";
import https from "https";

/**
 * 
 * @param {Object} props The props Object passed to functional React components
 * @param {Array} validProps Array of properties that will be copied over from props (if they exist) to the styles Object
 * @returns 
 */
export const parseProps = (props, validProps) => {
    let style = {};
    for(const prop in props) {
        if(validProps.includes(prop)) {
            style[prop] = props[prop];
        }
    }
    return style;
};

export const objIsEmpty = (obj) => {
    return obj && Object.keys(obj).length === 0;
};

export const queryServer = (useCase, data, successCallback, errorCallback) => {
    const postData = {
        use: useCase,
        ...data,
    };

    axios.post(serverURL, postData, {
		headers: {
			'Content-Type': 'application/json',
		},
		timeout: 1000,
		withCredentials: true,
		httpsAgent: new https.Agent({ keepAlive: true }),
	}).then((res) => {
        if(successCallback)
            return successCallback(res);
    }, (error) => {
        if(errorCallback)
            return errorCallback(error);
    });
};