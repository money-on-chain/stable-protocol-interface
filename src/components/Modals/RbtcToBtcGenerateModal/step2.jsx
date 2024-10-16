import { Button } from 'antd';
import React, { Fragment, useContext, useState, useRef } from 'react';
import { validate, getAddressInfo } from 'bitcoin-address-validation';

import { AuthenticateContext } from '../../../context/Auth';
import Step3 from './step3';
import BigNumber from 'bignumber.js';
import { useProjectTranslation } from '../../../helpers/translations';
import { config } from '../../../projects/config';

import { ReactComponent as LogoIconAttention } from '../../../assets/icons/icon-atention.svg';
import { ReactComponent as LogoIconReserve } from '../../../assets/icons/icon-reserve2.svg';

const VALID_BTC_TYPE_ADDRESS = ['p2pkh', 'p2sh', 'p2wpkh', 'p2wsh']; // Taproot not compatible 'p2tr'

function Step2(props) {
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

    const amountInput = useRef();
    const { auth } = props;

    const [currentStep, setCurrentStep] = useState(2);
    const [rbtcAmount, setRbtcAmount] = useState('');
    const [rbtcAddress, setrbtcAddress] = useState('');

    const [errorRbtcAmount, setErrorRbtcAmount] = useState(true);
    const [errorRbtcAddress, setErrorRbtcAddress] = useState(true);

    let btcEnvironment;
    if (process.env.REACT_APP_ENVIRONMENT_CHAIN_ID === '30') {
        btcEnvironment = 'mainnet';
    } else {
        btcEnvironment = 'testnet';
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // 👇️ value of input field

        setErrorRbtcAmount(!validateAmount(rbtcAmount));
        setErrorRbtcAddress(!validateBTCAddress(rbtcAddress));

        if (errorRbtcAmount === false && errorRbtcAddress === false) {
            setCurrentStep(3);
        }
    };
    const { visible = false, handleClose = () => {} } = props;

    const validateAmount = (amount) => {
        let isValid;
        if (new BigNumber(amount).gt(0)) {
            isValid = true;
        } else {
            isValid = false;
        }
        return isValid;
    };

    const handleChangeAmount = (event) => {
        if (!validateAmount(event.target.value)) return;

        setRbtcAmount(event.target.value);
        if (event.target.value.length < 7 || event.target.value.length > 7) {
            const multiple = 1.0;
            setRbtcAmount((event.target.value * multiple).toFixed(6));
            event.target.value = (event.target.value * multiple).toFixed(6);
            setErrorRbtcAmount(false);
        } else {
            setErrorRbtcAmount(true);
        }
    };

    const validateBTCAddress = (btcAddress) => {
        let isValid = false;
        if (validate(btcAddress)) {
            const infoAddress = getAddressInfo(btcAddress);
            if (
                infoAddress &&
                VALID_BTC_TYPE_ADDRESS.includes(infoAddress.type) &&
                btcEnvironment === infoAddress.network
            ) {
                isValid = true;
            }
        }
        return isValid;
    };

    const handleChangeAddress = (event) => {
        const isValid = validateBTCAddress(event.target.value);
        setErrorRbtcAddress(!isValid);
        setrbtcAddress(event.target.value);
    };

    const { accountData } = useContext(AuthenticateContext);
    const [accountDataRbtc, setAccountDataRbtc] = useState(
        Number(new BigNumber(accountData.Balance)).toFixed(6)
    );

    const percent = (value) => {
        amountInput.current.value = (value * accountDataRbtc).toFixed(6);
        setRbtcAmount((value * accountDataRbtc).toFixed(6));
        setErrorRbtcAmount(false);
    };

    return (
        <div>
            {(() => {
                switch (currentStep) {
                    case 2:
                        return (
                            <Fragment>
                                <div className="alert-message-modal">
                                    <div className="alert-message">
                                        <LogoIconAttention
                                            width="27"
                                            height="23"
                                            alt="img"
                                        />
                                        <p>
                                            {t(
                                                `${AppProject}.fastbtc.pegOut.alert`,
                                                { ns: ns }
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className={'ModalUpTopContainer'}>
                                    <div className="InputAddressContainer separation">
                                        <p className="InputAddressLabel">
                                            {t(
                                                `${AppProject}.fastbtc.pegOut.inputAddressLabel`,
                                                { ns: ns }
                                            )}{' '}
                                        </p>
                                        <form className="ant-form ant-form-horizontal">
                                            <div className="ant-row ant-form-item">
                                                <div className="ant-col ant-form-item-control">
                                                    <div className="ant-form-item-control-input">
                                                        <div className="ant-form-item-control-input-content">
                                                            <input
                                                                placeholder={t(
                                                                    `${AppProject}.fastbtc.pegOut.inputAddressPlaceholder`,
                                                                    { ns: ns }
                                                                )}
                                                                className=""
                                                                type="text"
                                                                onChange={
                                                                    handleChangeAddress
                                                                }
                                                                value={
                                                                    rbtcAddress
                                                                }
                                                            />
                                                            {errorRbtcAddress && (
                                                                <Fragment>
                                                                    <br />
                                                                    <p
                                                                        className={
                                                                            'error'
                                                                        }
                                                                    >
                                                                        {t(
                                                                            `${AppProject}.fastbtc.pegOut.invalidBtcAddress`,
                                                                            {
                                                                                ns: ns
                                                                            }
                                                                        )}
                                                                    </p>
                                                                </Fragment>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="conversion-limits">
                                    <b>
                                        {t(
                                            `${AppProject}.fastbtc.pegOut.limitsTitle`,
                                            { ns: ns }
                                        )}
                                    </b>
                                    <p>
                                        {' '}
                                        {t(
                                            `${AppProject}.fastbtc.pegOut.limitsMin`,
                                            { ns: ns }
                                        )}
                                        {props.min} RBTC
                                    </p>
                                    <p>
                                        {' '}
                                        {t(
                                            `${AppProject}.fastbtc.pegOut.limitsMax`,
                                            { ns: ns }
                                        )}
                                        {props.max} RBTC
                                    </p>
                                    <p>
                                        {' '}
                                        {t(
                                            `${AppProject}.fastbtc.pegOut.limitsFee`,
                                            { ns: ns }
                                        )}
                                        {props.fee}
                                    </p>
                                </div>

                                <div className={'inputAmount'}>
                                    <input
                                        type="number"
                                        ref={amountInput}
                                        onBlur={handleChangeAmount}
                                        onMouseLeave={handleChangeAmount}
                                        placeholder={t(
                                            `${AppProject}.fastbtc.pegOut.inputAmountPlaceholder`,
                                            { ns: ns }
                                        )}
                                        className="valueInput"
                                    />
                                    <div className="fastBtcIconBtc__container">
                                        <LogoIconReserve
                                            alt={'img'}
                                            className="fastBtcIconBtc"
                                        />
                                        <span line-height="0.11">RBTC </span>
                                    </div>
                                </div>
                                {errorRbtcAmount && (
                                    <Fragment>
                                        <p className={'error'}>
                                            {t(
                                                `${AppProject}.fastbtc.pegOut.errorRequiredField`,
                                                { ns: ns }
                                            )}
                                        </p>
                                    </Fragment>
                                )}
                                <div className="BalanceSelectorContainer">
                                    <div className="ant-radio-group ant-radio-group-outline">
                                        <label className="ant-radio-button-wrapper ant-radio-button-wrapper-fc">
                                            <span className="ant-radio-button">
                                                <input
                                                    type="radio"
                                                    className="ant-radio-button-input"
                                                    value="10"
                                                    onClick={(event) =>
                                                        percent(0.1)
                                                    }
                                                />
                                                <span className="ant-radio-button-inner"></span>
                                            </span>
                                            <span>10%</span>
                                        </label>

                                        <label className="ant-radio-button-wrapper">
                                            <span className="ant-radio-button">
                                                <input
                                                    type="radio"
                                                    className="ant-radio-button-input"
                                                    value="25"
                                                    onClick={(event) =>
                                                        percent(0.25)
                                                    }
                                                />
                                                <span className="ant-radio-button-inner"></span>
                                            </span>
                                            <span>25%</span>
                                        </label>

                                        <label className="ant-radio-button-wrapper">
                                            <span className="ant-radio-button">
                                                <input
                                                    type="radio"
                                                    className="ant-radio-button-input"
                                                    value="50"
                                                    onClick={(event) =>
                                                        percent(0.5)
                                                    }
                                                />
                                                <span className="ant-radio-button-inner"></span>
                                            </span>
                                            <span>50%</span>
                                        </label>

                                        <label className="ant-radio-button-wrapper ">
                                            <span className="ant-radio-button">
                                                <input
                                                    type="radio"
                                                    className="ant-radio-button-input"
                                                    value="75"
                                                    onClick={(event) =>
                                                        percent(0.75)
                                                    }
                                                />
                                                <span className="ant-radio-button-inner"></span>
                                            </span>
                                            <span>75%</span>
                                        </label>

                                        <label className="ant-radio-button-wrapper ant-radio-button-wrapper-lc">
                                            <span className="ant-radio-button">
                                                <input
                                                    type="radio"
                                                    className="ant-radio-button-input"
                                                    value="100"
                                                    onClick={(event) =>
                                                        percent(1)
                                                    }
                                                />
                                                <span className="ant-radio-button-inner"></span>
                                            </span>
                                            <span>100%</span>
                                        </label>
                                    </div>

                                    <div className="AlignedAndCentered mt-0">
                                        <span className="setValueToMax">
                                            Available balance
                                        </span>
                                        <div className="text-align-right">
                                            <div className={'setValueToMax'}>
                                                <span>{accountDataRbtc}</span>{' '}
                                                RBTC
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="GenerateBTC">
                                    {/*<Button type="primary" onClick={handleSubmit()}>*/}
                                    <Button
                                        type="primary"
                                        onClick={(event) => handleSubmit(event)}
                                    >
                                        <b>
                                            {' '}
                                            {t(
                                                `${AppProject}.fastbtc.pegOut.ctaContinue`,
                                                { ns: ns }
                                            )}
                                        </b>
                                    </Button>
                                </div>
                            </Fragment>
                        );
                    case 3:
                        return (
                            <Fragment>
                                <Step3
                                    auth={auth}
                                    handleClose={handleClose}
                                    rbtcAmount={rbtcAmount}
                                    rbtcAddress={rbtcAddress}
                                ></Step3>
                            </Fragment>
                        );
                    default:
                        return <Fragment>Invalid step</Fragment>;
                }
            })()}
        </div>
    );
}

export default Step2;
