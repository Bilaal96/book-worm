import { useReducer, useCallback } from "react";

const INITIAL_STATE = {
    value: null,
    isLoading: false,
    error: null,
};

export default function useAsyncReducer(actionTypePrefix) {
    const asyncReducer = createAsyncReducer(actionTypePrefix);
    const [state, dispatch] = useReducer(asyncReducer, INITIAL_STATE);

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

    return [state, dispatchStart, dispatchSuccess, dispatchFailed, dispatch];
}

// returns a reducer that handles async processes (including loading state)
function createAsyncReducer(actionTypePrefix) {
    return function (state, action) {
        switch (action.type) {
            case `${actionTypePrefix}_START`:
                console.log(`ACTION DISPATCHED: ${actionTypePrefix}_START`);
                return {
                    ...state,
                    isLoading: true,
                    error: null,
                };
            case `${actionTypePrefix}_SUCCESS`:
                console.log(`ACTION DISPATCHED: ${actionTypePrefix}_SUCCESS`);
                return {
                    ...state,
                    value: action.payload,
                    isLoading: false,
                };
            case `${actionTypePrefix}_FAILED`:
                console.log(`ACTION DISPATCHED: ${actionTypePrefix}_FAILED`);
                return {
                    ...state,
                    error: action.payload,
                    isLoading: false,
                };
            default:
                return state;
        }
    };
}
