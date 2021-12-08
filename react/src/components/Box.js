import React from 'react';
import { parseProps } from '../util/helpers'
import { pickHTMLProps } from 'react-sanitize-dom-props';
import { boxProps } from '../util/constants';
// TODO: implement classNames per https://stackoverflow.com/questions/38382153/multiple-classnames-with-css-modules-and-react
import classNames from 'classnames';

export const Box = (props) => {
    return (
        <div
            {...pickHTMLProps(props)}
            style={{
                ...props.style,
                ...parseProps(props, boxProps),
            }}
            className={classNames(props.classNames)}
        />
    );
}