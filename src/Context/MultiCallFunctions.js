import MoCConnector from '../Contracts/MoC/abi/MocConnector.json';

const BUCKET_X2 =
    '0x5832000000000000000000000000000000000000000000000000000000000000';
const BUCKET_C0 =
    '0x4330000000000000000000000000000000000000000000000000000000000000';

const connectorAddresses = async (web3, multicall, moc) => {
    const connectorAddress = await moc.methods.connector().call();

    console.log('Reading MoCConnector... address: ', connectorAddress);
    const mocConnector = new web3.eth.Contract(
        MoCConnector.abi,
        connectorAddress
    );

    const listMethods = [
        [connectorAddress, mocConnector.methods.mocState().encodeABI()],
        [connectorAddress, mocConnector.methods.mocInrate().encodeABI()],
        [connectorAddress, mocConnector.methods.mocExchange().encodeABI()],
        [connectorAddress, mocConnector.methods.mocSettlement().encodeABI()],
        [connectorAddress, mocConnector.methods.docToken().encodeABI()],
        [connectorAddress, mocConnector.methods.bproToken().encodeABI()]
    ];

    const multicallResult = await multicall.methods
        .tryBlockAndAggregate(false, listMethods)
        .call();

    const listReturnData = multicallResult[2].map((x) =>
        web3.eth.abi.decodeParameter('address', x.returnData)
    );

    return listReturnData;
};

