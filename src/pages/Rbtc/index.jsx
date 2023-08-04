import React, { Fragment, useState, useContext, useEffect } from 'react';

import { AuthenticateContext } from '../../context/Auth';
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

import './../../assets/css/pages.scss';
import { ReactComponent as LogoPausedIcon } from '../../assets/icons/fastbtc_paused_en_imageonly.svg';


export default function Rbtc(props) {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

    return (
        <Fragment>
            {!auth.isLoggedIn && <p>Not connected! </p>}

            <div style={{
                'text-align': 'center',
                width: '650px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontSize: '20px',
                fontWeight: '500',
                marginTop: '200px'
            }}>
                <LogoPausedIcon
                    alt="Warning: Sovryn Fastbtc Paused!"
                    height="186"
                    width="177"
                />
                <p style={{marginTop: '25px', color: '#06364F'}}>Sovryn is currently updating FastBTC smart contracts.  After the update
                    is finished and the updated smart contracts has been verified we will re-enable this feature.  </p>
            </div>
        </Fragment>
    );
}
