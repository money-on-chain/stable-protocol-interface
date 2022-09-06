import React, { useState, useContext } from 'react';
import { Form } from "antd";
import { AuthenticateContext } from "../../Context/Auth";
import addressHelper from '../../Lib/addressHelper';
import { DebounceInput } from 'react-debounce-input';
import { config } from '../../Config/config';

export default function InputAddress(props) {

  const auth = useContext(AuthenticateContext);
  const {web3} = auth;
  const {
    title,
    className,
    onChange
  } = props;

  const [statusInput, setStatusInput] = useState(null);
  const [help, setHelp] = useState('');
  const [value, setValue] = useState('');

  const rns = new window.RNS(window.ethereum, config.rns.address && { contractAddresses: {
    registry: config.rns.address
  }});

  const helper = addressHelper(web3);

  const onStartResolving = (val) => {
    setValue(val);
    setHelp('...');
  };

  const addressOrRNSIsValid = (addressOrRNS) => {
    const isHexadecimal = addressOrRNS.startsWith("0x");
    const isValidChecksum = (addressOrRNS === undefined) ? false : helper.isValidAddressChecksum(addressOrRNS);
    if (!isValidChecksum && isHexadecimal) {
      return onResolutionCompleted(false, '', addressOrRNS);
    }
    if (isHexadecimal && isValidChecksum) {
      return onResolutionCompleted(true, '', addressOrRNS);
    }
    if (!isHexadecimal && rns.utils.isValidDomain(addressOrRNS)) {
      return rns.addr(addressOrRNS)
        .then(addr => onResolutionCompleted(true, `Address: ${addr}`, addr))
        .catch(_ => onResolutionCompleted(false, 'Address not found', addressOrRNS));
    }

    return onResolutionCompleted(false, 'Address not recognize', addressOrRNS);
  };

  const onResolutionCompleted = (validateStatus, help, val) => {
    setStatusInput(validateStatus ? 'success' : 'error');
    setHelp(help);
    onChange(val);
  };

  const onChangeInput = (e) => {
    const val = e.target.value;
     onStartResolving(val);
     if(!val) return onResolutionCompleted(true, '', val);
    addressOrRNSIsValid(val);
   };

  return (
    <div className={`InputAddressContainer ${className || ""}`}>
      <p className="InputAddressLabel">{title}</p>
      <Form>
        <Form.Item validateStatus={statusInput} help={help}>
          <DebounceInput
            value={value}
            debounceTimeout={600}
            onChange={(e) => onChangeInput(e)}
            className={`${statusInput === 'error' ? 'formError' : ''}`}
          />
        </Form.Item>
      </Form>
    </div>
  )
}