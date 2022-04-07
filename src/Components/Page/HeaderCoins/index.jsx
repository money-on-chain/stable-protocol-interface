import './style.scss'
import React, { Fragment } from 'react';
import { Row, Col } from 'antd';




function HeaderCoins(props) {


    return (
        // <Row className="WalletBalance">
        //     <Col>Your Wallet Balance</Col>
        //         <div className="TotalBalanceBottom">
        //             <div className="CopyableText ">
        //                 <span className="title">Address</span>
        //                 <div>
        //                 </div>
        //             </div>
        //         </div>
        // </Row>
        // <span className={"HeaderCoins"}>aisiasi aisjaijsiasijasiai</span>
        <div className="MiddleSide">
            <div className="BtcPrice">
                {/*<img src={window.location.origin +'/icon-rbtclogo.svg'} alt="img"  height={40}/>*/}
                <div className="BtcPriceContent">
                    {/*<div className="BtcValue">*/}
                    {/*    <h4>*/}
                    {/*        <div><span className="" style={{'text-align': 'left' }}>44,119.49</span></div>*/}
                    {/*    </h4>*/}
                    {/*    <p>USD111</p>*/}
                    {/*</div>*/}
                    <div className="PriceVariation theme-value-up"><img src={window.location.origin +'/icon-rbtclogo.svg'} alt="arrow111111111" height={40}/>
                        <span className="" style={{'text-align': 'left__',color:'white' }}>44,119.49</span>
                    <p>+272.49 (0.62%)</p>
                    </div>
                </div>
            </div>
            <div className="BtcPrice">
                {/*<img src={window.location.origin +'/icon-rbtclogo.svg'} height={40}/>*/}
                <div className="BtcPriceContent">
                    {/*<div className="BtcValue">*/}
                    {/*    <h4>*/}
                    {/*        <div><span className="" style={{'text-align': 'left' }}>30,228.01</span></div>*/}
                    {/*    </h4>*/}
                    {/*    <p>USD</p>*/}
                    {/*</div>*/}
                    <div className="PriceVariation theme-value-up">
                        <img src={window.location.origin +'/icon-rbtclogo.svg'} alt="arrow" height={40}/>
                        <p>+107.36 (0.36%)</p>
                    </div>
                </div>
            </div>
            <div className="BtcPrice">
                {/*<img src={window.location.origin +'/BPROIcon.svg'} height={40}/>*/}
                <div className="BtcPriceContent">
                {/*    <div className="BtcValue">*/}
                {/*        <h4>*/}
                {/*            <div><span className="" style={{'text-align': 'left' }}>44,119.49</span></div>*/}
                {/*        </h4>*/}
                {/*        <p>USD</p>*/}
                {/*</div>*/}
                    <div className="PriceVariation theme-value-up"><img src={window.location.origin +'/BTXIcon.svg'} alt="arrow" height={40}/>
                        <p>+295.60 (0.67%)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderCoins