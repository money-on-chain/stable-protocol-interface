import { useContext } from 'react'
import { AuthenticateContext } from '../../../Context/Auth'
import { formatVisibleValue, formatValueToContract } from '../../../Lib/Formats'
import { Row, Col, Button } from 'antd';
import './style.scss'
import { Select, Input } from 'antd';
import { currencies as currenciesDetail} from '../../../Config/currentcy';
const { Option } = Select;

export default function CoinSelect(props) {
    const {inputValueInWei = '0', onInputValueChange = () => {}} = props;
    const {accountData} = useContext(AuthenticateContext);
    const {currencyOptions = [], onCurrencySelect = () => {}} = props;
    const optionsFiltered = currenciesDetail.filter(it => currencyOptions.includes(it.value));
    const handleCurrencySelect = newCurrencySelected => {
        onCurrencySelect(newCurrencySelected);
    };

    const maxAmount = 0;
    const tokenName = props.value ? currenciesDetail.find(x => x.value === props.value).label : '';
    const handleValueChange = newValueInEther => {
        const newValueInWei = formatValueToContract(newValueInEther, props.value);
        handleValueChangeInWei(newValueInWei);
    };
    const handleValueChangeInWei = newValueInWei => {
        onInputValueChange(newValueInWei);
    };

    return (
        <div className="CoinSelect">
            <label className="FormLabel">{ props.label }</label>
            <Row>
                <Col span={17}>
                    <Input
                        type="number"
                        placeholder="0.00"
                        style={{ width: '100%' }}
                        value={formatVisibleValue(inputValueInWei, props.value, 'en')}
                        onChange={event => handleValueChange(event.target.value)}
                    />
                </Col>
                <Col span={7}>
                    <Select
                        onChange={handleCurrencySelect}
                        defaultValue={[props.value]}
                        value={[props.value]}
                        style={{ width: '100%' }}
                        disabled={props.disabled}
                    >
                        {
                            optionsFiltered.map((option) =>
                            <Option key={option.value} value={option.value}>
                                <div className="currencyOption">
                                    <img className="currencyImage" src={option.image} alt={option.value} width={30} />
                                    <span>{option.label}</span>
                                </div>
                            </Option>)
                        }
                    </Select>
                </Col>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col span={12}>
                    <a className="FormLabel Selectable">Add total available</a>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <div className="Number">{maxAmount} {tokenName}</div>
                </Col>
            </Row>
        </div>
    )
}