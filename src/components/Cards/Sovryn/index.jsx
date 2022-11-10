import { Row } from 'antd';
import React from 'react';
import { useTranslation } from "react-i18next";
import { config} from '../../../projects/config';
import { ReactComponent as LogoIconFastBTC } from '../../../assets/icons/icon-sovryn_fastbtc.svg';
import { ReactComponent as LogoIconRBTC } from '../../../assets/icons/icon-rbtclogo.svg';

export default function Sovryn(props) {
        
    const [t, i18n] = useTranslation(["global", 'moc', 'rdoc']);
    const ns = config.environment.AppProject === 'MoC' ? 'moc' : 'rdoc';
    const AppProject = config.environment.AppProject;
    
    return (
        <div className="Card FastCard">
            <Row>
                {/*<Col span={22}>*/}
                <div className="title">
                    <div className="CardLogo">
                        <LogoIconFastBTC width="32" height="32" alt="" />
                        <h1>Sovryn <br />FastBTC</h1>
                    </div>
                </div>
                {/*</Col>*/}
            </Row>
            <Row>
                <div className="content-container">
                <LogoIconRBTC className="logo-img" width="111" height="111"
                    alt="" />
                    <div className="FastBTCLeftPanel"><b>{t(`${AppProject}.fastbtc.leftPannel.header`, { ns: ns })}</b>
                        <ul>
                            <li className="instruction-item">{t(`${AppProject}.fastbtc.leftPannel.items.0`, { ns: ns })}</li>
                            <li className="instruction-item">{t(`${AppProject}.fastbtc.leftPannel.items.1`, { ns: ns })}</li>
                            <li className="instruction-item">{t(`${AppProject}.fastbtc.leftPannel.items.2`, { ns: ns })}</li>
                        </ul>
                        <a href="https://www.rsk.co/rbtc/" target="_blank" rel="noopener noreferrer">&gt; {t(`${AppProject}.fastbtc.leftPannel.learnMore`, { ns: ns })}</a></div>
                </div>
            </Row>

        </div>

    )
}