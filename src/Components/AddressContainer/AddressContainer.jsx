import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import {useTranslation} from "react-i18next";
import Copy from '../Page/Copy';
import {AuthenticateContext} from "../../Context/Auth";

const AddressContainer = ({ address, accountData, view }) => {

    async function loadAssets() {
        try {

                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const auth = useContext(AuthenticateContext);
    let addressToShow = '0x0000000000000000000000000000000';
    if (address) addressToShow = auth.toCheckSumAddress(address);
    const [t, i18n]= useTranslation(["global",'moc'])
    return (
        <div className="AddressContainer" style={{ marginTop: view === 'moc' && '5em'}}>
          <QRCode value={accountData.Wallet} size="128" alt="qrCode"  />
            {auth.isLoggedIn && <><br/><Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/></>}
            {!auth.isLoggedIn && <><br/><Copy textToShow={'0x0000...0000'} textToCopy={'0x0000...0000'}/></>}
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