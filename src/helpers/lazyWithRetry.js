import React from 'react';

// A stale tab (bundle already loaded before a new CID was deployed) can try to
// fetch a chunk hash that no longer exists once the deploy rotates. The active
// service worker still precache-serves the old index.html/main.js cache-first
// on every navigation, so a plain reload alone re-serves the same stale build.
// Unregistering it first forces the reload to hit the network directly.
async function reloadBypassingServiceWorker() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    window.location.reload();
}

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
                await reloadBypassingServiceWorker();
                // Never resolve — the reload is about to replace this page.
                return new Promise(() => {});
            }
            throw error;
        }
    });
}
