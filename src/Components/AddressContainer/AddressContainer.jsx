import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import {useTranslation} from "react-i18next";
import Copy from '../Page/Copy';
import {AuthenticateContext} from "../../Context/Auth";
import { config } from './../../Config/config';

const AddressContainer = ({ address, accountData, view }) => {

    const auth = useContext(AuthenticateContext);
    let addressToShow = '0x0000000000000000000000000000000';
    if (address) addressToShow = auth.toCheckSumAddress(address);
    const [t, i18n]= useTranslation(["global",'moc', 'rdoc']);
    const ns = config.environment.AppMode === 'MoC' ? 'moc' : 'rdoc';
    const appMode = config.environment.AppMode;
    return (
        <div className="AddressContainer" style={{ marginTop: view === 'moc' && '5em'}}>
          <QRCode value={accountData.Wallet} size="128" alt="qrCode"  />
            {auth.isLoggedIn && <><br/><Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/></>}
            {!auth.isLoggedIn && <><br/><Copy textToShow={'0x0000...0000'} textToCopy={'0x0000...0000'}/></>}
          <a className="RNSLink" href={window.rnsUrl} target="_blank" rel="noopener noreferrer">
            {t(`${appMode}.rns.register`, {ns: ns})}
         </a>
        </div>
    );
};

export default AddressContainer;

AddressContainer.propTypes = {
  address: PropTypes.string.isRequired
};