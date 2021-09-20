import React from "react";

export const Button = (props) => {
    return (
        <button 
            {...props}
            onClick={() => {
                const onClick = props.onClick;
                if(onClick) {
                    onClick();
                }
            }}
        />
    );
}