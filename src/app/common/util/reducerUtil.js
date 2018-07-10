export const createReducer = (initialState, fnMap) => {
    return (state = initialState, {type, paylod}) => {
        const handler = fnMap[type];
        return handler ? handler(state, paylod) : state
    }
};