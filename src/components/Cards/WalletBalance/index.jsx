import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Button, Skeleton } from 'antd';

import WalletBalancePie from '../WalletBalancePie';
import Copy from '../../Page/Copy';
import { AuthenticateContext } from '../../../context/Auth';
import SendModal from '../../Modals/SendModal';
import { config } from '../../../projects/config';
import { getSelectCoins } from '../../../helpers/helper';
import { useProjectTranslation } from '../../../helpers/translations';

function WalletBalance(props) {
    const auth = useContext(AuthenticateContext);
    const { accountData = {} } = auth;
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const [loading, setLoading] = useState(true);

    const timeSke = 1500;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    return (
        <>
            {!loading ? (
                <div
                    className="WalletBalance mrc-15"
                    style={{ height: '100%' }}
                >
                    <div className="mrb-25 color-707070">
                        {t('global.TotalBalanceCard_totalBalance', {
                            ns: 'global'
                        })}
                    </div>
                    <WalletBalancePie />
                    {auth.isLoggedIn && (
                        <div className="TotalBalanceBottom justify-content-initial">
                            <div className="CopyableText ">
                                <span className="title">
                                    {t(
                                        `${AppProject}.operations.columns_detailed.address`,
                                        { ns: ns }
                                    )}
                                </span>
                                <div>
                                    <Copy
                                        textToShow={
                                            accountData.truncatedAddress
                                        }
                                        textToCopy={accountData.Wallet}
                                    />
                                </div>
                            </div>
                            <div>
                                <SendModal
                                    userState={auth}
                                    tokensToSend={getSelectCoins(
                                        auth.getAppMode
                                    )}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className="WalletBalance mrc-15"
                    style={{ height: '100%' }}
                >
                    {' '}
                    <Skeleton
                        active={true}
                        paragraph={{ rows: 5 }}
                    ></Skeleton>{' '}
                </div>
            )}
        </>
    );
}

export default WalletBalance;
