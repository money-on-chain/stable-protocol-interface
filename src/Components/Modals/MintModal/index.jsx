import { Button } from 'antd';
import { AuthenticateContext } from '../../../Context/Auth';
import Web3 from 'web3';
import { useState, useContext, useEffect } from 'react';
import { Modal } from 'antd';
import Copy from "../../Page/Copy";
import { currencies as currenciesDetail } from '../../../Config/currentcy';
const BigNumber = require('bignumber.js');
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
    const [showTransaction, setShowTransaction] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const auth = useContext(AuthenticateContext);
    const tokenNameExchange = currencyYouExchange
        ? currenciesDetail.find((x) => x.value === currencyYouExchange).label
        : '';
    const tokenNameReceive = currencyYouReceive
        ? currenciesDetail.find((x) => x.value === currencyYouReceive).label
        : '';
    const tokenName = currencyYouReceive
        ? currenciesDetail.find((x) => x.value === token).label
        : '';

    const [currentHash, setCurrentHash] = useState(null);

    useEffect(() => {
        if (currentHash) {
            const interval = setInterval(() => {
                getTransaction(currentHash)
            }, 15000);
            return () => clearInterval(interval);
        }
    });
    const handleOk = async () => {
        setLoading(true);
        switch (currencyYouReceive) {
            case 'STABLE':
                await auth.DoCMint(props.valueYouExchange, callback);
                break;
            case 'RISKPRO':
                await auth.BPROMint(props.valueYouExchange, callback);
                break;
            case 'RISKPROX':
                await auth.Bprox2Mint(props.valueYouExchange, callback);
                break;
            case 'RESERVE':
                await redeem();
                break;
        }
    };
    const redeem = async () => {
        switch (currencyYouExchange) {
            case 'STABLE':
                await auth.DoCReedem(props.valueYouExchange, callback);
                break;
            case 'RISKPRO':
                await auth.BPROReedem(props.valueYouExchange, callback);
                break;
            case 'RISKPROX':
                    await auth.Bprox2Redeem(props.valueYouExchange, callback);
                    break;
        }
    };

    const getTransaction = async (hash) => {
        let status = auth.getTransactionReceipt(hash);
        if (status) {
            setTransaction(true);
        }
    } ;

    const callback = (error, transactionHash) => {
        setLoading(false);
        setCurrentHash(transactionHash);
        const transaction = auth.getTransactionReceipt(transactionHash);
        if (transaction) {
            setTransaction(transaction);
        }
        setShowTransaction(true);
    };
    const styleExchange = tokenNameExchange === tokenName ? { color } : {};
    const styleReceive = tokenNameReceive === tokenName ? { color } : {};

    return (
        <Modal
            title={title}
            visible={visible}
            confirmLoading={loading}
            footer={null}
        >
            <div className="TabularContent">
                <div className="AlignedAndCentered">
                    <span className="Name Bold">Exchanging</span>
                    <span className="Value Bold" style={styleExchange}>
                        {new BigNumber(props.valueYouExchange).toFixed(4)}
                        {tokenNameExchange}
                    </span>
                </div>
                <div className="AlignedAndCentered">
                    <span className="Name Bold">Receiving</span>
                    <div className="Value">
                        <div className="Bold" style={styleReceive}>
                            {new BigNumber(props.valueYouReceive).toFixed(4)}
                            {tokenNameReceive}
                        </div>
                        <div className="Gray">
                            {new BigNumber(props.valueYouReceiveUSD).toFixed(4)}
                            USD
                        </div>
                    </div>
                </div>

                <div
                    className="AlignedAndCentered"
                    style={{ alignItems: 'start', marginBottom: 20 }}
                >
                    <div className="Name">
                        <div className="Gray">Fee (0.05%)</div>
                        <div className="Legend">
                            This fee will be deduced from the transaction value
                            transferred
                        </div>
                    </div>
                    <span className="Value">0.00 MOC</span>
                </div>
            </div>

            {/*<div className="CoinSelect">*/}
            {/*    <label className="FormLabel">{props.label}</label>*/}
            {/*    <Input*/}
            {/*        type="text"*/}
            {/*        placeholder="Type a comment"*/}
            {/*        style={{ width: '100%', fontSize: 14 }}*/}
            {/*    />*/}
            {/*</div>*/}

            <hr style={{ border: '1px solid lightgray', marginTop: 20 }} />

            <div className="AlignedAndCentered">
                <i className="Gray">
                    Amounts may be different at transaction confirmation
                </i>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1em'}}>
                {showTransaction
                    ? <div style={{ width: '100%' }}>
                        <div>
                            <p style={{ width: '50%', float: 'left' }}>Transaction status</p>
                            <p
                                style={{ textAlign: 'right', color: transaction ? '#09c199' : '#f1a954' }}
                            >{transaction ? 'SUCCESSFUL' : 'PENDING'}</p>
                        </div>
                        <div>
                            <p style={{ width: '50%', float: 'left' }}>Hash</p>
                            <div style={{ textAlign: 'right' }}>
                                <Copy textToShow={currentHash?.slice(0, 5)+'...'+ currentHash?.slice(-4)} textToCopy={currentHash}/>
                            </div>
                        </div>
                        <div style={{ clear: 'both' }}>
                            <a
                                style={{ color: '#09c199' }}
                                href={`https://explorer.testnet.rsk.co/tx/${currentHash}`}
                                target="_blank"
                            >View on the explorer</a>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center'}}>
                            <Button type="primary" onClick={() => {handleComplete(); setCurrentHash(null); setShowTransaction(false)}}>Close</Button>
                        </div>
                    </div>
                    : <>
                    <Button
                        onClick={() => handleClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleOk()}
                    >Confirm</Button>
                </>}  
            </div>
        </Modal>
    );
}
