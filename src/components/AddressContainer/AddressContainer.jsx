import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import QRCode from 'react-qr-code';
import Copy from '../Page/Copy';
import {AuthenticateContext} from "../../context/Auth";
import { config } from '../../projects/config';
import { useProjectTranslation } from '../../helpers/translations';

const AddressContainer = ({ address, accountData, view }) => {
    const auth = useContext(AuthenticateContext);
    const [t, i18n, ns]= useProjectTranslation();
    const AppProject = config.environment.AppProject;
    return (
        <div className="AddressContainer" style={{ marginTop: view === 'moc' && '5em'}}>
          <QRCode value={accountData.Wallet} size="128" alt="qrCode"  />
            {auth.isLoggedIn && <><br/><Copy textToShow={accountData.truncatedAddress} textToCopy={accountData.Wallet}/></>}
            {!auth.isLoggedIn && <><br/><Copy textToShow={'0x0000...0000'} textToCopy={'0x0000...0000'}/></>}
          <a className="RNSLink" href={config.environment.rns.url} target="_blank" rel="noopener noreferrer">
            {t(`${AppProject}.rns.register`, {ns: ns})}
         </a>
        </div>
    );
};

export default AddressContainer;

AddressContainer.propTypes = {
  address: PropTypes.string.isRequired
};