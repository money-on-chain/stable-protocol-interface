import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'antd';
import i18next from 'i18next';

let isReloading = false;
let pendingRegistration = null;
const listeners = new Set();

function reloadWaitingWorker(registration) {
    const waitingWorker = registration.waiting;

    if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
}

// Called imperatively from src/index.js's serviceWorkerRegistration onUpdate
// callback, outside the React tree — fans out to whichever <UpdateToast/>
// instance is currently mounted (see Skeleton.jsx) via the listeners set.
export function showUpdateToast(registration) {
    pendingRegistration = registration;
    listeners.forEach(listener => listener(registration));
}

// The waiting worker only takes control once skipWaiting() runs, which
// fires this event; reload then to actually serve the new assets.
export function listenForControllerChange() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isReloading) {
            return;
        }
        isReloading = true;
        window.location.reload();
    });
}

export default function UpdateToast() {
    const [registration, setRegistration] = useState(pendingRegistration);

    useEffect(() => {
        listeners.add(setRegistration);
        return () => listeners.delete(setRegistration);
    }, []);

    if (!registration) {
        return null;
    }

    return (
        <Alert
            message={i18next.t('global.UpdateToast_message', { ns: 'global' })}
            description={i18next.t('global.UpdateToast_description', {
                ns: 'global'
            })}
            type="warning"
            showIcon
            className="AlertUpdate"
            action={
                <Button
                    size="medium"
                    onClick={() => {
                        setRegistration(null);
                        reloadWaitingWorker(registration);
                    }}
                >
                    {i18next.t('global.UpdateToast_reload', { ns: 'global' })}
                </Button>
            }
        />
    );
}
