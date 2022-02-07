import { useState, useEffect, useCallback } from "react";

export function useSessionStorage(key, value) {
    return useWebStorage(key, value, window.sessionStorage);
}

export function useLocalStorage(key, value) {
    return useWebStorage(key, value, window.localStorage);
}

// Allows initialisation of state via storageObject (local/session storage)
export default function useWebStorage(key, defaultValue, storageObject) {
    const [value, setValue] = useState(() => {
        // Init value by retrieving existing value from storageObject (if it exists)
        const jsonValue = storageObject.getItem(key);
        if (jsonValue !== null) return JSON.parse(jsonValue);

        // Value doesn't exist in storageObject
        // Initialise value via defaultValue, invoking function if passed
        if (typeof defaultValue === "function") {
            return defaultValue();
        } else {
            return defaultValue;
        }
    });

    const remove = useCallback(() => {
        // Remove from storageObject
        storageObject.removeItem(key);
        // Prevent re-setting the storageObject item via useEffect (see below)
        setValue(undefined);
    }, [storageObject, key, setValue]);

    // If value is not undefined, set value in storageObject
    useEffect(() => {
        if (value === undefined) return;
        storageObject.setItem(key, JSON.stringify(value));
    }, [key, value, storageObject]);

    return [value, setValue, remove];
}
