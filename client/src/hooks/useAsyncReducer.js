import { useReducer, useCallback, useMemo } from "react";

// Default value for 'initialState' parameter passed to useAsyncReducer (see below)
// NOTE: Default values can be overridden using createAsyncReducer util function
import { ASYNC_STATE } from "utils/create-reducer";

/** 
 * --- useAsyncReducer ---
 
 * A custom hook that wraps useReducer.
 * It provides a neat interface for dispatching actions that update state for common asynchronous tasks.
 * Useful for MANUALLY setting loading state when retrieving a value that is not immediately available. For example, via fetch requests / any promise-based task.

 * Best used in conjunction with createAsyncReducer util function.
 
 * @param { String } actionTypePrefix - A prefix to the key of a type property within an action object used to update async state.
 * e.g. actionTypePrefix = FETCH_DATA -> resulting actions: FETCH_DATA_LOAD, FETCH_DATA_SUCCESS, FETCH_DATA_FAILED.
 
 * @param { Function } asyncReducer - Responsible for updating state when actions are dispatched.
 * Passed as first argument to useReducer.
 
 * @param { Object } [ initialState ] - Defines initial state of a reducer. 
 * Defaults to ASYNC_STATE if not passed as argument manually.
 * Passed as second argument to useReducer.

 * @return Tuple with 2 elements.
 * @property { Object } index0 - state updated throughout the async process.

 * @namespace { Object } index1 - action-dispatch functions used to update state asynchronously.
 * @method start - initialises loading state
 * @method success - sets value property when task completes successfully. Ends loading state.
 * @method failed - sets error property when task fails to complete. Ends loading state.
 * @method native - the default action-dispatch function returned by useReducer.
 * If custom initialState arg is provided, use dispatch.native() to dispatch custom-actions & update custom-state. 
 */
export default function useAsyncReducer(
    actionTypePrefix,
    asyncReducer,
    initialState = ASYNC_STATE
) {
    const [state, dispatch] = useReducer(asyncReducer, initialState);
    console.log("useAsyncReducer:", state);

    // Defined custom dispatch functions, each responsible for updating state at certain points of an async task
    const dispatchLoad = useCallback(
        () => dispatch({ type: `${actionTypePrefix}_LOAD` }),
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

    // IMPORTANT: useMemo prevents value of dispatch functions from changing on every render
    const customDispatch = useMemo(
        () => ({
            load: dispatchLoad,
            success: dispatchSuccess,
            failed: dispatchFailed,
            // original dispatch function returned by useReducer
            native: dispatch,
        }),
        [dispatchLoad, dispatchSuccess, dispatchFailed]
    );

    return [state, customDispatch];
}
