/* eslint-disable default-case */
/* eslint-disable react/jsx-no-target-blank */
import { Button, Collapse, Slider } from 'antd';
import { AuthenticateContext } from '../../../context/Auth';
import React, { useState, useContext, useEffect } from 'react';
import { Modal, notification } from 'antd';
import BigNumber from 'bignumber.js';

import { convertAmount } from '../../../helpers/exchangeManagerHelper';
import { getExchangeMethod } from '../../../helpers/exchangeHelper';
import {
    formatValueToContract,
    formatValueWithContractPrecision
} from '../../../helpers/Formats';
import Copy from '../../Page/Copy';
import { currencies as currenciesDetail } from '../../../helpers/currency';
import { LargeNumber } from '../../LargeNumber';
import { LargeNumberF2 } from '../../LargeNumberF2';
import { useProjectTranslation } from '../../../helpers/translations';

import IconDownArrow from './../../../assets/icons/d-arrow.png';
import IconTorque from './../../../assets/icons/torq.png';
import IconStatusPending from './../../../assets/icons/status-pending.png';
import IconStatusSuccess from './../../../assets/icons/status-success.png';
import IconStatusError from './../../../assets/icons/status-error.png';

export default function MintModal(props) {
    const isLoggedIn = true; //userAccountIsLoggedIn() && Session.get('rLoginConnected');
    const {
        exchanging,
        receiving,
        title = '',
        handleClose = () => {},
        handleComplete = () => {},
        color,
        token,
        fee,
        interests,
        visible,
        onCancel,
        onConfirm,
        convertToken,
        actionIsMint,
        tolerance,
        setTolerance,
        defaultSliderValue,
        commissionCurrency,
        valueYouExchange
    } = props;
    /* Disabled confirm button when not connected */
    const { address } = true; //window;
    var btnDisable = false;
    if (!address || !isLoggedIn) {
        btnDisable = true;
    }
    const [loading, setLoading] = useState(false);
    const [showTransaction, setShowTransaction] = useState(false);
    const [transaction, setTransaction] = useState(false);
    const [txtTransaction, setTxtTransaction] = useState('PENDING');
    const auth = useContext(AuthenticateContext);
    const tokenNameExchange = exchanging.currencyCode
        ? currenciesDetail.find((x) => x.value === exchanging.currencyCode)
              .label
        : '';
    const tokenNameReceive = receiving.currencyCode
        ? currenciesDetail.find((x) => x.value === receiving.currencyCode).label
        : '';

    const [currentHash, setCurrentHash] = useState(null);
    const [comment, setComment] = useState('');
    const [showError, setShowError] = useState(false);
    const [t, i18n, ns] = useProjectTranslation();
    const { appMode } = 'Moc';

    let userComment = '';
    let userTolerance = '';

    useEffect(() => {
        setInterval(() => {
            if (currentHash) {
                getTransaction(currentHash);
            }
        }, 15000);
    }, []);

    useEffect(() => {
        setComment('');
        if (document.querySelectorAll('.ant-modal')[0] !== undefined) {
            document
                .querySelectorAll('.ant-modal-wrap')[0]
                .addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
        }
    }, [visible]);

    const receivingInUSD = convertAmount(
        receiving.currencyCode,
        'USD',
        receiving.value,
        convertToken
    );
    /* View */
    const renderAmount = (name, amountAndCurrencyCode, classElement) => {
        return (
            <div
                className={`AlignedAndCentered Amount mrb-0 color-08374F ${classElement}`}
                style={{ display: 'flex' }}
            >
                {/*<span className="Name">{name}</span>*/}
                <span className={`Value  ${appMode}`}>
                    <LargeNumberF2
                        currencyCode={amountAndCurrencyCode.currencyCode}
                        amount={amountAndCurrencyCode.value}
                        includeCurrency
                    />
                </span>
            </div>
        );
    };

    const confirmButton = async ({ comment, tolerance }) => {
        // Check if there are enough spendable balance to pay
        // take in care amount to pay gas fee
        const minimumUserBalanceToOperate = '120000000000000';
        const userSpendable = await auth.getSpendableBalance(window.address);

        let minimumBalance = new BigNumber(minimumUserBalanceToOperate);
        let uTolerance = 0;
        if (actionIsMint) {
            minimumBalance = minimumBalance.plus(
                new BigNumber(exchanging.value)
            );
            uTolerance = tolerance;
        }

        // You have not enough balance abort
        if (minimumBalance.gt(new BigNumber(userSpendable))) {
            setShowError(true);
            return;
        }
        // onConfirm({ comment, tolerance: uTolerance });
        userComment = comment;
        userTolerance = uTolerance;

        /* const { appMode } = window;
        // In rrc20 mode show allowance when need it
        if (appMode === 'RRC20') {
          const userAllowance = await window.nodeManager.getReserveAllowance(window.address);
          if (valueYouExchange > userAllowance) {
            allowanceReserveModalShow(true);
            return;
          }
        } */
        onConfirmTransactionFinish();
    };

    const onConfirmTransactionFinish = async () => {
        const exchangeMethod = getExchangeMethod(
            exchanging.currencyCode,
            receiving.currencyCode,
            `${commissionCurrency}_COMMISSION`
        );
        let userAmount = formatValueWithContractPrecision(
            valueYouExchange,
            'RESERVE'
        );
        const userToleranceAmount = formatValueToContract(
            new BigNumber(userTolerance)
                .multipliedBy(userAmount)
                .div(100)
                .toFixed(),
            'RESERVE'
        );
        if (fee.enoughMOCBalance == true) {
            userAmount =
                userAmount -
                window.web3.utils.fromWei(
                    (fee.percentage * 100).toString(),
                    'ether'
                );
        }
        const userToleranceFormat = new BigNumber(userTolerance).toFixed();
        //exchangeMethod(userAmount, userToleranceAmount, callback).then((res) => console.log(res, callback))
        //auth.interfaceMintRiskPro(userAmount, userToleranceFormat, callback);
        auth.interfaceExchangeMethod(
            exchanging.currencyCode,
            receiving.currencyCode,
            userAmount,
            userToleranceFormat,
            onTransaction,
            onReceipt,
            onError
        );
    };

    /*
    const callback = (error, transactionHash) => {
        setLoading(false);
        setCurrentHash(transactionHash);
        setShowTransaction(true);
        getTransaction(transactionHash);
    };
    */

    const onTransaction = (transactionHash) => {
        setLoading(false);
        setCurrentHash(transactionHash);
        setShowTransaction(true);
        getTransaction(transactionHash);
    };

    const onReceipt = async (receipt) => {
        auth.loadContractsStatusAndUserBalance();
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
    };

    const onError = async (error) => {
        console.log("On transaction error:", error)
        setLoading(false);
        setTxtTransaction('ERROR');
        notification['error']({
            message: t('global.RewardsError_Title'),
            description: t('global.RewardsError_Message'),
            duration: 10
        });
    };

    const renderError = () => {
        return (
            <div className="noEnoughBalance">
                {t('global.ConfirmTransactionModal_Error_not_enough')}
            </div>
        );
    };

    const getTransaction = async (hash) => {
        await auth
            .getTransactionReceipt(hash, () => {
                setTransaction(false);
                setTxtTransaction('PENDING');
            })
            .then((res) => {
                if (res) {
                    setShowTransaction(true);
                    setTransaction(true);
                    setTxtTransaction('SUCCESSFUL');
                    if (auth != null && auth !== undefined) {
                        auth.loadContractsStatusAndUserBalance();
                    }
                }
            })
            .catch((e) => {
                setTransaction(false);
                setTxtTransaction('ERROR');
                notification['error']({
                    message: t('global.RewardsError_Title'),
                    description: t('global.RewardsError_Message'),
                    duration: 10
                });
            });
    };

    const changeTolerance = (newTolerance) => {
        setTolerance(newTolerance);
        setShowError(false);
    };

    const cancelButton = () => {
        setShowError(false);
        setTransaction(false);
        setTxtTransaction('PENDING');
        setCurrentHash(null);
        setShowTransaction(false);
        onCancel();
    };

    const markStyle = {
        style: {
            color: '#707070',
            fontSize: 10
        }
    };

    const priceVariationToleranceMarks = {
        0: { ...markStyle, label: '0.0%' },
        1: { ...markStyle, label: '1%' },
        2: { ...markStyle, label: '2%' },
        5: { ...markStyle, label: '5%' },
        10: { ...markStyle, label: '10%' }
    };

    const styleExchange =
        tokenNameExchange === exchanging.currencyCode ? { color } : {};
    const styleReceive =
        tokenNameReceive === receiving.currencyCode ? { color } : {};

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            className="ConfirmModalTransaction"
            footer={null}
            onCancel={cancelButton}
            title={t('global.Operation_Details_Title')}
        >
            <div className="TabularContent">
                {renderAmount(
                    t('global.ConfirmTransactionModal_Exchanging'),
                    exchanging,
                    'AmountExchanging'
                )}
                <LargeNumber
                    currencyCode={'USD'}
                    amount={receivingInUSD}
                    includeCurrency
                    className="color-08374F"
                />
                {showError && renderError()}
                <div className={'text-align-center'}>
                    <img width={30} height={30} src={IconDownArrow} alt="sa" />
                </div>
                {renderAmount(
                    t('global.ConfirmTransactionModal_Receiving'),
                    receiving,
                    'AmountReceiving'
                )}
                <LargeNumber
                    currencyCode={'USD'}
                    amount={receivingInUSD}
                    includeCurrency
                    className="color-08374F"
                />
                <hr style={{ border: '1px solid #08374F', opacity: '0.5' }} />
                <div className="Name font-size-14">
                    <div className="MOCFee mrb-0">
                        <div className={`AlignedAndCentered Amount mrb-0`}>
                            <span className="Name color-08374F">{`${t(
                                'global.ConfirmTransactionModal_MOCFee'
                            )} (${
                                fee?.percentage !== undefined
                                    ? fee.percentage
                                    : 0.15
                            }%)`}</span>
                            <span className={`Value ${appMode}`}>
                                {auth.isLoggedIn && (
                                    <LargeNumber
                                        currencyCode={fee?.currencyCode}
                                        amount={fee?.value}
                                        includeCurrency
                                        className="color-08374F"
                                    />
                                )}
                                {!auth.isLoggedIn && <span>0.000000 RBTC</span>}
                            </span>
                        </div>
                    </div>
                    <div className="MOCFee mrb-0">
                        <div
                            className={`AlignedAndCentered Amount mrb-0 mrt-0`}
                        >
                            <span className="Name color-08374F">{`Interest`}</span>
                            <span className={`Value ${appMode}`}>
                                {auth.isLoggedIn && (
                                    <LargeNumber
                                        currencyCode={fee?.currencyCode}
                                        amount={fee?.value}
                                        includeCurrency
                                        className="color-08374F"
                                    />
                                )}
                                {!auth.isLoggedIn && <span>0.000000 RBTC</span>}
                            </span>
                        </div>
                    </div>
                    {interests &&
                        interests?.interestValue &&
                        interests?.interestValue.gt(0) && (
                            <div className="MOCFee">
                                <div className={`AlignedAndCentered Amount`}>
                                    <span className="Name">{`${t(
                                        'global.ConfirmTransactionModal_Interests'
                                    )} (${interests?.interestRate}%)`}</span>
                                    <span className={`Value ${appMode}`}>
                                        <LargeNumber
                                            currencyCode={'RESERVE'}
                                            amount={interests.interestValue}
                                            includeCurrency
                                        />
                                    </span>
                                </div>
                            </div>
                        )}
                    <div className="Legend-s1">
                        {t('global.ConfirmTransactionModal_MOCFee_Disclaimer')}
                        <br />
                        {t(
                            'global.ConfirmTransactionModal_AmountMayDifferDisclaimer'
                        )}
                    </div>
                </div>
                {!showTransaction && (
                    <div className={'div-price-v'}>
                        <Collapse className="CollapseTolerance">
                            <Collapse.Panel
                                showArrow={false}
                                header={
                                    <div className="PriceVariationSetting">
                                        <img
                                            width={17}
                                            height={17}
                                            src={IconTorque}
                                            alt="ssa"
                                        />
                                        <span className="SliderText color-08374F font-size-12">
                                            {t(
                                                'global.CustomizePrize_VariationToleranceSettingsTitle'
                                            )}
                                        </span>
                                    </div>
                                }
                            >
                                <div className="PriceVariationContainer">
                                    <h4>
                                        {t(
                                            'global.CustomizePrize_VariationToleranceTitle'
                                        )}
                                    </h4>
                                    <Slider
                                        className="SliderControl"
                                        marks={priceVariationToleranceMarks}
                                        defaultValue={defaultSliderValue}
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        dots={false}
                                        onChange={(val) => changeTolerance(val)}
                                    />
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    </div>
                )}
                <div
                    className="AlignedAndCentered"
                    style={{ alignItems: 'start' }}
                >
                    <div className="Name">
                        {/*<div className="MOCFee">*/}
                        {/*  <div className={`AlignedAndCentered Amount`}>*/}
                        {/*    <span className="Name">{`${t('global.ConfirmTransactionModal_MOCFee')} (${(fee?.percentage!==undefined)? fee.percentage: 0.15}%)`}</span>*/}
                        {/*    <span className={`Value ${appMode}`}>*/}
                        {/*      {auth.isLoggedIn &&*/}
                        {/*      <LargeNumber*/}
                        {/*        currencyCode={fee?.currencyCode}*/}
                        {/*        amount={fee?.value}*/}
                        {/*        includeCurrency*/}
                        {/*      />}*/}
                        {/*      {!auth.isLoggedIn && <span>0.000000 RBTC</span>}*/}
                        {/*    </span>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                        {interests &&
                            interests?.interestValue &&
                            interests?.interestValue.gt(0) && (
                                <div className="MOCFee">
                                    <div
                                        className={`AlignedAndCentered Amount`}
                                    >
                                        <span className="Name">{`${t(
                                            'global.ConfirmTransactionModal_Interests'
                                        )} (${
                                            interests?.interestRate
                                        }%)`}</span>
                                        <span className={`Value ${appMode}`}>
                                            <LargeNumber
                                                currencyCode={'RESERVE'}
                                                amount={interests.interestValue}
                                                includeCurrency
                                            />
                                        </span>
                                    </div>
                                </div>
                            )}
                    </div>
                    {/*<span className="Value">0.00 MOC</span>*/}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {showTransaction ? (
                    <div style={{ width: '100%' }}>
                        <div>
                            <p className={'Transaction_ID'}>
                                {t('global.Transaction_ID')}
                            </p>
                            <div style={{ textAlign: 'right' }}>
                                <Copy
                                    textToShow={
                                        currentHash?.slice(0, 5) +
                                        '...' +
                                        currentHash?.slice(-4)
                                    }
                                    textToCopy={currentHash}
                                />
                            </div>
                        </div>
                        <div>
                            {(() => {
                                switch (txtTransaction) {
                                    case 'PENDING':
                                        return (
                                            <>
                                                <p>
                                                    <img
                                                        src={IconStatusPending}
                                                        width={50}
                                                        height={50}
                                                        alt="pending"
                                                        className="img-status rotate"
                                                    />
                                                </p>
                                                <p
                                                    className={
                                                        'Transaction_confirmation'
                                                    }
                                                >
                                                    {t(
                                                        'global.Transaction_confirmation'
                                                    )}
                                                </p>
                                            </>
                                        );
                                    case 'SUCCESSFUL':
                                        return (
                                            <>
                                                <p>
                                                    <img
                                                        width={50}
                                                        height={50}
                                                        src={IconStatusSuccess}
                                                        alt="successful"
                                                        className={'img-status'}
                                                    />
                                                </p>
                                                <p
                                                    className={
                                                        'Operation_successful'
                                                    }
                                                >
                                                    {t(
                                                        'global.Operation_successful'
                                                    )}
                                                </p>
                                            </>
                                        );
                                    default:
                                        return (
                                            <>
                                                <p>
                                                    <img
                                                        width={50}
                                                        height={50}
                                                        src={IconStatusError}
                                                        alt="error"
                                                        className={'img-status'}
                                                    />
                                                </p>
                                                <p
                                                    className={
                                                        'Operation_failed'
                                                    }
                                                >
                                                    {t(
                                                        'global.Operation_failed'
                                                    )}
                                                </p>
                                            </>
                                        );
                                }
                            })()}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                className={'width-120'}
                                type="primary"
                                onClick={() => {
                                    cancelButton();
                                    setCurrentHash(null);
                                    setShowTransaction(false);
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Button
                            type="primary"
                            disabled={!auth.isLoggedIn}
                            onClick={() =>
                                confirmButton({ comment, tolerance })
                            }
                        >
                            {t('global.Bttn_Continue')}
                        </Button>
                    </>
                )}
            </div>
        </Modal>
    );
}
