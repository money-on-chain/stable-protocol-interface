import React from 'react';

// A stale tab (bundle already loaded before a new CID was deployed) can try to
// fetch a chunk hash that no longer exists once the deploy rotates. Reload once
// to pick up the new build instead of letting React.lazy throw uncaught.
export default function lazyWithRetry(componentImport) {
    return React.lazy(async () => {
        const key = 'lazy-chunk-reloaded';
        try {
            const component = await componentImport();
            window.sessionStorage.removeItem(key);
            return component;
        } catch (error) {
            if (!window.sessionStorage.getItem(key)) {
                window.sessionStorage.setItem(key, '1');
                window.location.reload();
                // Never resolve — the reload is about to replace this page.
                return new Promise(() => {});
            }
            throw error;
        }
    });
}
