import { useState, useEffect, useRef } from "react";

/**
 * Tracks error, loading and value states for async processes that return a Promise (such as Fetch API calls)
 
 * @param { Function } memoizedAsyncCallback - a callback function wrapped in the useCallback hook; this ensures that the callback changes as dependencies change (and prevents linter's hook-dependency warnings)
 */
const useAsyncEffect = (memoizedAsyncCallback) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState(null);
    const isMountedRef = useRef(true);

    // Side effect that executes whenever the callback arg changes
    useEffect(() => {
        memoizedAsyncCallback()
            .then((val) => {
                if (!isMountedRef.current) return null;
                setError(null);
                setValue(val);
                setLoading(false);
            })
            .catch((err) => {
                if (!isMountedRef.current) return null;
                setError(err);
                setLoading(false);
            });

        // Prevent state updates on unmount
        return () => {
            console.log("UNMOUNT ASYNC EFFECT");
            isMountedRef.current = false;
        };
    }, [memoizedAsyncCallback]);

    return { loading, error, value };
};

export default useAsyncEffect;
