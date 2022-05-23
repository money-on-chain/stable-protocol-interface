import { Modal } from 'antd';
import { Button } from 'antd';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { AuthenticateContext } from '../../../Context/Auth';
import {btcInSatoshis, toNumberFormat} from "../../../Helpers/math-helpers";
import React, {Fragment} from "react";


export default function Step2(props) {

    // const {visible = false, handleClose = () => {}} = props;

    return (
        <Fragment>


            <div className='conversion-limits'>
                <div className="alert-message">
                    <WarningOutlined />
                    <p>Double check that you are entering the correct BTC destination address.</p>
                </div>
            </div>

            <div className={'ModalUpTopContainer'}>
                <div className="InputAddressContainer separation">
                    <p className="InputAddressLabel">Destination BTC Addresss</p>
                    <form className="ant-form ant-form-horizontal">
                        <div className="ant-row ant-form-item">
                            <div className="ant-col ant-form-item-control">
                                <div className="ant-form-item-control-input">
                                    <div className="ant-form-item-control-input-content">
                                        <input placeholder="Destination BTC Addresss" className="" type="text" value=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className='conversion-limits'>
                <b>Conversion limits</b>

                <p> Min: 0000000000000 BTC</p>


                <p>Max: 0000000000 BTC</p>


                <p>Fee: 000000000</p>

            </div>

            <div className={'inputAmount'}>
                <input type="number" placeholder="Enter rBTC amount to send" className="valueInput " value="0.000000"/>
                <div>
                    <img src={window.location.origin + '/Moc/icon-reserve.svg'} alt={'sdssd'} width={30}/>
                    <span>RBTC</span>
                </div>
            </div>


            {/*<div className="BalanceSelectorContainer">*/}
            {/*    <div className="ant-radio-group ant-radio-group-outline">*/}
            
            {/*        <label className="ant-radio-button-wrapper">*/}
            {/*            <span className="ant-radio-button">*/}
            {/*                <input type="radio" className="ant-radio-button-input" value="10"/>*/}
            {/*                    <span className="ant-radio-button-inner"></span>*/}
            {/*            </span>*/}
            {/*            <span>10%</span>*/}
            {/*        </label>*/}
            
            {/*        <label className="ant-radio-button-wrapper">*/}
            {/*            <span className="ant-radio-button">*/}
            {/*                <input type="radio" className="ant-radio-button-input" value="25"/>*/}
            {/*                <span className="ant-radio-button-inner"></span>*/}
            {/*            </span>*/}
            {/*            <span>25%</span>*/}
            {/*        </label>*/}
            
            {/*        <label className="ant-radio-button-wrapper">*/}
            {/*            <span className="ant-radio-button">*/}
            {/*                <input type="radio" className="ant-radio-button-input" value="50"/>*/}
            {/*                <span className="ant-radio-button-inner"></span>*/}
            {/*            </span>*/}
            {/*            <span>50%</span>*/}
            
            {/*        </label>*/}
            
            {/*        <label className="ant-radio-button-wrapper">*/}
            {/*            <span className="ant-radio-button">*/}
            {/*                <input type="radio" className="ant-radio-button-input" value="75"/>*/}
            {/*                <span className="ant-radio-button-inner"></span>*/}
            {/*            </span>*/}
            {/*            <span>75%</span>*/}
            {/*        </label>*/}
            
            {/*        <label className="ant-radio-button-wrapper">*/}
            {/*            <span className="ant-radio-button">*/}
            {/*                <input type="radio" className="ant-radio-button-input" value="100"/>*/}
            {/*                    <span className="ant-radio-button-inner"></span>*/}
            {/*                </span>*/}
            {/*            <span>100%</span>*/}
            {/*        </label>*/}
            {/*    </div>*/}
            
            {/*    <div className="AlignedAndCentered"><span className="setValueToMax">Available balance</span>*/}
            {/*        <div className="text-align-right">*/}
            {/*            <div><span className="" >0.014902</span> RBTC</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            
            {/*</div>*/}

            
            
            
            {/*<input type="number" placeholder="Enter rBTC amount to send"/>*/}


            {/*<form className="ant-form ant-form-horizontal">*/}
            {/*    <div className="ant-row ant-form-item ant-form-item-has-success">*/}
            {/*        <div className="ant-col ant-form-item-control">*/}
            {/*            <div className="ant-form-item-control-input">*/}
            {/*                <div className="ant-form-item-control-input-content">*/}
            {/*                    <div className="MainContainer">*/}
            {/*                        <input type="number" placeholder="Enter rBTC amount to send" className="valueInput " value="0.000000"/>*/}
            {/*                        <div className="SelectCurrency disabled">*/}
            {/*                            <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow ant-select-disabled">*/}
            {/*                                <div className="ant-select-selector">*/}
            {/*                                    <span className="ant-select-selection-search">*/}
            {/*                                        <input disabled="" autoComplete="off" type="search" className="ant-select-selection-search-input"*/}
            {/*                                               role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="rc_select_5_list" aria-autocomplete="list"*/}
            {/*                                               aria-controls="rc_select_5_list" aria-activedescendant="rc_select_5_list_0" readOnly="" unselectable="on"*/}
            {/*                                               value="" id="rc_select_5"      />*/}
            {/*                                    </span>*/}
            {/*                                    <span className="ant-select-selection-item">*/}
            {/*                                        <div className="currencyOption"><img className="currencyImage" src="/moc/icon-reserve.svg" alt="RBTC"/>RBTC</div>*/}
            {/*                                    </span>*/}
            {/*                                </div>*/}
            {/*                                <span className="ant-select-arrow" unselectable="on" aria-hidden="true"    >*/}
            {/*                                    <span role="img" aria-label="down" className="anticon anticon-down ant-select-suffix">*/}
            {/*                                        <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">*/}
            {/*                                            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">*/}

            {/*                                            </path>*/}
            {/*                                        </svg>*/}
            {/*                                    </span>*/}
            {/*                                </span>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</form>*/}




            {/*<div className="MainContainer">*/}
            {/*    <input type="number" placeholder="Enter rBTC amount to send" className="valueInput " value="0.000000"/>*/}
            {/*    <div className="SelectCurrency disabled">*/}
            {/*        <div className="ant-select ant-select-lg ant-select-single ant-select-show-arrow ant-select-disabled">*/}
            {/*            <div className="ant-select-selector">*/}
            {/*                <span className="ant-select-selection-search">*/}
            {/*                    <input disabled="" autoComplete="off" type="search" className="ant-select-selection-search-input"*/}
            {/*                           role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-owns="rc_select_5_list"*/}
            {/*                           aria-autocomplete="list" aria-controls="rc_select_5_list" aria-activedescendant="rc_select_5_list_0" readOnly="" unselectable="on" value=""*/}
            {/*                           id="rc_select_5"/>*/}
            {/*                </span>*/}
            {/*                <span className="ant-select-selection-item">*/}
            {/*                    <div className="currencyOption">*/}
            {/*                        <img className="currencyImage" src="/moc/icon-reserve.svg" alt="RBTC"/>RBTC*/}
            {/*                    </div>*/}
            {/*                </span>*/}
            {/*            </div>*/}
            {/*            <span className="ant-select-arrow" unselectable="on" aria-hidden="true">*/}
            {/*                <span role="img" aria-label="down" className="anticon anticon-down ant-select-suffix">*/}
            {/*                    <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="down" width="1em"*/}
            {/*                         height="1em" fill="currentColor" aria-hidden="true">*/}
            {/*                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z">*/}

            {/*                        </path>*/}
            {/*                    </svg>*/}
            {/*                </span>*/}
            {/*            </span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}




        </Fragment>

    );
}

