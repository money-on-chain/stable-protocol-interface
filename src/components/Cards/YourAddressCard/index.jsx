import { Row, Col, Skeleton } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';

import { AuthenticateContext } from '../../../context/Auth';
import SendModal from '../../Modals/SendModal';
import AddressContainer from '../../AddressContainer/AddressContainer';
import { config } from '../../../projects/config';
import { useProjectTranslation } from '../../../helpers/translations';

export default function YourAddressCard(props) {
    const { height = '', tokenToSend, className, view } = props;
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;

    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const isLoggedIn = auth?.userBalanceData;

    var { address = '' } = auth.userBalanceData || {};
    if (!isLoggedIn) {
        address = '';
    }

    const classname = `SendToken ${className}`;

    const [loading, setLoading] = useState(true);
    const timeSke = 1500;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    return (
        <div
            className="Card SendTokenContainer"
            style={{
                height: height,
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between'
            }}
        >
            {!loading ? (
                <>
                    <h3 className={'CardTitle margin-bottom-10'}>
                        {t(`${AppProject}.wallets.ownAddressLabel`, { ns: ns })}{' '}
                    </h3>
                    <div className={classname}>
                        <AddressContainer
                            {...{ address }}
                            accountData={accountData}
                            view={view}
                        />
                    </div>
                    <Row
                        style={{ display: 'flex', justifyContent: 'center' }}
                        className="SendBtn"
                    >
                        <Col>
                            {auth.isLoggedIn && (
                                <Fragment>
                                    <br />
                                    <SendModal
                                        {...{ tokensToSend: [tokenToSend] }}
                                        currencyOptions={props.currencyOptions}
                                        userState={auth}
                                        view={view}
                                    />
                                </Fragment>
                            )}
                        </Col>
                    </Row>
                </>
            ) : (
                <Skeleton active={true} paragraph={{ rows: 4 }}></Skeleton>
            )}
        </div>
    );
}
