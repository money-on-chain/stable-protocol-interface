import { useEffect } from 'react';
import { AuthenticateContext } from '../../../Context/Auth';
import {
    formatVisibleValue,
    formatValueToContract
} from '../../../Lib/Formats';
import { Row, Col, Button } from 'antd';
import './style.scss';
import { Select, Input } from 'antd';
import { currencies as currenciesDetail } from '../../../Config/currentcy';
const BigNumber = require('bignumber.js');
const { Option } = Select;

export default function CoinSelect(props) {
    const { inputValueInWei = '0.0001', onInputValueChange = () => {} } = props;
    const {
        currencyOptions = [],
        onCurrencySelect = () => {},
        disabled = false
    } = props;
    const optionsFiltered = currenciesDetail.filter((it) =>
        currencyOptions.includes(it.value)
    );
    const handleCurrencySelect = (newCurrencySelected) => {
        onCurrencySelect(newCurrencySelected);
    };

    useEffect(() => {
        if (
            inputValueInWei !=
            document.getElementById('inputValue' + props.value).value.toString()
        ) {
            document.getElementById('inputValue' + props.value).value =
                new BigNumber(inputValueInWei).toFixed(4).toString();
        }
    }, [inputValueInWei]);

    const tokenName = props.value
        ? currenciesDetail.find((x) => x.value === props.value).label
        : '';
    const maxAmount = () => {
        switch (tokenName) {
            case 'RBTC':
                return new BigNumber(props.AccountData.Balance).toFixed(4);
            case 'DOC':
                return props.UserBalanceData['docBalance'];
            case 'BPRO':
                return props.UserBalanceData['bproBalance'];
            case 'BTCX':
                return props.UserBalanceData['bprox2Balance'];
            default:
                return 0.0;
        }
    };
    const handleValueChange = (newValueInEther) => {
        if (
            props.AccountData.Balance < newValueInEther &&
            props.value == 'RESERVE'
        ) {
            newValueInEther = props.AccountData.Balance;
            document.getElementById('inputValue' + props.value).value =
                new BigNumber(newValueInEther).toFixed(4).toString();
        }
        onInputValueChange(newValueInEther);
    };

    const addTotalAvailable = () => {
        onInputValueChange(parseFloat(maxAmount()));
    };

    return (
        <div className="CoinSelect">
            <label className="FormLabel">{props.label}</label>
            <Row>
                <Col
                    xs={{ span: 14 }}
                    sm={{ span: 14 }}
                    md={{ span: 16 }}
                    lg={{ span: 18 }}
                >
                    <Input
                        type="number"
                        id={`inputValue${props.value}`}
                        value={inputValueInWei}
                        max={props.AccountData.Balance}
                        step="any"
                        style={{ width: '100%' }}
                        disabled={disabled}
                        onChange={(event) =>
                            handleValueChange(event.target.value)
                        }
                    />
                </Col>
                <Col
                    xs={{ span: 10 }}
                    sm={{ span: 10 }}
                    md={{ span: 8 }}
                    lg={{ span: 6 }}
                >
                    <Select
                        onChange={handleCurrencySelect}
                        defaultValue={[props.value]}
                        value={[props.value]}
                        style={{ width: '100%' }}
                        disabled={disabled}
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
                </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
                <Col span={12}>
                    {disabled === false && (
                        <a
                            className="FormLabel Selectable"
                            onClick={addTotalAvailable}
                        >
                            Add total available
                        </a>
                    )}
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <div className="Number">
                        {maxAmount()} {tokenName}
                    </div>
                </Col>
            </Row>
        </div>
    );
}
