import React, {useContext} from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import {useTranslation} from "react-i18next";
import Copy from '../Page/Copy';
import {AuthenticateContext} from "../../Context/Auth";

const AddressContainer = ({ address, accountData }) => {
    const auth = useContext(AuthenticateContext);
    let addressToShow = '0x0000000000000000000000000000000';
    if (window.nodeManager && address) addressToShow = window.nodeManager.toCheckSumAddress(address);
    const [t, i18n]= useTranslation(["global",'moc'])
    return (
        <div className="AddressContainer">
          <QRCode value={accountData.Wallet} size="128" alt="qrCode"  />
            {auth.isLoggedIn && <Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/>}
            {!auth.isLoggedIn && <Copy textToShow={'0x0000...0000'} textToCopy={'0x0000...0000'}/>}
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