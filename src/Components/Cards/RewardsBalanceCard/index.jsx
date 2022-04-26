import { Row, Col, Tooltip, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function RewardsBalanceCard(props) {

    return (
        <div className="RewardsBalanceContainer">
        {/* sacar y agregar los componentes de Jose */}
            <div className="Card">
                <Row>
                    <Col span={22}>
                        <h3 className="CardTitle">MoC Amount</h3>
                    </Col>
                    <Col span={2}>
                        <Tooltip placement="top" title={`Get information about MoC`}>
                            <InfoCircleOutlined className="Icon"/>
                        </Tooltip>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <img 
                            width={45}
                            src={window.location.origin + `/Moc/icon-moc.svg`}
                            alt="icon-wallet"
                        />
                    </Col>
                    <Col span={14}>
                        <h2> MoC Tokens</h2>
                        <h4>0.00</h4>
                    </Col>
                </Row>
            </div>
            <div className="Card RewardsBalanceLiquidity">
                <Row>
                    <Col span={22}>
                        <h3 className="CardTitle">MOC Liquidity Mining Program</h3>
                    </Col>
                    <Col span={2}>
                        <Tooltip placement="top" title={`Learn more about the MOC Liquidity Mining Program for BPro holders at https://moneyonchain.com/liquiditymining/`}>
                            <InfoCircleOutlined className="Icon"/>
                        </Tooltip>
                    </Col>
                </Row>
                <Row>
                    <h2>Ready to Claim</h2>
                    <p>0.000000 MOC</p>
                </Row>
                <Row>
                    <h2>Rewarded Today</h2>
                    <p>0.000000 MOC</p>
                </Row>
                <div className="ClaimButton">
                    <Button type="primary">Claim</Button>
                </div>
            </div>
        </div>
    )
}