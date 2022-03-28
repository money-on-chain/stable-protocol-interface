import { Row, Col, Input, Select } from 'antd';
import { useState } from 'react';
import {Modal} from 'antd'
import { currencies as currenciesDetail} from '../../../Config/currentcy';
import { formatVisibleValue } from '../../../Lib/Formats';

export default function MintModal(props) {

    const {
        title = '',
        visible = false,
        handleClose = () => {},
        handleComplete = () => {},
        color = '',
        currencyYouExchange = '',
        currencyYouReceive = '',
        token = ''
    } = props;
    const [loading, setLoading] = useState(false);

    const tokenNameExchange = currencyYouExchange ? currenciesDetail.find(x => x.value === currencyYouExchange).label : '';
    const tokenNameReceive = currencyYouReceive ? currenciesDetail.find(x => x.value === currencyYouReceive).label : '';
    const tokenName = currencyYouReceive ? currenciesDetail.find(x => x.value === token).label : '';

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleComplete();
        }, 2000);
    };

    const styleExchange = tokenNameExchange === tokenName ? {color} : {};
    const styleReceive = tokenNameReceive === tokenName ? {color} : {};

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            confirmLoading={loading}
            onCancel={handleClose}
            cancelText="Cancel"
            okText="Confirm"
        >
            <div className="TabularContent">
                <div className="AlignedAndCentered">
                    <span className="Name Bold">Exchanging</span>
                    <span className="Value Bold" style={styleExchange}>0.000000 {tokenNameExchange}</span>
                </div>
                <div className="AlignedAndCentered">
                    <span className="Name Bold">Receiving</span>
                    <div className="Value">
                        <div className="Bold" style={styleReceive}>0.000000 {tokenNameReceive}</div>
                        <div className="Gray">0.00 USD</div>
                    </div>
                </div>

                <div className="AlignedAndCentered" style={{alignItems: 'start'}}>
                    <div className="Name">
                        <div className="Gray">Fee (0.05%)</div>
                        <div className="Legend">
                            This fee will be deduced from the transaction value transferred
                        </div>
                    </div>
                    <span className="Value">0.00 MOC</span>
                </div>
            </div>

            <div className="CoinSelect">
                <label className="FormLabel">{ props.label }</label>
                    <Input
                        type="text"
                        placeholder="Type a comment"
                        style={{ width: '100%', fontSize: 14 }}
                    />
            </div>

            <hr style={{border: '1px solid lightgray', marginTop: 20}}/>

            <div className="AlignedAndCentered">
                <i className="Gray">Amounts may be different at transaction confirmation</i>
            </div>

        </Modal>
    )
}