import { Button } from 'antd';
import { AuthenticateContext } from '../../../Context/Auth';
import React, {Fragment, useContext, useState,useRef} from "react";
import Step3 from "./step3";
const BigNumber = require('bignumber.js');


function Step2(props) {

    // const {visible = false, handleClose = () => {}} = props;

    const amountInput = useRef();
    const {auth}= props;
    const {web3}= auth;

    const [currentStep, setCurrentStep]= useState(2);
    const [rbtcAmount, setRbtcAmount]= useState("");
    const [rbtcAddress, setrbtcAddress]= useState('');

    const [errorRbtcAmount, setErrorRbtcAmount]= useState(true);
    const [errorRbtcAddress, setErrorRbtcAddress]= useState(true);

    const handleSubmit = event => {
        event.preventDefault();
        // 👇️ value of input field
        if (rbtcAmount.trim().length != 0) {
            setErrorRbtcAmount(false)
        }
        if(rbtcAddress.trim().length != 0) {
            setErrorRbtcAddress(false)
        }

        if( errorRbtcAmount == false && errorRbtcAddress == false){
            setCurrentStep(3)
        }

    };
    const {visible = false, handleClose = () => {}} = props;

    const handleChangeAmount= event => {
        setRbtcAmount(event.target.value);
        if( (event.target.value).length < 7  || (event.target.value).length > 7){
            const multiple= 1.000000
            console.log((event.target.value * multiple).toFixed(6))
            setRbtcAmount((event.target.value * multiple).toFixed(6));
            event.target.value = (event.target.value * multiple).toFixed(6);
            setErrorRbtcAmount(false)
        }

        if (rbtcAmount.trim().length != 0) {
            setErrorRbtcAmount(false)
        }
        if(rbtcAddress.trim().length != 0) {
            setErrorRbtcAddress(false)
        }
        console.log('value is:', rbtcAmount);
    };

    const handleChangeAddress = event => {
        setrbtcAddress(event.target.value);
        if(rbtcAddress.trim().length != 0) {
            setErrorRbtcAddress(false)
        }
        if (rbtcAmount.trim().length != 0) {
            setErrorRbtcAmount(false)
        }
        console.log('value is:', rbtcAddress);
    };

    const {accountData}= useContext(AuthenticateContext);
    const [accountDataRbtc, setAccountDataRbtc]= useState(Number(new BigNumber(accountData.Balance)).toFixed(6));

    const percent= (value)=>{
        amountInput.current.value= (value * accountDataRbtc).toFixed(6)
        setRbtcAmount((value * accountDataRbtc).toFixed(6));
        setErrorRbtcAmount(false)
    }

    return (
        <div>
            {(() => {
                switch (currentStep) {
                    case 2:
                        return <Fragment>
                            <div className="alert-message-modal">
                                <div className="alert-message">
                                    <img src={`${window.location.origin+'/icon-atention.svg'}`} alt="" />
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
                                                        {errorRbtcAddress && <Fragment><br/><p className={'error'}>This field is required</p></Fragment>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className='conversion-limits'>
                                <b>Conversion limits</b>
                                <p>Min: {props.min} RBTC</p>
                                <p>Max: {props.max} RBTC</p>
                                <p>Fee: {props.fee}</p>
                            </div>

                            <div className={'inputAmount'}>
                                <input type="number" ref={amountInput}  onBlur={handleChangeAmount} onMouseLeave={handleChangeAmount} placeholder="Enter rBTC amount to send" className="valueInput"/>
                                <div>
                                    <img src={window.location.origin + '/Moc/icon-reserve.svg'} alt={'sdssd'} width={30}/>
                                    <span>RBTC </span>
                                </div>
                            </div>
                            {errorRbtcAmount && <Fragment><p className={'error'}>This field is required</p></Fragment>}
                            <div className="BalanceSelectorContainer">
                                <div className="ant-radio-group ant-radio-group-outline">
                                    <label className="ant-radio-button-wrapper ant-radio-button-wrapper-fc">
                                    <span className="ant-radio-button">
                                        <input type="radio" className="ant-radio-button-input" value="10" onClick= {(event) => percent(0.1)}/>
                                        <span className="ant-radio-button-inner"></span>
                                    </span>
                                        <span>10%</span>
                                    </label>

                                    <label className="ant-radio-button-wrapper">
                                    <span className="ant-radio-button">
                                        <input type="radio" className="ant-radio-button-input" value="25" onClick= {(event) => percent(0.25)}/>
                                        <span className="ant-radio-button-inner"></span>
                                    </span>
                                        <span>25%</span>
                                    </label>

                                    <label className="ant-radio-button-wrapper">
                                    <span className="ant-radio-button">
                                        <input type="radio" className="ant-radio-button-input" value="50" onClick= {(event) => percent(0.5)}/>
                                        <span className="ant-radio-button-inner"></span>
                                    </span>
                                        <span>50%</span>
                                    </label>

                                    <label className="ant-radio-button-wrapper ">
                                    <span className="ant-radio-button">
                                        <input type="radio" className="ant-radio-button-input" value="75" onClick= {(event) => percent(0.75)}/>
                                        <span className="ant-radio-button-inner"></span>
                                    </span>
                                        <span>75%</span>
                                    </label>

                                    <label className="ant-radio-button-wrapper ant-radio-button-wrapper-lc">
                                    <span className="ant-radio-button">
                                    <input type="radio" className="ant-radio-button-input" value="100" onClick= {(event) => percent(1)}/>
                                        <span className="ant-radio-button-inner"></span>
                                    </span>
                                        <span>100%</span>
                                    </label>
                                </div>

                                <div className="AlignedAndCentered mt-0">
                                    <span className="setValueToMax">Available balance</span>
                                    <div className="text-align-right">
                                        <div className={'setValueToMax'}><span>{accountDataRbtc}</span> RBTC</div>
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
                            <Step3 auth={auth} handleClose={handleClose} rbtcAmount={rbtcAmount} rbtcAddress={rbtcAddress}></Step3>
                        </Fragment>
                }
            })()}
        </div>
    );
}

export default Step2