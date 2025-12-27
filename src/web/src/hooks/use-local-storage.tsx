import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    // Get initial value from localStorage or use default
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Update state when key changes
    useEffect(() => {
        setStoredValue(readValue());
    }, [key, readValue]);

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const newValue = value instanceof Function ? value(storedValue) : value;
                window.localStorage.setItem(key, JSON.stringify(newValue));
                setStoredValue(newValue);
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}
