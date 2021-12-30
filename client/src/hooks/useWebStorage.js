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
        // Init value by retrieving existing value from storageObject
        const jsonValue = storageObject.getItem(key);
        if (jsonValue !== null) return JSON.parse(jsonValue); // parse JSON value if not empty

        // Value doesn't exist in storageObject
        // Initialise value via defaultValue, invoke function if passed
        if (typeof defaultValue === "function") {
            return defaultValue();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        // Remove value if set to undefined via remove func (see below)
        if (value === undefined) return storageObject.removeItem(key);
        storageObject.setItem(key, JSON.stringify(value));
    }, [key, value, storageObject]);

    const remove = useCallback(() => {
        setValue(undefined);
    }, [setValue]);

    return [value, setValue, remove];
}
