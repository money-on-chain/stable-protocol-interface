import React from 'react';
import './_style.scss';

import { t } from '../../../../api/helpers/i18nHelper'


const AlertLabelAmounts = () => (
  <div className="AlertLabel AlertMaxAmount">
    <img src={process.env.REACT_APP_PUBLIC_URL+"global/icon-alert.svg"} alt="Alert Icon" />
    <div className="AlertText">
      <p>
        <strong>{t('settings.beCareful')}</strong>
      </p>
      <p>{t('settings.alertMaxAmountExceededLongDescription')}.</p>
    </div>
  </div>
);

export default AlertLabelAmounts;
