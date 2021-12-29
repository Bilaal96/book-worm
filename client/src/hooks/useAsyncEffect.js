import { useState, useEffect, useRef } from "react";

/**
 * Tracks error, loading and value states for async processes such as fetch API calls 
 
 * @param { Function } memoizedAsyncCallback - a callback function wrapped in the useCallback hook; this ensures that the callback changes as dependencies change (and avoids linter's hook-dependency warnings)
 */

// https://stackoverflow.com/questions/56450975/to-fix-cancel-all-subscriptions-and-asynchronous-tasks-in-a-useeffect-cleanup-f
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
                console.log("callback receives:", val);
                setError(null);
                setValue(val);
            })
            .catch((err) => {
                if (!isMountedRef.current) return null;
                setError(err);
                setValue(null);
            })
            .finally(() => {
                if (!isMountedRef.current) return null;
                setLoading(false);
            });

        // Prevent state updates on unmount
        return () => {
            isMountedRef.current = false;
        };
    }, [memoizedAsyncCallback]);

    return { loading, error, value };
};

export default useAsyncEffect;
