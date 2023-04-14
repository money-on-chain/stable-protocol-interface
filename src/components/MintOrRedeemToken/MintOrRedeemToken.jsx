import React, { useEffect, useState, useContext } from 'react';
import {
    notification,
    Popover,
    Button,
    Spin,
    Modal,
    Card,
    Switch,
    Skeleton
} from 'antd';
import { LoadingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import BigNumber from 'bignumber.js';

import {
    getMaxMintableBalance,
    getMaxRedeemableBalance,
    getCommissionRateAndCurrency,
    convertAmount
} from '../../helpers/exchangeManagerHelper';
import { LargeNumber } from '../LargeNumber';
import InputWithCurrencySelector from '../Form/InputWithCurrencySelector';
import {
    formatVisibleValue,
    formatValueToContract,
    formatLocalMap2
} from '../../helpers/Formats';
import MintModal from '../Modals/MintModal';
import { AuthenticateContext } from '../../context/Auth';
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

const MintOrRedeemToken = (props) => {

    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const vendorAccount = config.environment.vendor.address;
    const vendorMarkupDefault = config.environment.vendor.markup;
    const auth = useContext(AuthenticateContext);

    /* Context props */
    const { token, mocState, userState, style } = props;

    /* State variable */

    /* Disable Mint TX */
    let defaultCurrencyExchange;
    if (token === 'TX') {
        defaultCurrencyExchange = token;
    } else {
        defaultCurrencyExchange = 'RESERVE';
    }

    const [currencyYouExchange, setCurrencyYouExchange] = useState(
        defaultCurrencyExchange
    );
    const [valueYouExchange, setValueYouExchange] = useState('0');
    const [valueYouReceive, setValueYouReceive] = useState('0');
    const [isDirtyYouExchange, setIsDirtyYouExchange] = useState(false);
    const [isDirtyYouReceive, setIsDirtyYouReceive] = useState(false);
    const [youExchangeIsValid, onYouExchangeValidityChange] = useState(false);
    const [youReceiveIsValid, onYouReceiveValidityChange] = useState(false);
    const [confirmingTransaction, setConfirmingTransaction] = useState(false);
    const [interests, setInterests] = useState({
        interestRate: '0',
        interestValue: '0'
    });
    const actionIsMint = currencyYouExchange === 'RESERVE';
    const [loadingSwitch, setLoadingSwitch] = useState(false);
    const [commissionSwitch, setCommissionSwitch] = useState('RESERVE');
    const [ShowModalAllowanceReserve, setShowModalAllowanceReserve] =
        useState(false);
    const [ModalAllowanceReserveMode, setModalAllowanceReserveMode] =
        useState('Confirm');
    const [tolerance, setTolerance] = useState('0.1');

    const userAccountIsLoggedIn = mocState;

    const [loading, setLoading] = useState(true);
    const [vendorMarkup, setVendorMarkup] = useState(vendorMarkupDefault);
    const timeSke = 1500;

    useEffect(() => {
        setTimeout(() => setLoading(false), timeSke);
    }, [auth]);

    /* Effects */
    useEffect(() => {
        if (auth.convertToken) {
            onValueYouExchangeChange(valueYouReceive);
        }
    }, [currencyYouExchange]);
    useEffect(() => {
        const awaitInterests = async (newValueYouExchange) => {
            const interests = await calcInterests(newValueYouExchange);
            setInterests(interests);
        };
        if (auth.convertToken) {
            awaitInterests(valueYouExchange);
        }

    }, [valueYouExchange]);
    useEffect(() => {
        const awaitVendorMarkup = async () => {
            const markupFromContract = await auth.interfaceVendorMarkup(vendorAccount);
            setVendorMarkup(markupFromContract);
        };
        if (auth.contractStatusData) {
            awaitVendorMarkup();
        }

    }, [auth]);


    const getCurrencyYouReceive = (actionIsMint, tokenToMintOrRedeem) => {
        return actionIsMint ? tokenToMintOrRedeem : 'RESERVE';
    };

    const onValueYouExchangeChange = (newValueYouExchange) => {
        if (newValueYouExchange === '0' && valueYouExchange === '0') {
            setIsDirtyYouExchange(true);
            setIsDirtyYouReceive(true);
        } else {
            setIsDirtyYouExchange(true);
            setIsDirtyYouReceive(false);
        }

        setValueYouExchange(newValueYouExchange);
        const newValueYouReceiveInWei = convertAmount(
            currencyYouExchange,
            currencyYouReceive,
            newValueYouExchange,
            auth.convertToken
        );
        setValueYouReceive(newValueYouReceiveInWei);
    };

    const onValueYouReceiveChange = (newValueYouReceive) => {
        setIsDirtyYouExchange(false);
        setIsDirtyYouReceive(true);
        setValueYouReceive(newValueYouReceive);
        const newValueYouExchange = convertAmount(
            currencyYouReceive,
            currencyYouExchange,
            newValueYouReceive,
            auth.convertToken
        );
        setValueYouExchange(newValueYouExchange);
    };

    const onChangeCurrencyYouExchange = (newCurrencyYouExchange) => {
        setValueYouExchange('0');
        setValueYouReceive('0');
        onValueYouReceiveChange('0');
        setCurrencyYouExchange(newCurrencyYouExchange);
    };

    const getMaxValues = () => {
        let maxValueYouExchange, maxValueYouReceive;
        if (actionIsMint) {
            maxValueYouReceive = getMaxMintableBalance(
                token,
                userState,
                mocState,
                auth.convertToken,
                vendorMarkup
            ).value.toString();
            maxValueYouExchange = convertAmount(
                token,
                'RESERVE',
                maxValueYouReceive,
                auth.convertToken
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
                auth.convertToken
            );
        }
        return {
            youExchange: maxValueYouExchange,
            youReceive: maxValueYouReceive
        };
    };

    const clear = () => {
        setIsDirtyYouExchange(false);
        setIsDirtyYouReceive(false);
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
        if (!auth.convertToken || !mocState) return {};

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
            convertToken: auth.convertToken,
            vendorMarkup
        });

        const commissionRateVisible = formatVisibleValue(
            commissionRate * 100,
            'commissionRate',
            formatLocalMap2[i18n.languages[0]]
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
            interestValue = '0';
        if (actionIsMint && currencyYouReceive === 'TX') {
            interestValue = await auth.interfaceCalcMintInterestValues(
                BigNumber(newValueYouExchange).div(10 ** 18)
            );

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
                formatLocalMap2[i18n.languages[0]]
            );
        }
        return { interestRate, interestValue };
    };

    const allowanceReserveModalClose = async () => {
        setShowModalAllowanceReserve(false);
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
                    <Button type="primary" onClick={setAllowanceReserve}>
                        {t('global.ReserveAllowanceModal_Authorize')}
                    </Button>
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
        if (ModalAllowanceReserveMode === 'Confirm') {
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
        const result = auth.interfaceApproveReserve(null, (a, _txHash) => {
            msgAllowanceTx(_txHash);
        });
        result
            .then(() => setDoneAllowanceReserve())
            .catch(() => setFailAllowanceReserve());
        msgAllowanceReserveSend();
    };

    const setDoneAllowanceReserve = () => {
        setModalAllowanceReserveMode('Confirm');
        allowanceReserveModalClose();
        // onConfirmTransactionFinish();
    };

    const setFailAllowanceReserve = () => {
        setModalAllowanceReserveMode('Confirm');
        allowanceReserveModalClose();
    };

    const setAllowance = async (allowanceEnabled) => {
        const onTransactionAllowance = (transactionHash) => {
            setLoadingSwitch(true);
            msgAllowanceTx(transactionHash);
        };

        const onReceiptAllowance = async (receipt) => {
            const filteredEvents = auth.interfaceDecodeEvents(receipt);
            auth.loadContractsStatusAndUserBalance();
            setDoneSwitch(allowanceEnabled);
        };

        msgAllowanceSend();
        await auth
            .interfaceApproveTGTokenCommission(
                allowanceEnabled,
                onTransactionAllowance,
                onReceiptAllowance
            )
            .catch((e) => {
                console.error(e);
                setFailSwitch();
            });
    };

    const msgAllowanceReserveSend = () => {
        notification['warning']({
            message: t('global.ReserveAllowanceModal_allowanceSendTitle'),
            description: t(
                'global.ReserveAllowanceModal_allowanceSendDescription'
            ),
            duration: 20
        });
    };

    const msgAllowanceSend = () => {
        notification['warning']({
            message: t(`${AppProject}.exchange.allowance.allowanceSendTitle`, {
                ns: ns
            }),
            description: t(
                `${AppProject}.exchange.allowance.allowanceSendDescription`,
                { ns: ns }
            ),
            duration: 20
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
            message: t(`${AppProject}.exchange.allowance.allowanceTxTitle`, {
                ns: ns
            }),
            description: t(
                `${AppProject}.exchange.allowance.allowanceTxDescription`,
                { ns: ns }
            ),
            btn,
            key,
            duration: 35
        });
    };

    const setDoneSwitch = (allowanceEnabled) => {
        setLoadingSwitch(false);
    };

    const setFailSwitch = () => {
        setLoadingSwitch(false);

        notification['error']({
            message: t(
                `${AppProject}.exchange.allowance.allowanceSendErrorTitle`,
                { ns: ns }
            ),
            description: t(
                `${AppProject}.exchange.allowance.allowanceSendErrorDescription`,
                { ns: ns }
            ),
            duration: 10
        });
    };

    const totalsWithCommissionAndInterests = () => {
        let totalYouExchange = BigNumber(valueYouExchange);
        let totalYouReceive = BigNumber(valueYouReceive);

        // Mint BTCX slippage (user tolerance)
        // take in care user tolerance
        //if (actionIsMint && currencyYouReceive === 'RISKPROX') {
        if (actionIsMint && currencyYouReceive !== 'TP') {
            const userToleranceAmount = new BigNumber(tolerance)
                .multipliedBy(totalYouExchange)
                .div(100)
                .toFixed();
            totalYouExchange = totalYouExchange.plus(userToleranceAmount);
        }

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
    /* Disable Mint TX */
    let currencyOptions;
    if (token === 'TX') {
        currencyOptions = [token];
    } else {
        currencyOptions = [token, 'RESERVE'];
    }

    const renderExchangeInputs = () => {
        return (
            <div className="ExchangeInputs AlignedAndCentered">
                <div className="YouExchange">
                    <InputWithCurrencySelector
                        title={t('global.MintOrRedeemToken_YouExchange', {
                            ns: 'global'
                        })}
                        currencySelected={currencyYouExchange}
                        onCurrencySelect={onChangeCurrencyYouExchange}
                        inputValueInWei={
                            valueYouExchange == 0 ? 0.0 : valueYouExchange
                        }
                        onInputValueChange={onValueYouExchangeChange}
                        currencyOptions={currencyOptions}
                        onValidationStatusChange={onYouExchangeValidityChange}
                        maxValueAllowedInWei={getMaxValues().youExchange}
                        showMaxValueAllowed
                        validate={userAccountIsLoggedIn}
                        showConvertBTC_RBTC_Link={false}
                        isDirty={isDirtyYouExchange}
                    />
                </div>
                <ArrowRightOutlined />
                <div className="YouReceive">
                    <InputWithCurrencySelector
                        title={t('global.MintOrRedeemToken_YouReceive', {
                            ns: 'global'
                        })}
                        validate={userAccountIsLoggedIn}
                        currencyOptions={[token, 'RESERVE']}
                        onValidationStatusChange={onYouReceiveValidityChange}
                        currencySelected={currencyYouReceive}
                        disableCurrencySelector
                        inputValueInWei={
                            valueYouReceive == 0 ? 0.0 : valueYouReceive
                        }
                        maxValueAllowedInWei={getMaxValues().youReceive}
                        showMaxValueAllowed
                        onInputValueChange={onValueYouReceiveChange}
                        showConvertBTC_RBTC_Link={false}
                        isDirty={isDirtyYouReceive}
                    />
                </div>
            </div>
        );
    };

    const [currencyCode, setCurrencyCode] = useState('USD');
    const renderFooter = () => {
        return (
            <div className="MintOrRedeemTokenFooter AlignedAndCentered">
                <div className="ReserveInUSD">
                    <span
                        className={`Conversion ${window.appMode} ${currencyCode}`}
                    >
                        1 {t(`${AppProject}.Tokens_RESERVE_code`, { ns: ns })} ={' '}
                        {auth.isLoggedIn && (
                            <>
                                &nbsp;
                                <LargeNumber
                                    amount={
                                        auth.contractStatusData['bitcoinPrice']
                                    }
                                    {...{ currencyCode }}
                                />
                                <span>&nbsp;USD</span>
                            </>
                        )}
                    </span>
                    <span className="Disclaimer">
                        {t('global.MintOrRedeemToken_AmountMayDiffer')}
                    </span>
                </div>
                <div
                    className={`MainActions ${window.appMode} AlignedAndCentered`}
                >
                    <Button
                        type="default"
                        onClick={clear}
                        style={{ marginRight: 15 }}
                    >
                        {t('global.MintOrRedeemToken_Clear')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={openConfirmationModal}
                        disabled={
                            !youExchangeIsValid ||
                            !youReceiveIsValid ||
                            valueYouExchange == 0 ||
                            valueYouReceive == 0
                        }
                    >
                        {actionIsMint
                            ? t('global.MintOrRedeemToken_Mint')
                            : t('global.MintOrRedeemToken_Redeem')}
                    </Button>
                </div>
            </div>
        );
    };

    const renderConfirmTransactionModal = () => {
        let defaultSliderValue = 0.1;
        if (actionIsMint && currencyYouReceive === 'TX') {
            defaultSliderValue = 0.25;
        }
        return (
            <MintModal
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
                // onConfirm={onConfirmTransaction}
                convertToken={auth.convertToken}
                tolerance={tolerance}
                setTolerance={setTolerance}
                actionIsMint={actionIsMint}
                defaultSliderValue={defaultSliderValue}
                // txHash={currentHash}
                commissionCurrency={commission.currencyCode}
                valueYouExchange={valueYouExchange}
            />
        );
    };

    const contentFee = (type) => (
        <div className="TooltipContent">
            <h4>
                {t(`${AppProject}.exchange.summary.${type}Title`, { ns: ns })}
            </h4>
            <p>
                {t(`${AppProject}.exchange.summary.${type}TooltipText`, {
                    ns: ns
                })}
            </p>
        </div>
    );

    const renderComissionCurrencySwitch = () => {
        const { enoughMOCBalance } = commission;

        if (commissionSwitch !== commission.currencyCode) {
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
                {!isNaN(commission.value) && (
                        <span>{commission.value}</span>
                    ) && (
                        <LargeNumber
                            includeCurrency
                            amount={commission.value}
                            currencyCode={commission.currencyCode}
                        />
                    )}
                <Popover content={tooltip} placement="top">
                    <div className="PayWithMocToken">
                        <Switch
                            disabled={!enoughMOCBalance}
                            checked={commission.currencyCode === 'TG'}
                            onChange={setAllowance}
                            loading={loadingSwitch}
                        />
                    </div>
                </Popover>
            </div>
        );
    };

    const renderInterests = () => {
        if (!interests) return;
        if (!interests.interestValue) return;
        if (new BigNumber(interests.interestValue).lte(0)) return;

        return (
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
    };

    return (
        <>
            {!loading ? (
                <Card
                    title={
                        actionIsMint
                            ? t('global.MintOrRedeemToken_Mint')
                            : t('global.MintOrRedeemToken_Redeem')
                    }
                    // loading={loading}
                    className="Card MintOrRedeemToken"
                    style={
                        style === 'minHeight'
                            ? { minHeight: '375px' }
                            : { height: '100%' }
                    }
                >
                    {auth.convertToken && mocState && (
                        <>
                            {renderExchangeInputs()}
                            {renderComissionCurrencySwitch()}
                            {renderInterests()}
                            {renderFooter()}
                            {renderConfirmTransactionModal()}
                            {renderAllowanceReserveModal()}
                        </>
                    )}
                </Card>
            ) : (
                <Card
                    title={
                        actionIsMint
                            ? t('global.MintOrRedeemToken_Mint')
                            : t('global.MintOrRedeemToken_Redeem')
                    }
                    className="Card MintOrRedeemToken"
                    style={{ height: '100%' }}
                >
                    <Skeleton active={true} paragraph={{ rows: 6 }}></Skeleton>
                </Card>
            )}
        </>
    );
};

export default MintOrRedeemToken;
