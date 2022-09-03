import { useState } from 'react';
import { Row, Col, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

import { getKeyThenIncreaseKey } from 'antd/lib/message';

export default function InformationModal({ currencyCode }) {

    async function loadAssets() {
        try {

                let css1= await import('./'+process.env.REACT_APP_ENVIRONMENT_APP_PROJECT+'/style.scss')

        } catch (error) {
            console.log(`Ocurrió un error al cargar imgs: ${error}`);
        }
    }
    loadAssets()

  const [t, i18n] = useTranslation(["global", 'moc']);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
      setTimeout(function(){
          document.querySelector('.ant-modal-close-x').style.color="#6c6d6f";
      }, 200);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getKey = (s) => {
    return (s.substring(0, 8))
  }

  const pre_label = t(`MoC.Tokens_${currencyCode.toUpperCase()}_name`, { ns: 'moc' })

    // document.querySelectorAll('.rlogin-modal-hitbox')[0].addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); })


  const TokenInformationContent = ({ token }) => (
    <Row>
      <Col span={24}>
        <hr className='FactSheetLine' />
        <p className='FactSheet'>{`${t(`MoC.TokenInformationContent.${token}.factSheet`, { ns: 'moc' })}`}</p>
          <p>{token}</p>
        <h4 className='FactSheetTitle' dangerouslySetInnerHTML={{ __html: t(`MoC.TokenInformationContent.${token}.title`, { ns: 'moc', returnObjectTrees: false }) }} />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <ul>
          {
            t(`MoC.TokenInformationContent.${token}.characteristics.left`, { ns: 'moc', returnObjects: true }).map(eachcharacteristic => (
              <li key={getKey(eachcharacteristic)} className='Characteristic'>{eachcharacteristic}</li>
            ))
          }
        </ul>
      </Col>
      <Col xs={24} sm={24} md={12}>
        <ul>
          {
            t(`MoC.TokenInformationContent.${token}.characteristics.right`, { ns: 'moc', returnObjects: true }).map(eachcharacteristic => (
              <li key={getKey(eachcharacteristic)} className='Characteristic'>{eachcharacteristic}</li>
            ))
          }
        </ul>
      </Col>
    </Row>
  )

  return (
    <div>
      <Tooltip placement="topRight" title={`${t('MoC.tokenInformationTooltip', { ns: 'moc' })} ${pre_label}`} className='Tooltip'>
        <InfoCircleOutlined className="Icon" onClick={showModal} />
      </Tooltip>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} width='70%'
        bodyStyle={{ paddingTop: 35, paddingLeft: 50, paddingRight: 50 }}
      >
        <TokenInformationContent token={currencyCode} />
      </Modal>
    </div >
  )
}