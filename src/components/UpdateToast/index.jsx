import React from 'react';
import { notification, Button } from 'antd';
import i18next from 'i18next';

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
        message: i18next.t('global.UpdateToast_message', { ns: 'global' }),
        description: i18next.t('global.UpdateToast_description', {
            ns: 'global'
        }),
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
                {i18next.t('global.UpdateToast_reload', { ns: 'global' })}
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
