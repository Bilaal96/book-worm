import { useState, useCallback, useEffect } from "react";

export default function useAsync(callback, dependencies = []) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState(null);
    console.log("async state", { loading, error, value });

    const callbackMemoized = useCallback(() => {
        setLoading(true);

        callback()
            .then((val) => {
                console.log("callback receives:", val);
                return val;
            })
            .then(setValue)
            .catch((err) => {
                setError(err);
                setValue(undefined);
            })
            .finally(() => setLoading(false));
    }, dependencies);

    useEffect(() => {
        callbackMemoized();
    }, [callbackMemoized]);

    return { loading, error, value };
}
