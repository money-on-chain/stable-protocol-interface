import React, { Fragment, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Skeleton, Tooltip } from 'antd';

import { AuthenticateContext } from '../../../context/Auth';
import InformationModal from '../../Modals/InformationModal';
import BalanceItemCard from '../BalanceItemCard/BalanceItemCard';
import { useProjectTranslation } from '../../../helpers/translations';

import { ReactComponent as LogoIcon } from '../../../assets/icons/icon-tg.svg';

function MocAmount() {
    const auth = useContext(AuthenticateContext);

    const set_moc_balance_usd = () => {
        if (auth.userBalanceData) {
            return auth.userBalanceData['mocBalance'];
        } else {
            return (0).toFixed(2);
        }
    };
    const [t, i18n, ns] = useProjectTranslation();
    const [loading, setLoading] = useState(true);
    const timeSke = 1500;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    return (
        <div className="ContainerMocAmountDatas height-auto">
            <div className="Card RewardsBalanceAmount withPadding hasTitle ">
                {!loading ? (
                    <>
                        <div className="title">
                            <h1>
                                {t('global.RewardsBalance_MocAmount', {
                                    ns: 'global'
                                })}
                            </h1>
                            <InformationModal currencyCode={'TG'} />
                        </div>
                        <div className="LogoAndAmount">
                            <LogoIcon
                                className="MocLogo"
                                width={45}
                                height={45}
                            />
                            <div className="TotalAmountContainer">
                                <h2>
                                    {t('global.RewardsBalance_MocsTokens', {
                                        ns: 'global'
                                    })}
                                </h2>
                                <div className="BalanceItemCard TotalAmount">
                                    <h4>
                                        <BalanceItemCard
                                            theme="TotalAmount"
                                            amount={set_moc_balance_usd()}
                                            currencyCode="TG"
                                        />
                                    </h4>
                                </div>
                            </div>
                        </div>{' '}
                    </>
                ) : (
                    <Skeleton active={true} paragraph={{ rows: 2 }}></Skeleton>
                )}
            </div>
        </div>
    );
}

export default MocAmount;
