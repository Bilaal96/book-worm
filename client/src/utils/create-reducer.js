/** 
 * --- createReducer ---
 
 * Easily create reducers that follow common patterns with reduced boilerplate.
 
 * @param { Object } initialState - initial values of reducer state
 * @param { Object } handlers 
 * handlers keys map to the dispatchable actions. 
 * handlers values map to methods called as a result of dispatching an action.
 * When an action is dispatched, handlers is used to look-up the specific method (with a matching action.type) that will responds with the appropriate state change(s).
 
 * @returns reducer function 
  
 * RESOURCES:

 * https://www.freecodecamp.org/news/did-you-know-createreducer-works-with-react-hooks-heres-how-b324c558e12f/
 * https://redux.js.org/usage/reducing-boilerplate#generating-reducers
 * https://www.reddit.com/r/reactjs/comments/bx79dz/reducer_factory_for_usereducer/
 * https://codepen.io/grumlen/pen/YbbwZK?editors=1112
 */
export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            console.log(`----- ${action.type} -----`);
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    };
}

// Default state for an asyncReducer
export const ASYNC_STATE = {
    loading: false,
    value: null,
    error: null,
};

/** 
 * --- createAsyncReducer ---
 
 * Creates a reducer function with loading, value & error states (at minimum) and handlers to update the state when the appropriate action is dispatched. 
 * Additional state & handlers may be passed as arguments
 
 * @param { String } actionTypePrefix - prepended to the name of state handler functions; thus creating uniquely named actionTypes
 * @param { Object } [ customState ] - define additional state
 * @param { Object } [ customHandlers ] - define handlers to update the additional state
 
 * @returns Tuple containing arguments for useAsyncReducer / useReducer. 

 * NOTE: useAsyncReducer provides an easy interface to dispatch actions and update ASYNC_STATE.
 */
export function createAsyncReducer(
    actionTypePrefix,
    customState = {},
    customHandlers = {}
) {
    const initialState = { ...ASYNC_STATE, ...customState };

    const handlers = {
        [`${actionTypePrefix}_LOAD`]: (state) => ({
            ...state,
            loading: true,
            error: null,
        }),
        [`${actionTypePrefix}_SUCCESS`]: (state, action) => ({
            ...state,
            loading: false,
            value: action.payload,
            error: null,
        }),
        [`${actionTypePrefix}_FAILED`]: (state, action) => ({
            ...state,
            loading: false,
            value: undefined,
            error: action.payload,
        }),
        ...customHandlers,
    };

    console.log("createAsyncReducer:", initialState);
    const asyncReducer = createReducer(initialState, handlers);
    return [asyncReducer, initialState];
}

export default createReducer;
