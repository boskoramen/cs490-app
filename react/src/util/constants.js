export const constraint_description = {
    name: 'The function name must match the one specified in the prompt',
    for: 'A for-loop must be used in the code',
    if: 'An if-statement must be used in the code',
    while: 'A while-loop must be used in the code',
    recursion: 'Recursion must be used in the code'
}

export const boxProps = [
    "backgroundColor",
    "height",
    "width",
    "padding",
    "borderStyle",
    "borderWidth",
    "borderColor",
    "fontStyle",
    "fontWeight",
    "color",
    "whiteSpace",
    "overflow",
    "overflowX",
    "overflowY",
    "maxHeight",
    "maxWidth",
    "minHeight",
    "minWidth",
    "resize",
];

export const flexProps = [
    ...boxProps,
    "flexDirection",
    "flexWrap",
    "flexGrow",
    "flexShrink",
    "justifyContent",
    "alignItems",
];