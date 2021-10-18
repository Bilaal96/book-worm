import { useState, useEffect, useCallback } from "react";

export function useSessionStorage(key, value) {
    return useStorage(key, value, window.sessionStorage);
}

export function useLocalStorage(key, value) {
    return useStorage(key, value, window.localStorage);
}

// Allows initialisation of state via storageObject (local/session storage)
function useStorage(key, defaultValue, storageObject) {
    const [value, setValue] = useState(() => {
        // Init value by retrieving existing value from storageObject
        const jsonValue = storageObject.getItem(key);
        if (jsonValue !== null) return JSON.parse(jsonValue); // parse JSON value if not empty

        // Value doesn't exist in storageObject
        // Init value via defaultValue, invoke function if passed
        if (typeof defaultValue === "function") {
            defaultValue();
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
