import React, {Fragment, useContext, useEffect} from 'react';
import SystemStatus from '../../Components/Cards/Metrics/SystemStatus'
import Reserve from '../../Components/Cards/Metrics/Reserve'
import MOC from '../../Components/Cards/Metrics/MOC'
import RiskProX from '../../Components/Cards/Metrics/RiskProX'
import Stable from '../../Components/Cards/Metrics/Stable'
import RiskPro from '../../Components/Cards/Metrics/RiskPro'
import Liquidity from '../../Components/Cards/Metrics/Liquidity'
import NextSettlement from '../../Components/Cards/Metrics/NextSettlement'
import BigNumber from 'bignumber.js';
import {Row, Col, Tooltip, Alert} from 'antd';
import { useTranslation } from "react-i18next";
import { AuthenticateContext } from '../../Context/Auth';
import { getMaxAvailableOfCurrencyCode } from '../../Config/currentcy';

function Metrics(props) {

    async function loadAssets() {
        try {
            if( process.env.PUBLIC_URL=='' && process.env.REACT_APP_ENVIRONMENT_APP_PROJECT!='' ){
                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')
            }
        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

    const [t, i18n] = useTranslation(["global", 'moc']);
    const auth = useContext(AuthenticateContext);
    const { convertToken } = auth;
    const mocState = auth.contractStatusData;

    let {
        b0Leverage = 0,
        globalCoverage = '0',
        x2Leverage = 0,
        x2Coverage = 0,
        b0BTCAmount = 0,
        b0DocAmount = 0,
        b0BproAmount = 0,
        bitcoinMovingAverage = 0,
        b0TargetCoverage = 0,
        b0BTCInrateBag = 0,
        paused = false,
        blocksToSettlement = 10,
        x2BTCAmount = 0,
        x2DocAmount = 0,
        x2BproAmount = 0
      } = mocState || {};

    b0BTCAmount = new BigNumber(b0BTCAmount);
    b0DocAmount = new BigNumber(b0DocAmount);
    b0BproAmount = new BigNumber(b0BproAmount);

    x2BTCAmount = new BigNumber(x2BTCAmount);
    x2DocAmount = new BigNumber(x2DocAmount);
    x2BproAmount = new BigNumber(x2BproAmount);

    b0BTCInrateBag = new BigNumber(b0BTCInrateBag);

    const maxStableRedeemAvailable =
        mocState && getMaxAvailableOfCurrencyCode(mocState, 'STABLE', true);
    const maxStableMintAvailable =
        mocState && getMaxAvailableOfCurrencyCode(mocState, 'STABLE', false);
    const maxRiskproRedeemAvailable =
        mocState && getMaxAvailableOfCurrencyCode(mocState, 'RISKPRO', true);
    const maxRiskproxMintAvailable =
        mocState && getMaxAvailableOfCurrencyCode(mocState, 'RISKPROX', false);

    const {
        bproPriceInUsd,
        bprox2PriceInRbtc,
        bitcoinPrice,
        bproPriceInRbtc,
        bproDiscountPrice,
        mocPrice
    } = (!!mocState) ? mocState : 0;
    const bprox2PriceInUsd = (convertToken && convertToken('RESERVE', 'USD', bprox2PriceInRbtc)) || 0;
    const mocPriceUsd = new BigNumber(mocPrice);
    const bproDiscountPriceRBTC = new BigNumber(bproDiscountPrice);
    const bproDiscountPriceUsd =
        (convertToken && convertToken('RESERVE', 'USD', bproDiscountPriceRBTC)) || 0;

    const totalDocAmount = b0DocAmount.plus(x2DocAmount);
    const totalDocInRBTC = (convertToken && convertToken('STABLE', 'RESERVE', totalDocAmount)) || 0;
    const totalBproInRBTC = b0BproAmount.multipliedBy(new BigNumber(bproPriceInRbtc).div(10 ** 18));
    const totalBpro = (convertToken && convertToken('RESERVE', 'RISKPRO', totalBproInRBTC)) || 0;

    const totalBproxInRBTC = x2BproAmount.multipliedBy(
        new BigNumber(bprox2PriceInRbtc).div(10 ** 18)
    ); //new BigNumber(x2BTCAmount);
    const totalBprox = (convertToken && convertToken('RESERVE', 'RISKPROX', totalBproxInRBTC)) || 0;

    const totalBproInUSD = (convertToken && convertToken('RESERVE', 'USD', totalBproInRBTC)) || 0;
    const totalBproxInUSD = (convertToken && convertToken('RESERVE', 'USD', totalBproxInRBTC)) || 0;
    const adjustedTargetCoverage = parseFloat(
        b0TargetCoverage * (bitcoinPrice / Math.min(bitcoinPrice, bitcoinMovingAverage))
    );

    return (
        <Fragment>
            {!auth.isLoggedIn && <Alert
                message={t('global.NoConnection_alertTitle')}
                description={t('global.NoConnection_alertPleaseConnect')}
                type="error"
                showIcon
                className="AlertNoConnection"
            />}
            <h1 className="PageTitle">{t('global.Metrics_title', { ns: 'global' })}</h1>
            <h3 className="PageSubTitle">{t('global.Metrics_subtitle', { ns: 'global' })}</h3>
            <Row gutter={15} className="MetricsCardsContainer">
                <Col className={'SystemStatusSection'}>
                    <SystemStatus coverage={globalCoverage} paused={paused} blocksToSettlement={blocksToSettlement}/>
                </Col>
                <Col className={'RBTCSection'}>
                    <Reserve
                        rbtcPrice={bitcoinPrice}
                        totalSTABLE={totalDocAmount}
                        totalRISKPRO={totalBpro}
                        totalRISKPROX={totalBprox}
                        EMA={bitcoinMovingAverage}
                        targetCoverage={adjustedTargetCoverage}
                        b0BTCInrateBag={b0BTCInrateBag}
                    />
                </Col>
            </Row>

            <Row style={{ marginTop: 15 }} gutter={15} className="MetricsCardsContainer">
                <Col className={'MetricsCardsDOC'}>
                    <Stable
                        availableRedeem={maxStableRedeemAvailable}
                        availableMint={maxStableMintAvailable}
                        total={totalDocAmount}
                    />
                </Col>
                <Col className={'MetricsCardsBPRO'}>
                    <RiskPro
                        total={totalBpro}
                        availableRedeem={maxRiskproRedeemAvailable}
                        leverage={b0Leverage}
                        usdValue={bproPriceInUsd}
                        bproDiscountPriceUsd={bproDiscountPriceUsd}
                    />
                </Col>
                <Col className={'MetricsCardsBTCX'}>
                    <RiskProX
                        leverage={x2Leverage}
                        coverage={x2Coverage}
                        availableMint={maxRiskproxMintAvailable}
                        total={totalBprox}
                        usdValue={bprox2PriceInUsd}
                    />
                </Col>
            </Row>

            <Row style={{ marginTop: 15 }} gutter={15} className="MetricsCardsContainer">
                <Col className={'MetricsCardsMOC'}>
                    <MOC mocPrice={mocPriceUsd} />
                </Col>
                <Col className={'MetricsCardsLiquidity'}>
                    <Liquidity
                        b0BTCAmount={b0BTCAmount}
                        b0DocAmount={b0DocAmount}
                        b0BproAmount={b0BproAmount}
                        x2BTCAmount={x2BTCAmount}
                        x2DocAmount={x2DocAmount}
                        x2BproAmount={x2BproAmount}
                    />
                </Col>
                <Col className={'MetricsCardsNextSettlement'}>
                    <NextSettlement />
                </Col>
            </Row>
        </Fragment>
    )
}

export default Metrics;
