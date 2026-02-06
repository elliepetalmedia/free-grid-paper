import { useCallback, useEffect, useState } from 'react';

// Safely encode/decode values
const encode = (val: any) => encodeURIComponent(JSON.stringify(val));
const decode = (val: string) => {
    try {
        return JSON.parse(decodeURIComponent(val));
    } catch (e) {
        return null;
    }
};

export function useUrlState<T extends object>(initialState: T) {
    const [state, setState] = useState<T>(initialState);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const updates: Partial<T> = {};
        let hasUpdates = false;

        // Check if the URL has params that match our state keys
        // We only iterate keys that exist in initial state to prevent pollution
        Object.keys(initialState).forEach((key) => {
            const val = params.get(key);
            if (val) {
                const decoded = decode(val);
                if (decoded !== null) {
                    updates[key as keyof T] = decoded;
                    hasUpdates = true;
                }
            }
        });

        if (hasUpdates) {
            setState((prev) => ({ ...prev, ...updates }));
        }

        setIsInitialized(true);
    }, []); // Run once on mount

    // Sync state to URL
    const updateState = useCallback((updates: Partial<T>) => {
        setState((prev) => {
            const newState = { ...prev, ...updates };

            // Update URL without reload
            const params = new URLSearchParams();
            Object.entries(newState).forEach(([key, val]) => {
                // Only put meaningful values in URL (skip defaults might be complex, so putting all for now)
                // Optimization: We could diff against initialState if we wanted clean URLs
                if (val !== undefined && val !== null) {
                    params.set(key, encode(val));
                }
            });

            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);

            return newState;
        });
    }, []);

    return { state, updateState, isInitialized };
}
