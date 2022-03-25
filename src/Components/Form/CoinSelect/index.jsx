import { Row, Col, Button } from 'antd';
import './style.scss'
import { Select, Input } from 'antd';
import { currencies as currenciesDetail} from '../../../Config/currentcy';
const { Option } = Select;

export default function CoinSelect(props) {
    const {currencyOptions = [], onCurrencySelect = () => {}} = props;
    const optionsFiltered = currenciesDetail.filter(it => currencyOptions.includes(it.value));
    const handleCurrencySelect = newCurrencySelected => {
        onCurrencySelect(newCurrencySelected);
    };

    return (
        <div className="CoinSelect">
            <label className="FormLabel">{ props.label }</label>
            <Row>
                <Col span={17}>
                    <Input type="number" placeholder="0.00" style={{ width: '100%' }} />
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
                    <div className="Number">0.005222 RBTC</div>
                </Col>
            </Row>
        </div>
    )
}