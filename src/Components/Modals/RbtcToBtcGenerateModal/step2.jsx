import { Modal } from 'antd';
import { Button } from 'antd';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { AuthenticateContext } from '../../../Context/Auth';
import {btcInSatoshis, toNumberFormat} from "../../../Helpers/math-helpers";
import React, {Fragment, useState} from "react";
import Step3 from "./step3";


function Step2(props) {

    // const {visible = false, handleClose = () => {}} = props;

    const [currentStep, setCurrentStep]= useState(2);
    const [rbtcAmount, setRbtcAmount]= useState(0.0000014);
    const [rbtcAddress, setrbtcAddress]= useState('mpqWMKpeMRvjM2PPYZVLit1HX5FNoWH8mW');

    const handleSubmit = event => {
        event.preventDefault();
        // 👇️ value of input field
        console.log('handleClick 👉️', rbtcAmount);
        setCurrentStep(3)
    };

    const handleChange = event => {
        setRbtcAmount(event.target.value);
        console.log('value is:', rbtcAmount);
    };

    const handleChangeAddress = event => {
        setrbtcAddress(event.target.value);
        console.log('value is:', rbtcAddress);
    };

    return (
        <div>
        {(() => {
            switch (currentStep) {
                case 2:
                    return <Fragment>
                        <div className="alert-message-modal">
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
                                                    <input placeholder="Destination BTC Addresss" className="" type="text" onChange={handleChangeAddress} value={rbtcAddress}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className='conversion-limits'>
                            <b>Conversion limits</b>
                            <p> Min: {props.min} BTC</p>
                            <p>Max: {props.max} BTC</p>
                            <p>Fee: {props.fee}</p>
                        </div>

                        <div className={'inputAmount'}>
                            <input type="number" onChange={handleChange} placeholder="Enter rBTC amount to send" className="valueInput" value={rbtcAmount}/>
                            <div>
                                <img src={window.location.origin + '/Moc/icon-reserve.svg'} alt={'sdssd'} width={30}/>
                                <span>RBTC </span>
                            </div>
                        </div>


                        <div className="BalanceSelectorContainer">
                            <div className="ant-radio-group ant-radio-group-outline">

                                <label className="ant-radio-button-wrapper ant-radio-button-wrapper-fc">
                        <span className="ant-radio-button">
                            {/*<input type="radio" className="ant-radio-button-input" value="10"/>*/}
                            <span className="ant-radio-button-inner"></span>
                        </span>
                                    <span>10%</span>
                                </label>

                                <label className="ant-radio-button-wrapper">
                        <span className="ant-radio-button">
                            <input type="radio" className="ant-radio-button-input" value="25"/>
                            <span className="ant-radio-button-inner"></span>
                        </span>
                                    <span>25%</span>
                                </label>

                                <label className="ant-radio-button-wrapper">
                        <span className="ant-radio-button">
                            <input type="radio" className="ant-radio-button-input" value="50"/>
                            <span className="ant-radio-button-inner"></span>
                        </span>
                                    <span>50%</span>

                                </label>

                                <label className="ant-radio-button-wrapper ">
                        <span className="ant-radio-button">
                            <input type="radio" className="ant-radio-button-input" value="75"/>
                            <span className="ant-radio-button-inner"></span>
                        </span>
                                    <span>75%</span>
                                </label>

                                <label className="ant-radio-button-wrapper ant-radio-button-wrapper-lc">
                        <span className="ant-radio-button">
                            <input type="radio" className="ant-radio-button-input" value="100"/>
                                <span className="ant-radio-button-inner"></span>
                            </span>
                                    <span>100%</span>
                                </label>
                            </div>

                            <div className="AlignedAndCentered mt-0">
                                <span className="setValueToMax">Available balance</span>
                                <div className="text-align-right">
                                    <div className={'setValueToMax'}><span>0.014902</span> RBTC</div>
                                </div>
                            </div>
                        </div>

                        <div className="GenerateBTC">
                            {/*<Button type="primary" onClick={handleSubmit()}>*/}
                            <Button type="primary" onClick={(event) => handleSubmit(event)}>
                                <b>Continue</b>
                            </Button>
                        </div>
                    </Fragment>
                case 3:
                    return <Fragment>
                        <Step3 rbtcAmount={rbtcAmount} rbtcAddress={rbtcAddress}></Step3>
                    </Fragment>
            }
        })()}
        </div>
    );
}

export default Step2