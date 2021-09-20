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
}