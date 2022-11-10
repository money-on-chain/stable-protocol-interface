import { Row, Col, Button } from 'antd';
import React from 'react';
import { useContext } from 'react';
import { AuthenticateContext } from '../../../context/Auth';
import { config } from '../../../projects/config';
import { useProjectTranslation } from '../../../helpers/translations';
import { ReactComponent as LogoIconRBTC } from '../../../assets/icons/icon-btc_to_rbtc.svg';


export default function BtcToRbtc(props) {

    const [t, i18n, ns]= useProjectTranslation();
    const AppProject = config.environment.AppProject;
    const{
        title = 'BTC to rBTC Peg In',
        description = t(`${AppProject}.fastbtc.getRBTC_description`, {ns: ns}),
        btnAction = ()=>{},
        btnText = 'Convert rBTC to BTC'
    } = props;

    const {accountData}= useContext(AuthenticateContext);

    return (
        <div className="Card BtoRCard">
            <Row>
                <Col xs={24}>
                    <div className="title">
                        <div className="CardLogo">
                            <h1>{ title }</h1>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="m-b">
                <Col xs={8}>
                    <div className='text-center'>
                        <LogoIconRBTC className="logo-img" width="111" height="111" alt=""/>
                    </div>
                </Col>
                <Col xs={13}>
                    <p>{description}</p>
                    {accountData.Wallet &&
                    <Button type="primary" onClick={btnAction}>
                        <b>{btnText}</b>
                    </Button>}
                </Col>
                <Col xs={3}/>
            </Row>

        </div>

    )
}