const contractStatus = async (
    web3,
    multicall,
    moc,
    mocstate,
    mocinrate,
    mocsettlement
) => {
    console.log('Reading contract status ...');

    const listMethods = [
        [
            mocstate.options.address,
            mocstate.methods.getBitcoinPrice().encodeABI(),
            'uint256'
        ], // 0
        [
            mocstate.options.address,
            mocstate.methods.getMoCPrice().encodeABI(),
            'uint256'
        ], // 1
        [
            mocstate.options.address,
            mocstate.methods.absoluteMaxBPro().encodeABI(),
            'uint256'
        ], // 2
        [
            mocstate.options.address,
            mocstate.methods.maxBProx(BUCKET_X2).encodeABI(),
            'uint256'
        ], // 3
        [
            mocstate.options.address,
            mocstate.methods.absoluteMaxDoc().encodeABI(),
            'uint256'
        ], // 4
        [
            mocstate.options.address,
            mocstate.methods.freeDoc().encodeABI(),
            'uint256'
        ], // 5
        [
            mocstate.options.address,
            mocstate.methods.leverage(BUCKET_C0).encodeABI(),
            'uint256'
        ], // 6
        [
            mocstate.options.address,
            mocstate.methods.cobj().encodeABI(),
            'uint256'
        ], // 7
        [
            mocstate.options.address,
            mocstate.methods.leverage(BUCKET_X2).encodeABI(),
            'uint256'
        ], // 8
        [
            mocstate.options.address,
            mocstate.methods.rbtcInSystem().encodeABI(),
            'uint256'
        ], //9
        [
            mocstate.options.address,
            mocstate.methods.getBitcoinMovingAverage().encodeABI(),
            'uint256'
        ], //10
        [
            mocstate.options.address,
            mocstate.methods.getInrateBag(BUCKET_C0).encodeABI(),
            'uint256'
        ], //11
        [
            mocstate.options.address,
            mocstate.methods.getBucketNBTC(BUCKET_C0).encodeABI(),
            'uint256'
        ], //12
        [
            mocstate.options.address,
            mocstate.methods.getBucketNDoc(BUCKET_C0).encodeABI(),
            'uint256'
        ], //13
        [
            mocstate.options.address,
            mocstate.methods.getBucketNBPro(BUCKET_C0).encodeABI(),
            'uint256'
        ], //14
        [
            mocstate.options.address,
            mocstate.methods.getBucketNBTC(BUCKET_X2).encodeABI(),
            'uint256'
        ], //15
        [
            mocstate.options.address,
            mocstate.methods.getBucketNDoc(BUCKET_X2).encodeABI(),
            'uint256'
        ], //16
        [
            mocstate.options.address,
            mocstate.methods.getBucketNBPro(BUCKET_X2).encodeABI(),
            'uint256'
        ], //17
        [
            mocstate.options.address,
            mocstate.methods.globalCoverage().encodeABI(),
            'uint256'
        ], //18
        [
            moc.options.address,
            moc.methods.getReservePrecision().encodeABI(),
            'uint256'
        ], // 19
        [
            moc.options.address,
            moc.methods.getMocPrecision().encodeABI(),
            'uint256'
        ], //20
        [
            mocstate.options.address,
            mocstate.methods.coverage(BUCKET_X2).encodeABI(),
            'uint256'
        ], //21
        [
            mocstate.options.address,
            mocstate.methods.bproTecPrice().encodeABI(),
            'uint256'
        ], //22
        [
            mocstate.options.address,
            mocstate.methods.bproUsdPrice().encodeABI(),
            'uint256'
        ], //23
        [
            mocstate.options.address,
            mocstate.methods.bproSpotDiscountRate().encodeABI(),
            'uint256'
        ], //24
        [
            mocstate.options.address,
            mocstate.methods.maxBProWithDiscount().encodeABI(),
            'uint256'
        ], //25
        [
            mocstate.options.address,
            mocstate.methods.bproDiscountPrice().encodeABI(),
            'uint256'
        ], //26
        [
            mocstate.options.address,
            mocstate.methods.bucketBProTecPrice(BUCKET_X2).encodeABI(),
            'uint256'
        ], //27
        [
            mocstate.options.address,
            mocstate.methods.bproxBProPrice(BUCKET_X2).encodeABI(),
            'uint256'
        ], //28
        [
            mocinrate.options.address,
            mocinrate.methods.spotInrate().encodeABI(),
            'uint256'
        ], //29
        [
            mocinrate.options.address,
            mocinrate.methods.MINT_BPRO_FEES_RBTC().encodeABI(),
            'uint256'
        ], //30
        [
            mocinrate.options.address,
            mocinrate.methods.REDEEM_BPRO_FEES_RBTC().encodeABI(),
            'uint256'
        ], //31
        [
            mocinrate.options.address,
            mocinrate.methods.MINT_DOC_FEES_RBTC().encodeABI(),
            'uint256'
        ], //32
        [
            mocinrate.options.address,
            mocinrate.methods.REDEEM_DOC_FEES_RBTC().encodeABI(),
            'uint256'
        ], //33
        [
            mocinrate.options.address,
            mocinrate.methods.MINT_BTCX_FEES_RBTC().encodeABI(),
            'uint256'
        ], //34
        [
            mocinrate.options.address,
            mocinrate.methods.REDEEM_BTCX_FEES_RBTC().encodeABI(),
            'uint256'
        ], //35
        [
            mocinrate.options.address,
            mocinrate.methods.MINT_BPRO_FEES_MOC().encodeABI(),
            'uint256'
        ], //36
        [
            mocinrate.options.address,
            mocinrate.methods.REDEEM_BPRO_FEES_MOC().encodeABI(),
            'uint256'
        ], //37
        [
            mocinrate.options.address,
            mocinrate.methods.MINT_DOC_FEES_MOC().encodeABI(),
            'uint256'
        ], //38
        [
            mocinrate.options.address,
            mocinrate.methods.REDEEM_DOC_FEES_MOC().encodeABI(),
            'uint256'
        ], //39
        [
            mocinrate.options.address,
            mocinrate.methods.MINT_BTCX_FEES_MOC().encodeABI(),
            'uint256'
        ], //40
        [
            mocinrate.options.address,
            mocinrate.methods.REDEEM_BTCX_FEES_MOC().encodeABI(),
            'uint256'
        ], //41
        [
            mocstate.options.address,
            mocstate.methods.dayBlockSpan().encodeABI(),
            'uint256'
        ], //42
        [
            mocsettlement.options.address,
            mocsettlement.methods.getBlockSpan().encodeABI(),
            'uint256'
        ], //43
        [
            mocstate.options.address,
            mocstate.methods.blocksToSettlement().encodeABI(),
            'uint256'
        ], //44
        [
            mocstate.options.address,
            mocstate.methods.state().encodeABI(),
            'uint256'
        ], //45
        [moc.options.address, moc.methods.paused().encodeABI(), 'bool'], //46
        [
            mocstate.options.address,
            mocstate.methods.getLiquidationEnabled().encodeABI(),
            'bool'
        ], //47
        [
            mocstate.options.address,
            mocstate.methods.getProtected().encodeABI(),
            'uint256'
        ], //48
        [
            mocstate.options.address,
            mocstate.methods.getMoCToken().encodeABI(),
            'address'
        ], //49
        [
            mocstate.options.address,
            mocstate.methods.getMoCPriceProvider().encodeABI(),
            'address'
        ], //50
        [
            mocstate.options.address,
            mocstate.methods.getBtcPriceProvider().encodeABI(),
            'address'
        ], //51
        [
            mocstate.options.address,
            mocstate.methods.getMoCVendors().encodeABI(),
            'address'
        ] //52
    ];

    // Remove decode result parameter
    const cleanListMethods = listMethods.map((x) => [x[0], x[1]]);

    const multicallResult = await multicall.methods
        .tryBlockAndAggregate(false, cleanListMethods)
        .call();

    const listReturnData = multicallResult[2].map((item, itemIndex) =>
        web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData)
    );

    const d_moc_state = {};
    d_moc_state['blockHeight'] = multicallResult[0];
    d_moc_state['bitcoinPrice'] = listReturnData[0];

    d_moc_state['mocPrice'] = listReturnData[1];
    d_moc_state['bproAvailableToRedeem'] = listReturnData[2];
    d_moc_state['bprox2AvailableToMint'] = listReturnData[3];
    d_moc_state['docAvailableToMint'] = listReturnData[4];
    d_moc_state['docAvailableToRedeem'] = listReturnData[5];
    d_moc_state['b0Leverage'] = listReturnData[6];
    d_moc_state['b0TargetCoverage'] = listReturnData[7];
    d_moc_state['x2Leverage'] = listReturnData[8];
    d_moc_state['totalBTCAmount'] = listReturnData[9];
    d_moc_state['bitcoinMovingAverage'] = listReturnData[10];
    d_moc_state['b0BTCInrateBag'] = listReturnData[11];
    d_moc_state['b0BTCAmount'] = listReturnData[12];
    d_moc_state['b0DocAmount'] = listReturnData[13];
    d_moc_state['b0BproAmount'] = listReturnData[14];
    d_moc_state['x2BTCAmount'] = listReturnData[15];
    d_moc_state['x2DocAmount'] = listReturnData[16];
    d_moc_state['x2BproAmount'] = listReturnData[17];
    d_moc_state['globalCoverage'] = listReturnData[18];
    d_moc_state['reservePrecision'] = listReturnData[19];
    d_moc_state['mocPrecision'] = listReturnData[20];
    d_moc_state['x2Coverage'] = listReturnData[21];
    d_moc_state['bproPriceInRbtc'] = listReturnData[22];
    d_moc_state['bproPriceInUsd'] = listReturnData[23];
    d_moc_state['bproDiscountRate'] = listReturnData[24];
    d_moc_state['maxBproWithDiscount'] = listReturnData[25];
    d_moc_state['bproDiscountPrice'] = listReturnData[26];
    d_moc_state['bprox2PriceInRbtc'] = listReturnData[27];
    d_moc_state['bprox2PriceInBpro'] = listReturnData[28];
    d_moc_state['spotInrate'] = listReturnData[29];

    const commission_rates = {};
    commission_rates['MINT_BPRO_FEES_RBTC'] = listReturnData[30];
    commission_rates['REDEEM_BPRO_FEES_RBTC'] = listReturnData[31];
    commission_rates['MINT_DOC_FEES_RBTC'] = listReturnData[32];
    commission_rates['REDEEM_DOC_FEES_RBTC'] = listReturnData[33];
    commission_rates['MINT_BTCX_FEES_RBTC'] = listReturnData[34];
    commission_rates['REDEEM_BTCX_FEES_RBTC'] = listReturnData[35];
    commission_rates['MINT_BPRO_FEES_MOC'] = listReturnData[36];
    commission_rates['REDEEM_BPRO_FEES_MOC'] = listReturnData[37];
    commission_rates['MINT_DOC_FEES_MOC'] = listReturnData[38];
    commission_rates['REDEEM_DOC_FEES_MOC'] = listReturnData[39];
    commission_rates['MINT_BTCX_FEES_MOC'] = listReturnData[40];
    commission_rates['REDEEM_BTCX_FEES_MOC'] = listReturnData[41];

    d_moc_state['commissionRates'] = commission_rates;
    d_moc_state['dayBlockSpan'] = listReturnData[42];
    d_moc_state['blockSpan'] = listReturnData[43];
    d_moc_state['blocksToSettlement'] = listReturnData[44];
    d_moc_state['state'] = listReturnData[45];
    d_moc_state['lastPriceUpdateHeight'] = 0;
    d_moc_state['paused'] = listReturnData[46];
    d_moc_state['liquidationEnabled'] = listReturnData[47];
    d_moc_state['protected'] = listReturnData[48];
    d_moc_state['getMoCToken'] = listReturnData[49];
    d_moc_state['getMoCPriceProvider'] = listReturnData[50];
    d_moc_state['getBtcPriceProvider'] = listReturnData[51];
    d_moc_state['getMoCVendors'] = listReturnData[52];

    return d_moc_state;
};

