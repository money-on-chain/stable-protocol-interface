import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';

import {useTranslation} from "react-i18next";

import Copy from '../Page/Copy';

const AddressContainer = ({ address, accountData }) => {
    let addressToShow = '0x0000000000000000000000000000000';
    if (window.nodeManager && address) addressToShow = window.nodeManager.toCheckSumAddress(address);
    const [t, i18n]= useTranslation(["global",'moc'])
    return (
        <div className="AddressContainer">
          <QRCode value={accountData.Wallet} size="128" alt="qrCode"  />
          <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/>
          <a className="RNSLink" href={window.rnsUrl} target="_blank" rel="noopener noreferrer">
            {t(`MoC.rns.register`, {ns: 'moc'})}
         </a>
        </div>
    );
};

export default AddressContainer;

AddressContainer.propTypes = {
  address: PropTypes.string.isRequired
};