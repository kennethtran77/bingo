const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused? '1px solid black' : '1px solid darkgray',
        boxShadow: state.isFocused ? '0 0 0 1px black' : 0,
        '&:hover': {
            border: '1px solid black',
        }
    })
};

export default selectStyles;