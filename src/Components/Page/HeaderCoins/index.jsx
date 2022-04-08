import './style.scss'
import React, { Fragment } from 'react';
import { Row, Col } from 'antd';


function setArrows(value) {
    if(value == '#f2316a')
    {
        return ['icon-arrow-down2.svg',12];
    }
    return ['icon-arrow-up2.svg',11];
}

function HeaderCoins(props) {

    const arrow1= setArrows(props.color1);
    const arrow2= setArrows(props.color2);
    const arrow3= setArrows(props.color3);


        return (
        <div className="MiddleSide">
            <div className={'div_coin'}>
                <img src={window.location.origin +'/icon-rbtclogo.svg'} alt="arrow" height={38}/>
                <div className={'div_values'}>
                    <span className="value_usd">44,119.49 usd</span>
                    <div className={'div_crypto'}>
                        <img className={'crypto_img'} src={window.location.origin +'/Moc/'+arrow1[0]} alt="arrow" height={arrow1[1]}/>
                        <span className={'crypto_value'} style={{color: `${props.color1}`}}>+172.49 (0.62%)</span>
                    </div>
                </div>
            </div>

            <div className={'mrl-25 div_coin'}>
                <img src={window.location.origin +'/BPROIcon.svg'} alt="arrow" height={38}/>
                <div className={'div_values'}>
                    <span className="value_usd">44,119.49 usd</span>
                    <div className={'div_crypto'}>
                        <img className={'crypto_img'} src={window.location.origin +'/Moc/'+arrow2[0]} alt="arrow" height={arrow2[1]}/>
                        <span className={'crypto_value'} style={{color: `${props.color2}`}}>+172.49 (0.62%)</span>
                    </div>
                </div>
            </div>

            <div className={'mrl-25 div_coin'}>
                <img src={window.location.origin +'/BTXIcon.svg'} alt="arrow" height={38}/>
                <div className={'div_values'} >
                    <span className="value_usd">44,119.49 usd</span>
                    <div className={'div_crypto'}>
                        <img className={'crypto_img'} src={window.location.origin +'/Moc/'+arrow3[0]} alt="arrow" height={arrow3[1]}/>
                        <span className={'crypto_value'} style={{color: `${props.color2}`}}>+172.49 (0.62%)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderCoins