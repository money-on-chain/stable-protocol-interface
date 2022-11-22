
import { Switch, Button } from 'antd';
import React, { useContext, useState, useEffect } from 'react';

import {useProjectTranslation} from "../../../../helpers/translations";
import {config} from "../../../../projects/config";



export default function ModalExchange() {
    const [t, i18n, ns] = useProjectTranslation();
    const AppProject = config.environment.AppProject;

    return (
        <div className="modal-exchange">
            <div className="modal-exchange-header">
                <h1>Exchange</h1>
                <div className="modal-close">
                    <i className="icon-modal-close"></i>
                </div>
            </div>

            <div className="modal-exchange-content">
                <div className="exchange-content-fields">
                    <div className="exchange-swap-from">

                        <select className="exchange-select-token">
                            <option key="FLIPM" value="FlipMega">
                                <div className="exchange-currency-option">
                                    <i className="icon-token-tc"></i>
                                    <span className="exchange-currency-caption">FlipMega</span>
                                </div>
                            </option>
                        </select>

                        <input className="exchange-input-value" type="text" id="select-token-from" name="select-token-from" placeholder="123.4" />

                        <div className="exchange-token-balance">
                            <span className="exchange-token-balance-value">
                                Balance: 1234.12
                            </span>
                            <a href="#" className="exchange-token-balance-add-total">Add total available</a>


                        </div>


                    </div>
                    <div className="exchange-swap-arrow">
                        <i className="icon-swap-arrow"></i>
                    </div>

                    <div className="exchange-swap-to">

                        <select className="exchange-select-token">
                            <option key="DOC" value="Dollar on Chain">
                                <div className="exchange-currency-option">
                                    <i className="icon-token-tp_0"></i>
                                    <span className="exchange-currency-caption">Dollar on chain</span>
                                </div>
                            </option>
                        </select>

                        <input className="exchange-input-value" type="text" id="select-token-from" name="select-token-from" placeholder="123.4" />

                        <div className="exchange-token-balance">
                            <span className="exchange-token-balance-value">
                                Balance: 1234.12
                            </span>

                            <a href="#" className="exchange-token-balance-add-total">Add total available</a>

                        </div>


                    </div>

                </div>

                <div className="exchange-content-info">
                    <div className="exchange-content-info-prices">
                        <div className="exchange-content-info-conversion_0">1 FlipMega ≈ 1.0323 Dollar On Chain</div>
                        <div className="exchange-content-info-conversion_1">1 Dollar On CHain ≈ 0.9323 FlipMega</div>
                    </div>

                    <div className="exchange-content-info-fees">
                        <div className="exchange-content-info-fees-frame">
                            <div className="exchange-content-info-fees-frame-t">
                                Fee (0.15%) ≈ 0.0000342 rBTC
                            </div>

                            <div className="exchange-content-info-fees-frame-switch">
                                <Switch
                                    disabled={false}
                                    checked={true}
                                />

                            </div>
                        </div>
                        <div className="exchange-content-info-fees-balance">
                            This fee will be deducted from the transaction value transfered. Amounts my be different at transaction confirmation.
                        </div>

                    </div>

                    <div className="exchange-content-info-cta">
                        <span className="exchange-content-info-cta-exchanging">
                            Exchanging ≈ 132.15 USD
                        </span>

                        <Button
                            type="primary"
                            className="exchange-content-info-cta-button"
                        > Exchange </Button>

                    </div>
                </div>

            </div>
        </div>
    )
}