import React, { useEffect, useState } from 'react';
import notification from 'antd/lib/notification';
import { t, TAPi18n } from '../../../../api/helpers/i18nHelper.js';
import {
    getMaxMintableBalance,
    getMaxRedeemableBalance,
    getCommissionRateAndCurrency,
    convertAmount
} from '../../../../api/helpers/exchangeManagerHelper';
import { LargeNumber } from '../../atoms/LargeNumber/LargeNumber';
import InputWithCurrencySelector from '../InputWithCurrencySelector/InputWithCurrencySelector';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import ButtonPrimary from '../../atoms/ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../../atoms/ButtonSecondary/ButtonSecondary';
import ConfirmTransactionModal from '../../molecules/ConfirmTransactionModal/ConfirmTransactionModal';
import { userAccountIsLoggedIn } from '../../../../api/helpers/userAccountHelper';
import { getExchangeMethod } from '../../../../api/helpers/exchangeHelper';
import {
    formatVisibleValue,
    formatValueToContract,
    formatValueWithContractPrecision
} from '../../../../api/helpers/precisionHelper';
import BigNumber from 'bignumber.js';
import tokenPricesContainer from '../../../containers/tokenPricesContainer';
import mocStateContainer from '../../../containers/mocStateContainer';
import userStateContainer from '../../../containers/userStateContainer';
import Card from '../../atoms/Card/Card';
import Switch from '../../atoms/Switch/Switch';

import Popover from 'antd/es/popover';
import Button from 'antd/es/button';
import Spin from 'antd/es/spin';
import Modal from 'antd/lib/modal/Modal';
import { LoadingOutlined } from '@ant-design/icons';

