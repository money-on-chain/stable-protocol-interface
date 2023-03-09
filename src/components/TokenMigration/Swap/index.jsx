import React, { useContext, useState, useEffect } from 'react';
import { useProjectTranslation } from '../../../helpers/translations';
import { Button } from 'antd';
import './style.scss';
import {AuthenticateContext} from "../../../context/Auth";

import TokenMigratePNG from './../../../assets/icons/tokenmigrate.png';
import { LargeNumber } from '../../LargeNumber';
import Copy from '../../Page/Copy';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';


const SwapToken = (props) => {

    const {
        onCloseModal
    } = props;

    const [status, setStatus] = useState('SUBMIT');
    const [txID, setTxID] = useState('0x0000000000000000000000000000000000000000');

    const [t, i18n, ns]= useProjectTranslation();
    const auth = useContext(AuthenticateContext);

    const onClose = () => {
        setStatus('SUBMIT');
        onCloseModal()
    };

    const onSubmit = () => {
        setStatus('CONFIRM');
    };

    const onSuccess = () => {
        setStatus('TOKEN-MIGRATION-SUCCESS');
    };

    const TruncateAddress = (address) => {
        return address.substring(0, 6) +
               '...' +
               address.substring(address.length - 4, address.length);
    }

    const onTokenMigration = () => {
        // First change status to sign tx
        setStatus('TOKEN-MIGRATION-SIGN')
        auth.interfaceMigrateToken(onTransactionTokenMigration, onReceiptTokenMigration).then((value => {
            onSuccess();
        }))
    };

    const onTransactionTokenMigration = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('TOKEN-MIGRATION-WAITING')
        console.log("On transaction token migration: ", transactionHash)
        setTxID(transactionHash)
    };

    const onReceiptTokenMigration = async (receipt) => {
        // Tx is mined ok proceed with operation transaction
        console.log("On receipt token migration: ", receipt)
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
    };

    const onAuthorize = () => {
        // First change status to sign tx
        //amountAllowance = new BigNumber(1000) //Number.MAX_SAFE_INTEGER.toString()
        setStatus('ALLOWANCE-SIGN')

        const allowanceAmount = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.tpLegacyBalance))
        auth.interfaceAllowUseTokenMigrator(allowanceAmount, onTransactionAuthorize, onReceiptAuthorize).then((value => {
            onTokenMigration();
        }))
    };

    const onTransactionAuthorize = (transactionHash) => {
        // Tx receipt detected change status to waiting
        setStatus('ALLOWANCE-WAITING')
        console.log("On transaction authorize: ", transactionHash)
        setTxID(transactionHash)
    };

    const onReceiptAuthorize = async (receipt) => {
        // Tx is mined ok proceed with operation transaction
        console.log("On receipt authorize: ", receipt)
        const filteredEvents = auth.interfaceDecodeEvents(receipt);
    };

    const onConfirm = () => {
        switch (status) {
            case 'SUBMIT':
                onSubmit();
                break;
            case 'CONFIRM':
                onAuthorize();
                break;
            case 'TOKEN-MIGRATION-SUCCESS':
                onClose();
                break;
            default:
                onSubmit();
        }

    };

    let title
    let btnLabel = 'Confirm'
    let btnDisable = false
    switch (status) {
        case 'SUBMIT':
            title = 'IMPORTANT NOTICE';
            btnLabel = 'Confirm'
            break;
        case 'CONFIRM':
            title = 'Operation Detail';
            btnLabel = 'Exchange'
            const tpLegacyBalance = new BigNumber(Web3.utils.fromWei(auth.userBalanceData.tpLegacyBalance))
            if (tpLegacyBalance.eq(0)) btnDisable = true
            break;
        case 'ALLOWANCE-SIGN':
        case 'ALLOWANCE-WAITING':
        case 'ALLOWANCE-ERROR':
            title = 'TOKEN AUTHORIZATION';
            break;
        case 'TOKEN-MIGRATION-SIGN':
        case 'TOKEN-MIGRATION-WAITING':
        case 'TOKEN-MIGRATION-ERROR':
            title = 'TOKEN MIGRATION';
            break;
        case 'TOKEN-MIGRATION-SUCCESS':
            title = 'TOKEN MIGRATION';
            btnLabel = 'Close'
            break;
        default:
            title = 'IMPORTANT NOTICE';
            btnLabel = 'Confirm'
    }

    return (
        <div className="Content">
            <div className="Title">{title}</div>
            <div className="Body">
                {status === 'SUBMIT' && (<div>
                    <p>RIF Dollar (RDOC) is changing to RIF USD (USDRIF). You need to swap your RIF Dollars to operate with the udpated DAPP.
                        You will no longer be able to see your RDOC balance in the DAPP. </p>

                    <p>The exchange rate for the swap is <strong>1 RDOC = 1 USDRIF</strong>. You will not be charged a transaction fee.</p>

                    <p>Clicking Confirm button your wallet will ask you to sign the transaction. All your RDOC balance will be converted to USDRIF</p>
                </div>)}

                {status === 'CONFIRM' && (<div>
                    <div className="TokenIcon">
                        <img className={''} src={TokenMigratePNG} alt="Token Migrate" />
                    </div>
                    <div className="Summary">
                        <div className="Exchanging">
                            <div className="Label">Exchanging </div>
                            <div className="Amount">
                                <div className="Value"><LargeNumber amount={auth.userBalanceData.tpLegacyBalance} currencyCode={"TP"} /></div>
                                <div className="Token">RDOC</div>
                            </div>
                        </div>
                        <div className="Receiving">
                            <div className="Label">Receiving </div>
                            <div className="Amount">
                                <div className="Value"><LargeNumber amount={auth.userBalanceData.tpLegacyBalance} currencyCode={"TP"} /></div>
                                <div className="Token">USDRIF</div>
                            </div>
                        </div>

                    </div>


                </div>)}

                {status === 'ALLOWANCE-SIGN' && (<div>
                    <div className="tx-logo-status">
                        <i className="icon-signifier"></i>
                    </div>
                    <p className="Center">Please, sign the allowance authorization transaction using your wallet.</p>
                </div>)}

                {status === 'ALLOWANCE-WAITING' && (<div>{/*ALLOWANCE-WAITING*/}
                    <div className="tx-logo-status">
                        <i className="icon-tx-waiting rotate"></i>
                    </div>
                    <p>Please, wait while the allowance authorization is mined in the blockchain. Once it’s done, the transaction will be sent to your wallet.</p>
                    <p>Transaction Hash <Copy textToShow={TruncateAddress(txID)} textToCopy={txID} typeUrl={'tx'}/></p>
                </div>)}

                {status === 'ALLOWANCE-ERROR' && (<div> {/*ALLOWANCE-ERROR*/}
                    <div className="tx-logo-status">
                        <i className="icon-tx-error"></i>
                    </div>
                    <p className="Center">Operation Failed!.</p>
                    <p className="Center"> Transaction Hash <Copy textToShow={TruncateAddress(txID)} textToCopy={txID} typeUrl={'tx'}/></p>
                </div>)}

                {status === 'TOKEN-MIGRATION-SIGN' && (<div>
                    <div className="tx-logo-status">
                        <i className="icon-signifier"></i>
                    </div>
                    <p className="Center">Please, sign the token migration transaction using your wallet.</p>
                </div>)}

                {status === 'TOKEN-MIGRATION-WAITING' && (<div> {/*TOKEN-MIGRATION-WAITING*/}
                    <div className="tx-logo-status">
                        <i className="icon-tx-waiting rotate"></i>
                    </div>
                    <p>Please, wait while the token migration transaction is mined in the blockchain.</p>
                    <p>Transaction Hash <Copy textToShow={TruncateAddress(txID)} textToCopy={txID} typeUrl={'tx'}/></p>

                </div>)}

                {status === 'TOKEN-MIGRATION-SUCCESS' && (<div> {/* TOKEN-MIGRATION-SUCCESS */}
                    <div className="tx-logo-status">
                        <i className="icon-tx-success"></i>
                    </div>
                    <p className="Center">Operation successful.</p>
                    <p className="Center">Transaction Hash <Copy textToShow={TruncateAddress(txID)} textToCopy={txID} typeUrl={'tx'}/></p>
                </div>)}

                {status === 'TOKEN-MIGRATION-ERROR' && (<div>
                    <div className="tx-logo-status">
                        <i className="icon-tx-error"></i>
                    </div>
                    <p className="Center">Operation Failed!.</p>
                    <p className="Center">Transaction Hash <Copy textToShow={TruncateAddress(txID)} textToCopy={txID} typeUrl={'tx'}/></p>
                </div>)}

            </div>
            <div className="Actions">
                
                {(status !== 'TOKEN-MIGRATION-SUCCESS' &&
                  status !== 'ALLOWANCE-WAITING' &&
                  status !== 'TOKEN-MIGRATION-WAITING' &&
                  status !== 'TOKEN-MIGRATION-ERROR' &&
                  status !== 'ALLOWANCE-ERROR')  && (<Button className="" onClick={onClose}>Cancel</Button>)}
                {(status === 'SUBMIT' ||
                  status === 'CONFIRM' ||
                  status === 'TOKEN-MIGRATION-SUCCESS')  && (<Button className="ConfirmBtn" type="primary" disabled={btnDisable} onClick={onConfirm}>{btnLabel}</Button>)}

            </div>
        </div>
    );
};

export default SwapToken;
