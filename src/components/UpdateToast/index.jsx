import React from 'react';
import { notification, Button } from 'antd';

const NOTIFICATION_KEY = 'app-update-available';

let isReloading = false;

function reloadWaitingWorker(registration) {
    const waitingWorker = registration.waiting;

    if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
}

export function showUpdateToast(registration) {
    notification.open({
        key: NOTIFICATION_KEY,
        message: 'Update available',
        description:
            'A new version of this app is available. Reload to update.',
        duration: 0,
        placement: 'bottomRight',
        btn: (
            <Button
                type="primary"
                size="small"
                onClick={() => {
                    notification.close(NOTIFICATION_KEY);
                    reloadWaitingWorker(registration);
                }}
            >
                Reload
            </Button>
        )
    });
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