const MintOrRedeemToken = ({ token, ...props }) => {
    /* Context props */
    const { convertToken, mocState, userState, mocStatePrices, loading } =
        props;

    let reservePrice;
    if (mocStatePrices && mocStatePrices.bitcoinPrice) {
        reservePrice = mocStatePrices.bitcoinPrice;
    }

    /* State variable */
    const [currencyYouExchange, setCurrencyYouExchange] = useState('RESERVE');
    const [valueYouExchange, setValueYouExchange] = useState('0');
    const [valueYouReceive, setValueYouReceive] = useState('0');
    const [youExchangeIsValid, onYouExchangeValidityChange] = useState(false);
    const [youReceiveIsValid, onYouReceiveValidityChange] = useState(false);
    const [confirmingTransaction, setConfirmingTransaction] = useState(false);
    const [interests, setInterests] = useState({
        interestRate: '0',
        interestValue: BigNumber('0')
    });
    const actionIsMint = currencyYouExchange === 'RESERVE';
    const [loadingSwitch, setLoadingSwitch] = useState(false);
    const [commissionSwitch, setCommissionSwitch] = useState('RESERVE');
    const [ShowModalAllowanceReserve, setShowModalAllowanceReserve] =
        useState(false);
    const [ModalAllowanceReserveMode, setModalAllowanceReserveMode] =
        useState('Confirm');

    let userComment = '';

    /* Effects */
    useEffect(() => {
        if (convertToken) {
            onValueYouExchangeChange(valueYouReceive);
        }
    }, [currencyYouExchange]);
    useEffect(() => {
        const awaitInterests = async (newValueYouExchange) => {
            const interests = await calcInterests(newValueYouExchange);
            setInterests(interests);
        };
        if (convertToken) {
            awaitInterests(valueYouExchange);
        }
    }, [valueYouExchange]);

    /* Methods */
    const getCurrencyYouReceive = (actionIsMint, tokenToMintOrRedeem) => {
        return actionIsMint ? tokenToMintOrRedeem : 'RESERVE';
    };

    const onValueYouExchangeChange = (newValueYouExchange) => {
        setValueYouExchange(newValueYouExchange);
        const newValueYouReceiveInWei = convertAmount(
            currencyYouExchange,
            currencyYouReceive,
            newValueYouExchange,
            convertToken
        );
        setValueYouReceive(newValueYouReceiveInWei);
    };
    const onValueYouReceiveChange = (newValueYouReceive) => {
        setValueYouReceive(newValueYouReceive);
        const newValueYouExchange = convertAmount(
            currencyYouReceive,
            currencyYouExchange,
            newValueYouReceive,
            convertToken
        );
        setValueYouExchange(newValueYouExchange);
    };
    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        setCurrencyYouExchange(newCurrencyYouExchange);
    };

    const getMaxValues = () => {
        let maxValueYouExchange, maxValueYouReceive;
        if (actionIsMint) {
            maxValueYouReceive = getMaxMintableBalance(
                token,
                userState,
                mocState,
                convertToken
            ).value.toString();
            maxValueYouExchange = convertAmount(
                token,
                'RESERVE',
                maxValueYouReceive,
                convertToken
            );
        } else {
            //action is redeem
            maxValueYouExchange = getMaxRedeemableBalance(
                token,
                userState,
                mocState
            ).value.toString();
            maxValueYouReceive = convertAmount(
                token,
                'RESERVE',
                maxValueYouExchange,
                convertToken
            );
        }
        return {
            youExchange: maxValueYouExchange,
            youReceive: maxValueYouReceive
        };
    };

    const clear = () => {
        setCurrencyYouExchange(token);
        setValueYouExchange('0');
        setValueYouReceive('0');
    };
    const openConfirmationModal = () => {
        setConfirmingTransaction(true);
    };
    const closeConfirmationModal = () => {
        setConfirmingTransaction(false);
    };

    const calcCommission = () => {
        if (!convertToken || !mocState) return {};
        const {
            commissionCurrency,
            commissionRate,
            commissionYouPay,
            enoughMOCBalance
        } = getCommissionRateAndCurrency({
            valueYouExchange,
            currencyYouReceive,
            currencyYouExchange,
            mocState,
            userState,
            convertToken
        });

        const commissionRateVisible = formatVisibleValue(
            commissionRate * 100,
            'commissionRate',
            TAPi18n.getLanguage()
        );
        return {
            percentage: commissionRateVisible,
            value: commissionYouPay,
            currencyCode: commissionCurrency,
            enoughMOCBalance: enoughMOCBalance
        };
    };
    const calcInterests = async (newValueYouExchange) => {
        let interestRate = '0',
            interestValue = BigNumber('0');
        if (actionIsMint && currencyYouReceive === 'RISKPROX') {
            interestValue = await window.nodeManager.calcMintInterestValues(
                BigNumber(newValueYouExchange).toFixed(0).toString()
            );
            interestValue = new BigNumber(0.01)
                .multipliedBy(interestValue)
                .plus(interestValue);
            interestRate = formatValueToContract(
                new BigNumber(interestValue)
                    .multipliedBy(100)
                    .div(newValueYouExchange)
                    .toFixed(),
                'USD'
            );
            interestRate = formatVisibleValue(
                interestRate,
                'commissionRate',
                TAPi18n.getLanguage()
            );
        }
        return { interestRate, interestValue };
    };
    const onConfirmTransaction = async (comment) => {
        userComment = comment;

        const { appMode } = Meteor.settings.public;
        // In rrc20 mode show allowance when need it
        if (appMode == 'RRC20') {
            const userAllowance = await window.nodeManager.getReserveAllowance(
                window.address
            );
            if (valueYouExchange > userAllowance) {
                allowanceReserveModalShow(true);
                return;
            }
        }
        onConfirmTransactionFinish();
    };

    const onConfirmTransactionFinish = async () => {
        const exchangeMethod = getExchangeMethod(
            currencyYouExchange,
            currencyYouReceive,
            `${commission.currencyCode}_COMMISSION`
        );
        exchangeMethod(
            userComment,
            formatValueWithContractPrecision(valueYouExchange, 'RESERVE')
        );
        setConfirmingTransaction(false);
    };

    const allowanceReserveModalClose = async () => {
        setShowModalAllowanceReserve(false);
    };

    const allowanceReserveModalShow = async () => {
        setShowModalAllowanceReserve(true);
    };

    const allowanceReserveModalModeWaiting = async () => {
        setModalAllowanceReserveMode('Waiting');
    };

    const renderAllowanceReserveModalConfirm = () => {
        return (
            <>
                <h1 className="ReserveAllowanceModal_Title">
                    {t('global.ReserveAllowanceModal_SetAllowance')}
                </h1>
                <div className="ReserveAllowanceModal_Content">
                    <p>
                        {t('global.ReserveAllowanceModal_AllowanceDescription')}
                    </p>
                    <ButtonPrimary
                        className="ButtonPrimary"
                        lowerCase
                        text={t('global.ReserveAllowanceModal_Authorize')}
                        onClick={setAllowanceReserve}
                    />
                </div>
            </>
        );
    };

    const renderAllowanceReserveModalLoading = () => {
        return (
            <>
                <h1 className="ReserveAllowanceModal_Title">
                    {t('global.ReserveAllowanceModal_SetAllowance')}
                </h1>
                <div className="ReserveAllowanceModal_Content AllowanceLoading">
                    <Spin indicator={<LoadingOutlined />} />
                    <p>
                        {t('global.ReserveAllowanceModal_ProccessingAllowance')}
                    </p>
                </div>
            </>
        );
    };

    const renderAllowanceReserveModal = () => {
        var renderContent = '';
        if (ModalAllowanceReserveMode == 'Confirm') {
            renderContent = renderAllowanceReserveModalConfirm();
        } else {
            renderContent = renderAllowanceReserveModalLoading();
        }

        return (
            <Modal
                className="ReserveAllowanceModal"
                visible={ShowModalAllowanceReserve}
                onCancel={allowanceReserveModalClose}
                footer={null}
            >
                {renderContent}
            </Modal>
        );
    };

    const setAllowanceReserve = () => {
        setModalAllowanceReserveMode('Waiting');
        const result = window.nodeManager.approveReserve(
            window.address,
            (a, _txHash) => {
                msgAllowanceTx(_txHash);
            }
        );
        result
            .then(() => setDoneAllowanceReserve())
            .catch(() => setFailAllowanceReserve());
        msgAllowanceReserveSend();
    };

    const setDoneAllowanceReserve = () => {
        setModalAllowanceReserveMode('Confirm');
        allowanceReserveModalClose();
        onConfirmTransactionFinish();
    };

    const setFailAllowanceReserve = () => {
        setModalAllowanceReserveMode('Confirm');
        allowanceReserveModalClose();
    };

    const setAllowance = (allowanceEnabled) => {
        setLoadingSwitch(true);
        const result = window.nodeManager.approveMoCToken(
            allowanceEnabled,
            (a, _txHash) => {
                msgAllowanceTx(_txHash);
            }
        );
        result
            .then(() => setDoneSwitch(allowanceEnabled))
            .catch(() => setFailSwitch());
        msgAllowanceSend();
    };

    const msgAllowanceReserveSend = () => {
        notification['warning']({
            message: t('global.ReserveAllowanceModal_allowanceSendTitle'),
            description: t(
                'global.ReserveAllowanceModal_allowanceSendDescription'
            ),
            duration: 10
        });
    };

    const msgAllowanceSend = () => {
        notification['warning']({
            message: t('exchange.allowance.allowanceSendTitle'),
            description: t('exchange.allowance.allowanceSendDescription'),
            duration: 10
        });
    };

    const msgAllowanceTx = (txHash) => {
        const key = `open${Date.now()}`;
        const onClick = `${window.explorerUrl}/tx/${txHash}`;
        const btn = (
            <Button
                type="primary"
                size="small"
                onClick={() =>
                    window.open(`${window.explorerUrl}/tx/${txHash}`)
                }
            >
                Explorer TX
            </Button>
        );
        notification['warning']({
            message: t('exchange.allowance.allowanceTxTitle'),
            description: t('exchange.allowance.allowanceTxDescription'),
            btn,
            key,
            duration: 20
        });
    };

    const setDoneSwitch = (allowanceEnabled) => {
        //setLoadingSwitch(false);
    };

    const setFailSwitch = () => {
        setLoadingSwitch(false);

        notification['error']({
            message: t('exchange.allowance.allowanceSendErrorTitle'),
            description: t('exchange.allowance.allowanceSendErrorDescription'),
            duration: 10
        });
    };

    const totalsWithCommissionAndInterests = () => {
        let totalYouExchange = BigNumber(valueYouExchange);
        let totalYouReceive = BigNumber(valueYouReceive);
        const commission = calcCommission();
        if (actionIsMint) {
            if (commission.currencyCode === 'RESERVE') {
                totalYouExchange = totalYouExchange.plus(commission.value);
            }
            totalYouExchange = totalYouExchange.plus(interests.interestValue);
        } else {
            // action is Redeem, then commissions are subtracted from value you receive
            if (commission.currencyCode === 'RESERVE') {
                totalYouReceive = totalYouReceive.minus(commission.value);
            }
            totalYouReceive = totalYouReceive.minus(interests.interestValue);
        }
        return { totalYouExchange, totalYouReceive };
    };

    /* Variables */

    const currencyYouReceive = getCurrencyYouReceive(actionIsMint, token);
    const commission = calcCommission();
    const totals = totalsWithCommissionAndInterests();

    /* View */

    const renderExchangeInputs = () => {
        return (
            <div className="ExchangeInputs AlignedAndCentered">
                <div className="YouExchange">
                    <InputWithCurrencySelector
                        title={t('global.MintOrRedeemToken_YouExchange')}
                        currencySelected={currencyYouExchange}
                        onCurrencySelect={onChangeCurrencyYouExchange}
                        inputValueInWei={valueYouExchange}
                        onInputValueChange={onValueYouExchangeChange}
                        currencyOptions={[token, 'RESERVE']}
                        onValidationStatusChange={onYouExchangeValidityChange}
                        maxValueAllowedInWei={getMaxValues().youExchange}
                        showMaxValueAllowed
                        validate={
                            userAccountIsLoggedIn() &&
                            Session.get('rLoginConnected')
                        }
                        showConvertBTC_RBTC_Link={false}
                    />
                </div>
                <ArrowRightOutlined />
                <div className="YouReceive">
                    <InputWithCurrencySelector
                        title={t('global.MintOrRedeemToken_YouReceive')}
                        validate={
                            userAccountIsLoggedIn() &&
                            Session.get('rLoginConnected')
                        }
                        currencyOptions={[token, 'RESERVE']}
                        onValidationStatusChange={onYouReceiveValidityChange}
                        currencySelected={currencyYouReceive}
                        disableCurrencySelector
                        inputValueInWei={valueYouReceive}
                        maxValueAllowedInWei={getMaxValues().youReceive}
                        showMaxValueAllowed
                        onInputValueChange={onValueYouReceiveChange}
                        showConvertBTC_RBTC_Link={false}
                    />
                </div>
            </div>
        );
    };
    const renderFooter = () => {
        return (
            <div className="MintOrRedeemTokenFooter AlignedAndCentered">
                <div className="ReserveInUSD">
                    <span className={`Conversion ${window.appMode}`}>
                        1 {t('Tokens_RESERVE_code')} ={' '}
                        <LargeNumber
                            className="ReservePrice"
                            amount={reservePrice}
                            currencyCode="USD"
                            includeCurrency
                        />
                    </span>
                    <span className="Disclaimer">
                        {t('global.MintOrRedeemToken_AmountMayDiffer')}
                    </span>
                </div>
                <div
                    className={`MainActions ${window.appMode} AlignedAndCentered`}
                >
                    <ButtonSecondary
                        text={t('global.MintOrRedeemToken_Clear')}
                        className="ClearButton"
                        lowerCase
                        onClick={clear}
                    />
                    <ButtonPrimary
                        lowerCase
                        disabled={!youExchangeIsValid || !youReceiveIsValid}
                        text={
                            actionIsMint
                                ? t('global.MintOrRedeemToken_Mint')
                                : t('global.MintOrRedeemToken_Redeem')
                        }
                        onClick={openConfirmationModal}
                    />
                </div>
            </div>
        );
    };
    const renderConfirmTransactionModal = () => {
        return (
            <ConfirmTransactionModal
                visible={confirmingTransaction}
                exchanging={{
                    value: totals.totalYouExchange,
                    currencyCode: currencyYouExchange
                }}
                receiving={{
                    value: totals.totalYouReceive,
                    currencyCode: currencyYouReceive
                }}
                fee={commission}
                interests={interests}
                onCancel={closeConfirmationModal}
                onConfirm={onConfirmTransaction}
                convertToken={convertToken}
            />
        );
    };

    const contentFee = (type) => (
        <div className="TooltipContent">
            <h4>{t(`exchange.summary.${type}Title`)}</h4>
            <p>{t(`exchange.summary.${type}TooltipText`)}</p>
        </div>
    );

    const renderComissionCurrencySwitch = () => {
        const { enoughMOCBalance } = commission;

        if (commissionSwitch != commission.currencyCode) {
            setCommissionSwitch(commission.currencyCode);
            setLoadingSwitch(false);
        }

        //const [commissionSwitch, setCommissionSwitch] = useState("RESERVE");

        let tooltip = enoughMOCBalance
            ? contentFee('payWithMocToken')
            : contentFee('notEnoughMocToken');

        return (
            <div className={`CommissionCurrencySwitch ${window.appMode}`}>
                <p>
                    {t('global.MintOrRedeemToken_Fee', {
                        feePercent: commission.percentage
                    })}
                </p>
                <LargeNumber
                    includeCurrency
                    amount={commission.value}
                    currencyCode={commission.currencyCode}
                />
                <Popover content={tooltip} placement="top">
                    <div className="PayWithMocToken">
                        <Switch
                            disabled={!enoughMOCBalance}
                            checked={commission.currencyCode === 'MOC'}
                            onChange={setAllowance}
                            loading={loadingSwitch}
                        />
                    </div>
                </Popover>
            </div>
        );
    };

    const renderInterests = () => (
        <div className="CommissionCurrencySwitch">
            <p>
                {t('global.MintOrRedeemToken_Interest', {
                    interestRate: interests.interestRate
                })}
            </p>
            <LargeNumber
                includeCurrency
                amount={interests.interestValue}
                currencyCode={'RESERVE'}
            />
        </div>
    );

    return (
        <Card
            title={
                actionIsMint
                    ? t('global.MintOrRedeemToken_Mint')
                    : t('global.MintOrRedeemToken_Redeem')
            }
            loading={loading}
            className="MintOrRedeemToken"
        >
            {convertToken && mocState && (
                <>
                    {renderExchangeInputs()}
                    {renderComissionCurrencySwitch()}
                    {interests &&
                        interests.interestValue &&
                        interests.interestValue.gt(0) &&
                        renderInterests()}
                    {renderFooter()}
                    {renderConfirmTransactionModal()}
                    {renderAllowanceReserveModal()}
                </>
            )}
        </Card>
    );
};

export default tokenPricesContainer(
    mocStateContainer(userStateContainer(MintOrRedeemToken))
);
