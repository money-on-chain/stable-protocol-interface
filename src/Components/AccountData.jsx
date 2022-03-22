import React from 'react';
import './_style.scss';

function AccountData(props) {
    return (
        <>
            <p>wallet address: {props.Data.Wallet}</p>
            <p>Balance: {props.Data.Balance}</p>
            <p>GasPrice: {props.Data.GasPrice}</p>
            <p>RBTCPrice: {props.Data.RBTCPrice}</p>
        </>
    );
}

export default AccountData;
