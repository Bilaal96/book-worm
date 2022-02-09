import { useReducer, useCallback, useMemo } from "react";

// Default value for 'initialState' arg passed to useReducer
// NOTE: Can be overridden if additional properties are required
const DEFAULT_STATE = {
    value: null,
    loading: false,
    error: null,
};

/** 
 * --- useAsyncReducer ---
 
 * A reducer that handles populating state for asynchronous tasks 
 * e.g. fetch requests / any promise-based task
 * Useful when you need to MANUALLY set the loading state
 
 * @param { String } actionTypePrefix - prefix to the name of action.type properties.
 * Passed as argument to createAsyncReducer function (see below).
 
 * @param { Func } [createAsyncReducer] - returns an async reducer function.
 * The returned reducer is passed as first argument to useReducer.
 * Defaults to createDefaultAsyncReducer.
 
 * @param { Object } [initialState] - object containing state-values to be handled asynchronously
 * Passed as second argument to useReducer.
 * Defaults to DEFAULT_STATE (see definition above).
 
 * @returns asyncReducer - an Array with 2 elements.
 * @property { Object } index0 - state updated throughout the async process.
 * @namespace { Object } index1 - namespace for action-dispatch functions used to update state asynchronously.
 * @method start - initialises loading state
 * @method success - sets value property when task completes successfully. Ends loading state.
 * @method failed - sets error property when task fails to complete. Ends loading state.
 * @method native - the default action-dispatch function returned by useReducer.
 * If custom initialState arg is provided, use dispatch.native() to dispatch custom-actions & update custom-state. 
 
 * --- Passing Custom State ---

 * If additional state values are required, pass custom arguments for createAsyncReducer & initialState.
 * Model your custom reducer function after createAsyncReducer. 
 * Custom actions in your reducer can be dispatched using dispatch.native().
 */
export default function useAsyncReducer(
    actionTypePrefix,
    createAsyncReducer = createDefaultAsyncReducer,
    initialState = DEFAULT_STATE
) {
    const asyncReducer = createAsyncReducer(actionTypePrefix);
    const [state, dispatch] = useReducer(asyncReducer, initialState);

    const dispatchStart = useCallback(
        () => dispatch({ type: `${actionTypePrefix}_START` }),
        [dispatch, actionTypePrefix]
    );

    // NOTE: Success and Failed dispatch functions require a payload as argument
    const dispatchSuccess = useCallback(
        (payload) => dispatch({ type: `${actionTypePrefix}_SUCCESS`, payload }),
        [dispatch, actionTypePrefix]
    );

    const dispatchFailed = useCallback(
        (payload) => dispatch({ type: `${actionTypePrefix}_FAILED`, payload }),
        [dispatch, actionTypePrefix]
    );

    // IMPORTANT: Prevents value of dispatch functions from changing on every render
    const customDispatch = useMemo(
        () => ({
            start: dispatchStart,
            success: dispatchSuccess,
            failed: dispatchFailed,
            // original dispatch function returned by useReducer
            native: dispatch,
        }),
        [dispatchStart, dispatchSuccess, dispatchFailed]
    );

    return [state, customDispatch];
}

// returns a reducer that handles async processes (including loading state)
function createDefaultAsyncReducer(actionTypePrefix) {
    return function defaultAsyncReducer(state, action) {
        switch (action.type) {
            case `${actionTypePrefix}_START`:
                console.log(`ACTION DISPATCHED: ${actionTypePrefix}_START`);
                return {
                    ...state,
                    loading: true,
                    error: null,
                };
            case `${actionTypePrefix}_SUCCESS`:
                console.log(`ACTION DISPATCHED: ${actionTypePrefix}_SUCCESS`);
                return {
                    ...state,
                    value: action.payload,
                    loading: false,
                };
            case `${actionTypePrefix}_FAILED`:
                console.log(`ACTION DISPATCHED: ${actionTypePrefix}_FAILED`);
                return {
                    ...state,
                    error: action.payload,
                    loading: false,
                };
            default:
                return state;
        }
    };
}
