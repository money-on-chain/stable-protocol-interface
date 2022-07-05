import React from 'react';
import { TAPi18n } from 'meteor/tap:i18n';
import './_style.scss';

import { t } from '../../../../api/helpers/i18nHelper'


const AlertLabelSettings = () => (
  <div className="AlertLabel">
    <img src={window.imagePath + "/icon-alert.svg"} alt="Alert Icon" />
    <div className="AlertText">
      <p>
        <strong>{t('settings.beCareful')}</strong>
      </p>
      <p>{t('settings.alertAddress')}.</p>
    </div>
  </div>
);

export default AlertLabelSettings;
