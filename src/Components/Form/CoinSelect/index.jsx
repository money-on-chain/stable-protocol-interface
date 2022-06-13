import {useContext, useEffect, useState} from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import { DebounceInput } from 'react-debounce-input';
import {
    formatVisibleValue,
    formatValueToContract,
    formatValueWithContractPrecision,
    formatLocalMap2
} from '../../../Lib/Formats';
import { Row, Col, Button, Tooltip } from 'antd';
import './style.scss';
import { Select, Input } from 'antd';
import { currencies as currenciesDetail } from '../../../Config/currentcy';
import { useTranslation } from "react-i18next";
import './style.scss';
const BigNumber = require('bignumber.js');
const { Option } = Select;

export default function CoinSelect(props) {
    const auth = useContext(AuthenticateContext);
    const { docBalance = 0, bproBalance = 0, bprox2Balance = 0, mocBalance = 0 } = auth.UserBalanceData ? auth.UserBalanceData : {};
    const { inputValueInWei = '0.0001', onInputValueChange = () => { }, validate, className, title } = props;
    const {
        currencyOptions = [],
        onCurrencySelect = () => { },
        disabled = false
    } = props;
    const optionsFiltered = currenciesDetail.filter((it) =>
        currencyOptions.includes(it.value)
    );
    const handleCurrencySelect = (newCurrencySelected) => {
        onCurrencySelect(newCurrencySelected);
    };
    const [disabledSelect, setDisabledSelect] = useState(false);
    const [inputValidation, setInputValidation] = useState({ validateStatus: 'success' });
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setDirty(false);
        setInputValidation({ validateStatus: 'success' });
      }, []);

    useEffect(() => {
        if (validate && dirty) {
            // setInputValidation(validateValue(inputValueInWei, maxValueAllowedInWei));
          }
        if (
            inputValueInWei !==
            document.getElementById('inputValue' + props.value).value.toString()
        ) {
            document.getElementById('inputValue' + props.value).value =
                new BigNumber(inputValueInWei).toFixed(4).toString();
        }
        if (props.value === 'MOC') {
            setDisabledSelect(true);
        }
    }, [inputValueInWei]);

    const tokenName = props.value
        ? currenciesDetail.find((x) => x.value === props.value).label
        : '';
    const maxAmount = () => {
        switch (tokenName) {
            case 'RBTC':
                return new BigNumber(auth.accountData?.Balance).toFixed(6);
            case 'DOC':
                if(auth.isLoggedIn){
                    return docBalance;
                }else{
                    return (0).toFixed(2)
                }
            case 'BPRO':
                if(auth.isLoggedIn){
                    return bproBalance;
                }else{
                    return (0).toFixed(6)
                }
            case 'BTCX':
                if(auth.isLoggedIn){
                    return bprox2Balance;
                }else{
                    return (0).toFixed(6)
                }
            case 'MOC':
                if(auth.isLoggedIn){
                    return mocBalance;
                }else{
                    return (0).toFixed(2)
                }
            default:
                return 0.0;
        }
    };
    const handleValueChange = (newValueInEther) => {
        console.log(auth.accountData);
        /* if (
            auth.accountData.Balance < newValueInEther &&
            props.value === 'RESERVE'
        ) {
            newValueInEther = auth.accountData?.Balance;
            document.getElementById('inputValue' + props.value).value =
                new BigNumber(newValueInEther).toFixed(4).toString();
        }*/
        onInputValueChange(newValueInEther);
    };

    const addTotalAvailable = () => {
        onInputValueChange(parseFloat(maxAmount()));
    };

    

    const [t, i18n] = useTranslation(["global", 'moc'])

    return (
        <div className={`InputWithCurrencySelector ${className || ''}`}>
            <h3>{title}</h3>
            <Row>
                <Col
                    xs={{ span: 14 }}
                    sm={{ span: 14 }}
                    md={{ span: 16 }}
                    lg={{ span: 16 }}
                >
                    <div className="MainContainer">
                        <Tooltip> {/* title={formatValueWithContractPrecision(inputValueInWei, [props.value])}> */}
                            <Input
                                type="number"
                                id={`inputValue${props.value}`}
                                value={inputValueInWei}
                                max={auth.accountData?.Balance}
                                step="any"
                                style={{ width: '100%' }}
                                disabled={disabled}
                                onChange={(event) =>
                                    handleValueChange(event.target.value)
                            }
                        />
                        </Tooltip>
                    </div>
                    </Col>
                    <Col
                        xs={{ span: 10 }}
                        sm={{ span: 10 }}
                        md={{ span: 8 }}
                        lg={{ span: 8 }}
                    >
                        <div className={`SelectCurrency ${disabledSelect || disabled ? 'disabled' : ''}`}>
                            <Select
                                onChange={handleCurrencySelect}
                                defaultValue={[props.value]}
                                value={[props.value]}
                                style={{ width: '100%' }}
                                disabled={disabled || disabledSelect}
                            >
                                {optionsFiltered.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        <div className="currencyOption">
                                            <img
                                                className="currencyImage"
                                                src={option.image}
                                                alt={option.value}
                                                width={30}
                                            />
                                            <span>{option.label}</span>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
                <Col span={12}>
                    {disabled === false && (
                        <a
                            className="FormLabel Selectable"
                            onClick={addTotalAvailable}
                        >
                            {t('global.InputWithCurrencySelector_AddTotalAvailable', { ns: 'global' })}
                        </a>
                    )}
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Tooltip title={Number(maxAmount())?.toLocaleString(formatLocalMap2[i18n.languages[0]], {
                        minimumFractionDigits: 18,
                        maximumFractionDigits: 18
                    })}>
                        <div className="">
                            {Number(maxAmount()).toLocaleString(formatLocalMap2[i18n.languages[0]], {
                                        minimumFractionDigits: tokenName === 'DOC' ? 2 : 6,
                                        maximumFractionDigits: tokenName === 'DOC' ? 2 : 6
                            })} {tokenName}
                        </div>
                    </Tooltip>
                </Col>
            </Row>
        </div>
    );
}