const userBalance = async (
    web3,
    multicall,
    moc,
    mocinrate,
    moctoken,
    bprotoken,
    doctoken,
    user_address
) => {

    const listMethods = [
        [
            moctoken.options.address,
            moctoken.methods.balanceOf(user_address).encodeABI(),
            'uint256'
        ], // 0
        [
            moctoken.options.address,
            moctoken.methods
                .allowance(user_address, moc.options.address)
                .encodeABI(),
            'uint256'
        ], // 1
        [
            doctoken.options.address,
            doctoken.methods.balanceOf(user_address).encodeABI(),
            'uint256'
        ], // 2
        [
            bprotoken.options.address,
            bprotoken.methods.balanceOf(user_address).encodeABI(),
            'uint256'
        ], // 3
        [
            multicall.options.address,
            multicall.methods.getEthBalance(user_address).encodeABI(),
            'uint256'
        ], // 4
        [
            moc.options.address,
            moc.methods.docAmountToRedeem(user_address).encodeABI(),
            'uint256'
        ], // 5
        [
            moc.options.address,
            moc.methods.bproxBalanceOf(BUCKET_X2, user_address).encodeABI(),
            'uint256'
        ] // 6
    ];

    // Remove decode result parameter
    const cleanListMethods = listMethods.map((x) => [x[0], x[1]]);

    const multicallResult = await multicall.methods
        .tryBlockAndAggregate(false, cleanListMethods)
        .call();

    const listReturnData = multicallResult[2].map((item, itemIndex) =>
        web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData)
    );

    const user_balance = {};

    user_balance['blockHeight'] = multicallResult[0];
    user_balance['mocBalance'] = listReturnData[0];
    user_balance['mocAllowance'] = listReturnData[1];
    user_balance['docBalance'] = listReturnData[2];
    user_balance['bproBalance'] = listReturnData[3];
    user_balance['rbtcBalance'] = listReturnData[4];
    user_balance['docToRedeem'] = listReturnData[5];
    user_balance['bprox2Balance'] = listReturnData[6];
    user_balance['potentialBprox2MaxInterest'] = '0';
    user_balance['bProHoldIncentive'] = '0';
    user_balance['estimateGasMintBpro'] = '2000000';
    user_balance['estimateGasMintDoc'] = '2000000';
    user_balance['estimateGasMintBprox2'] = '2000000';

    const calcMintInterest = await mocinrate.methods
        .calcMintInterestValues(BUCKET_X2, user_balance['rbtcBalance'])
        .call();

    user_balance['potentialBprox2MaxInterest'] = calcMintInterest;

    return user_balance;
};

export { connectorAddresses, contractStatus, userBalance };
