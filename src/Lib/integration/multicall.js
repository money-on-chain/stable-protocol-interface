import configOmoc from './omoc.json';
import {toContractPrecision, BUCKET_X2, BUCKET_C0} from './utils';

const connectorAddresses = async (web3, dContracts, appMode) => {
  const multicall = dContracts.contracts.multicall
  const mocconnector = dContracts.contracts.mocconnector

  const listMethods = [
    [mocconnector.options.address, mocconnector.methods.mocState().encodeABI()],
    [mocconnector.options.address, mocconnector.methods.mocInrate().encodeABI()],
    [mocconnector.options.address, mocconnector.methods.mocExchange().encodeABI()],
    [mocconnector.options.address, mocconnector.methods.mocSettlement().encodeABI()]
  ]

  if (appMode === 'MoC') {
    listMethods.push([mocconnector.options.address, mocconnector.methods.docToken().encodeABI()])
    listMethods.push([mocconnector.options.address, mocconnector.methods.bproToken().encodeABI()])
    listMethods.push([mocconnector.options.address, mocconnector.methods.bproToken().encodeABI()])
  } else {
    listMethods.push([mocconnector.options.address, mocconnector.methods.stableToken().encodeABI()])
    listMethods.push([mocconnector.options.address, mocconnector.methods.riskProToken().encodeABI()])
    listMethods.push([mocconnector.options.address, mocconnector.methods.reserveToken().encodeABI()])
  }

  const multicallResult = await multicall.methods.tryBlockAndAggregate(false, listMethods).call()

  const listReturnData = multicallResult[2].map(x => web3.eth.abi.decodeParameter('address', x.returnData))

  return listReturnData
}

const registryAddresses = async (web3, dContracts) => {
  // getting constants from omoc.json
  //const configOmoc = readJsonFile('./src/lib/omoc.json')
  const multicall = dContracts.contracts.multicall
  const iregistry = dContracts.contracts.iregistry

  const listMethods = [
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.MOC_STAKING_MACHINE).encodeABI()],
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.SUPPORTERS_ADDR).encodeABI()],
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.MOC_DELAY_MACHINE).encodeABI()],
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.MOC_VESTING_MACHINE).encodeABI()],
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.MOC_VOTING_MACHINE).encodeABI()],
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.MOC_PRICE_PROVIDER_REGISTRY).encodeABI()],
    [iregistry.options.address, iregistry.methods.getAddress(configOmoc.RegistryConstants.ORACLE_MANAGER_ADDR).encodeABI()]
  ]

  const multicallResult = await multicall.methods.tryBlockAndAggregate(false, listMethods).call()

  const listReturnData = multicallResult[2].map(x => web3.eth.abi.decodeParameter('address', x.returnData))

  return listReturnData
}


const contractStatus = async (web3, dContracts, appMode) => {

  const multicall = dContracts.contracts.multicall
  const moc = dContracts.contracts.moc
  const mocstate = dContracts.contracts.mocstate
  const mocinrate = dContracts.contracts.mocinrate
  const mocsettlement = dContracts.contracts.mocsettlement

  console.log('Reading contract status ...')

  let listMethods

  if (appMode === 'MoC') {
    listMethods = [
      [mocstate.options.address, mocstate.methods.getBitcoinPrice().encodeABI(), 'uint256'], // 0
      [mocstate.options.address, mocstate.methods.getMoCPrice().encodeABI(), 'uint256'], // 1
      [mocstate.options.address, mocstate.methods.absoluteMaxBPro().encodeABI(), 'uint256'], // 2
      [mocstate.options.address, mocstate.methods.maxBProx(BUCKET_X2).encodeABI(), 'uint256'], // 3
      [mocstate.options.address, mocstate.methods.absoluteMaxDoc().encodeABI(), 'uint256'], // 4
      [mocstate.options.address, mocstate.methods.freeDoc().encodeABI(), 'uint256'], // 5
      [mocstate.options.address, mocstate.methods.leverage(BUCKET_C0).encodeABI(), 'uint256'], // 6
      [mocstate.options.address, mocstate.methods.cobj().encodeABI(), 'uint256'], // 7
      [mocstate.options.address, mocstate.methods.leverage(BUCKET_X2).encodeABI(), 'uint256'], // 8
      [mocstate.options.address, mocstate.methods.rbtcInSystem().encodeABI(), 'uint256'], // 9
      [mocstate.options.address, mocstate.methods.getBitcoinMovingAverage().encodeABI(), 'uint256'], // 10
      [mocstate.options.address, mocstate.methods.getInrateBag(BUCKET_C0).encodeABI(), 'uint256'], // 11
      [mocstate.options.address, mocstate.methods.getBucketNBTC(BUCKET_C0).encodeABI(), 'uint256'], // 12
      [mocstate.options.address, mocstate.methods.getBucketNDoc(BUCKET_C0).encodeABI(), 'uint256'], // 13
      [mocstate.options.address, mocstate.methods.getBucketNBPro(BUCKET_C0).encodeABI(), 'uint256'], // 14
      [mocstate.options.address, mocstate.methods.getBucketNBTC(BUCKET_X2).encodeABI(), 'uint256'], // 15
      [mocstate.options.address, mocstate.methods.getBucketNDoc(BUCKET_X2).encodeABI(), 'uint256'], // 16
      [mocstate.options.address, mocstate.methods.getBucketNBPro(BUCKET_X2).encodeABI(), 'uint256'], // 17
      [mocstate.options.address, mocstate.methods.globalCoverage().encodeABI(), 'uint256'], // 18
      [moc.options.address, moc.methods.getReservePrecision().encodeABI(), 'uint256'], // 19
      [moc.options.address, moc.methods.getMocPrecision().encodeABI(), 'uint256'], // 20
      [mocstate.options.address, mocstate.methods.coverage(BUCKET_X2).encodeABI(), 'uint256'], // 21
      [mocstate.options.address, mocstate.methods.bproTecPrice().encodeABI(), 'uint256'], // 22
      [mocstate.options.address, mocstate.methods.bproUsdPrice().encodeABI(), 'uint256'], // 23
      [mocstate.options.address, mocstate.methods.bproSpotDiscountRate().encodeABI(), 'uint256'], // 24
      [mocstate.options.address, mocstate.methods.maxBProWithDiscount().encodeABI(), 'uint256'], // 25
      [mocstate.options.address, mocstate.methods.bproDiscountPrice().encodeABI(), 'uint256'], // 26
      [mocstate.options.address, mocstate.methods.bucketBProTecPrice(BUCKET_X2).encodeABI(), 'uint256'], // 27
      [mocstate.options.address, mocstate.methods.bproxBProPrice(BUCKET_X2).encodeABI(), 'uint256'], // 28
      [mocinrate.options.address, mocinrate.methods.spotInrate().encodeABI(), 'uint256'], // 29
      [mocinrate.options.address, mocinrate.methods.MINT_BPRO_FEES_RBTC().encodeABI(), 'uint256'], // 30
      [mocinrate.options.address, mocinrate.methods.REDEEM_BPRO_FEES_RBTC().encodeABI(), 'uint256'], // 31
      [mocinrate.options.address, mocinrate.methods.MINT_DOC_FEES_RBTC().encodeABI(), 'uint256'], // 32
      [mocinrate.options.address, mocinrate.methods.REDEEM_DOC_FEES_RBTC().encodeABI(), 'uint256'], // 33
      [mocinrate.options.address, mocinrate.methods.MINT_BTCX_FEES_RBTC().encodeABI(), 'uint256'], // 34
      [mocinrate.options.address, mocinrate.methods.REDEEM_BTCX_FEES_RBTC().encodeABI(), 'uint256'], // 35
      [mocinrate.options.address, mocinrate.methods.MINT_BPRO_FEES_MOC().encodeABI(), 'uint256'], // 36
      [mocinrate.options.address, mocinrate.methods.REDEEM_BPRO_FEES_MOC().encodeABI(), 'uint256'], // 37
      [mocinrate.options.address, mocinrate.methods.MINT_DOC_FEES_MOC().encodeABI(), 'uint256'], // 38
      [mocinrate.options.address, mocinrate.methods.REDEEM_DOC_FEES_MOC().encodeABI(), 'uint256'], // 39
      [mocinrate.options.address, mocinrate.methods.MINT_BTCX_FEES_MOC().encodeABI(), 'uint256'], // 40
      [mocinrate.options.address, mocinrate.methods.REDEEM_BTCX_FEES_MOC().encodeABI(), 'uint256'], // 41
      [mocstate.options.address, mocstate.methods.dayBlockSpan().encodeABI(), 'uint256'], // 42
      [mocsettlement.options.address, mocsettlement.methods.getBlockSpan().encodeABI(), 'uint256'], // 43
      [mocstate.options.address, mocstate.methods.blocksToSettlement().encodeABI(), 'uint256'], // 44
      [mocstate.options.address, mocstate.methods.state().encodeABI(), 'uint256'], // 45
      [moc.options.address, moc.methods.paused().encodeABI(), 'bool'], // 46
      [mocstate.options.address, mocstate.methods.getLiquidationEnabled().encodeABI(), 'bool'], // 47
      [mocstate.options.address, mocstate.methods.getProtected().encodeABI(), 'uint256'], // 48
      [mocstate.options.address, mocstate.methods.getMoCToken().encodeABI(), 'address'], // 49
      [mocstate.options.address, mocstate.methods.getMoCPriceProvider().encodeABI(), 'address'], // 50
      [mocstate.options.address, mocstate.methods.getBtcPriceProvider().encodeABI(), 'address'], // 51
      [mocstate.options.address, mocstate.methods.getMoCVendors().encodeABI(), 'address'] // 52
    ]
  } else {
    listMethods = [
      [mocstate.options.address, mocstate.methods.getReserveTokenPrice().encodeABI(), 'uint256'], // 0
      [mocstate.options.address, mocstate.methods.getMoCPrice().encodeABI(), 'uint256'], // 1
      [mocstate.options.address, mocstate.methods.absoluteMaxRiskPro().encodeABI(), 'uint256'], // 2
      [mocstate.options.address, mocstate.methods.maxRiskProx(BUCKET_X2).encodeABI(), 'uint256'], // 3
      [mocstate.options.address, mocstate.methods.absoluteMaxStableToken().encodeABI(), 'uint256'], // 4
      [mocstate.options.address, mocstate.methods.freeStableToken().encodeABI(), 'uint256'], // 5
      [mocstate.options.address, mocstate.methods.leverage(BUCKET_C0).encodeABI(), 'uint256'], // 6
      [mocstate.options.address, mocstate.methods.cobj().encodeABI(), 'uint256'], // 7
      [mocstate.options.address, mocstate.methods.leverage(BUCKET_X2).encodeABI(), 'uint256'], // 8
      [mocstate.options.address, mocstate.methods.reserves().encodeABI(), 'uint256'], // 9
      [mocstate.options.address, mocstate.methods.getExponentalMovingAverage().encodeABI(), 'uint256'], // 10
      [mocstate.options.address, mocstate.methods.getInrateBag(BUCKET_C0).encodeABI(), 'uint256'], // 11
      [mocstate.options.address, mocstate.methods.getBucketNReserve(BUCKET_C0).encodeABI(), 'uint256'], // 12
      [mocstate.options.address, mocstate.methods.getBucketNStableToken(BUCKET_C0).encodeABI(), 'uint256'], // 13
      [mocstate.options.address, mocstate.methods.getBucketNRiskPro(BUCKET_C0).encodeABI(), 'uint256'], // 14
      [mocstate.options.address, mocstate.methods.getBucketNReserve(BUCKET_X2).encodeABI(), 'uint256'], // 15
      [mocstate.options.address, mocstate.methods.getBucketNStableToken(BUCKET_X2).encodeABI(), 'uint256'], // 16
      [mocstate.options.address, mocstate.methods.getBucketNRiskPro(BUCKET_X2).encodeABI(), 'uint256'], // 17
      [mocstate.options.address, mocstate.methods.globalCoverage().encodeABI(), 'uint256'], // 18
      [moc.options.address, moc.methods.getReservePrecision().encodeABI(), 'uint256'], // 19
      [moc.options.address, moc.methods.getMocPrecision().encodeABI(), 'uint256'], // 20
      [mocstate.options.address, mocstate.methods.coverage(BUCKET_X2).encodeABI(), 'uint256'], // 21
      [mocstate.options.address, mocstate.methods.riskProTecPrice().encodeABI(), 'uint256'], // 22
      [mocstate.options.address, mocstate.methods.riskProUsdPrice().encodeABI(), 'uint256'], // 23
      [mocstate.options.address, mocstate.methods.riskProSpotDiscountRate().encodeABI(), 'uint256'], // 24
      [mocstate.options.address, mocstate.methods.maxRiskProWithDiscount().encodeABI(), 'uint256'], // 25
      [mocstate.options.address, mocstate.methods.riskProDiscountPrice().encodeABI(), 'uint256'], // 26
      [mocstate.options.address, mocstate.methods.bucketRiskProTecPrice(BUCKET_X2).encodeABI(), 'uint256'], // 27
      [mocstate.options.address, mocstate.methods.riskProxRiskProPrice(BUCKET_X2).encodeABI(), 'uint256'], // 28
      [mocinrate.options.address, mocinrate.methods.spotInrate().encodeABI(), 'uint256'], // 29
      [mocinrate.options.address, mocinrate.methods.MINT_RISKPRO_FEES_RESERVE().encodeABI(), 'uint256'], // 30
      [mocinrate.options.address, mocinrate.methods.REDEEM_RISKPRO_FEES_RESERVE().encodeABI(), 'uint256'], // 31
      [mocinrate.options.address, mocinrate.methods.MINT_STABLETOKEN_FEES_RESERVE().encodeABI(), 'uint256'], // 32
      [mocinrate.options.address, mocinrate.methods.REDEEM_STABLETOKEN_FEES_RESERVE().encodeABI(), 'uint256'], // 33
      [mocinrate.options.address, mocinrate.methods.MINT_RISKPROX_FEES_RESERVE().encodeABI(), 'uint256'], // 34
      [mocinrate.options.address, mocinrate.methods.REDEEM_RISKPROX_FEES_RESERVE().encodeABI(), 'uint256'], // 35
      [mocinrate.options.address, mocinrate.methods.MINT_RISKPRO_FEES_MOC().encodeABI(), 'uint256'], // 36
      [mocinrate.options.address, mocinrate.methods.REDEEM_RISKPRO_FEES_MOC().encodeABI(), 'uint256'], // 37
      [mocinrate.options.address, mocinrate.methods.MINT_STABLETOKEN_FEES_MOC().encodeABI(), 'uint256'], // 38
      [mocinrate.options.address, mocinrate.methods.REDEEM_STABLETOKEN_FEES_MOC().encodeABI(), 'uint256'], // 39
      [mocinrate.options.address, mocinrate.methods.MINT_RISKPROX_FEES_MOC().encodeABI(), 'uint256'], // 40
      [mocinrate.options.address, mocinrate.methods.REDEEM_RISKPROX_FEES_MOC().encodeABI(), 'uint256'], // 41
      [mocstate.options.address, mocstate.methods.dayBlockSpan().encodeABI(), 'uint256'], // 42
      [mocsettlement.options.address, mocsettlement.methods.getBlockSpan().encodeABI(), 'uint256'], // 43
      [mocstate.options.address, mocstate.methods.blocksToSettlement().encodeABI(), 'uint256'], // 44
      [mocstate.options.address, mocstate.methods.state().encodeABI(), 'uint256'], // 45
      [moc.options.address, moc.methods.paused().encodeABI(), 'bool'], // 46
      [mocstate.options.address, mocstate.methods.getLiquidationEnabled().encodeABI(), 'bool'], // 47
      [mocstate.options.address, mocstate.methods.getProtected().encodeABI(), 'uint256'], // 48
      [mocstate.options.address, mocstate.methods.getMoCToken().encodeABI(), 'address'], // 49
      [mocstate.options.address, mocstate.methods.getMoCPriceProvider().encodeABI(), 'address'], // 50
      [mocstate.options.address, mocstate.methods.getPriceProvider().encodeABI(), 'address'], // 51
      [mocstate.options.address, mocstate.methods.getMoCVendors().encodeABI(), 'address'] // 52
    ]
  }

  // Remove decode result parameter
  const cleanListMethods = listMethods.map(x => [x[0], x[1]])

  const multicallResult = await multicall.methods.tryBlockAndAggregate(false, cleanListMethods).call()

  const listReturnData = multicallResult[2].map((item, itemIndex) => web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData))

  const dMocState = {}
  dMocState.blockHeight = multicallResult[0]
  dMocState.bitcoinPrice = listReturnData[0]
  dMocState.mocPrice = listReturnData[1]
  dMocState.bproAvailableToRedeem = listReturnData[2]
  dMocState.bprox2AvailableToMint = listReturnData[3]
  dMocState.docAvailableToMint = listReturnData[4]
  dMocState.docAvailableToRedeem = listReturnData[5]
  dMocState.b0Leverage = listReturnData[6]
  dMocState.b0TargetCoverage = listReturnData[7]
  dMocState.x2Leverage = listReturnData[8]
  dMocState.totalBTCAmount = listReturnData[9]
  dMocState.bitcoinMovingAverage = listReturnData[10]
  dMocState.b0BTCInrateBag = listReturnData[11]
  dMocState.b0BTCAmount = listReturnData[12]
  dMocState.b0DocAmount = listReturnData[13]
  dMocState.b0BproAmount = listReturnData[14]
  dMocState.x2BTCAmount = listReturnData[15]
  dMocState.x2DocAmount = listReturnData[16]
  dMocState.x2BproAmount = listReturnData[17]
  dMocState.globalCoverage = listReturnData[18]
  dMocState.reservePrecision = listReturnData[19]
  dMocState.mocPrecision = listReturnData[20]
  dMocState.x2Coverage = listReturnData[21]
  dMocState.bproPriceInRbtc = listReturnData[22]
  dMocState.bproPriceInUsd = listReturnData[23]
  dMocState.bproDiscountRate = listReturnData[24]
  dMocState.maxBproWithDiscount = listReturnData[25]
  dMocState.bproDiscountPrice = listReturnData[26]
  dMocState.bprox2PriceInRbtc = listReturnData[27]
  dMocState.bprox2PriceInBpro = listReturnData[28]
  dMocState.spotInrate = listReturnData[29]

  const commissionRatesTypes = {}

  if (appMode === 'MoC') {
    commissionRatesTypes.MINT_BPRO_FEES_RBTC = listReturnData[30]
    commissionRatesTypes.REDEEM_BPRO_FEES_RBTC = listReturnData[31]
    commissionRatesTypes.MINT_DOC_FEES_RBTC = listReturnData[32]
    commissionRatesTypes.REDEEM_DOC_FEES_RBTC = listReturnData[33]
    commissionRatesTypes.MINT_BTCX_FEES_RBTC = listReturnData[34]
    commissionRatesTypes.REDEEM_BTCX_FEES_RBTC = listReturnData[35]
    commissionRatesTypes.MINT_BPRO_FEES_MOC = listReturnData[36]
    commissionRatesTypes.REDEEM_BPRO_FEES_MOC = listReturnData[37]
    commissionRatesTypes.MINT_DOC_FEES_MOC = listReturnData[38]
    commissionRatesTypes.REDEEM_DOC_FEES_MOC = listReturnData[39]
    commissionRatesTypes.MINT_BTCX_FEES_MOC = listReturnData[40]
    commissionRatesTypes.REDEEM_BTCX_FEES_MOC = listReturnData[41]
  } else {
    commissionRatesTypes.MINT_RISKPRO_FEES_RESERVE = listReturnData[30]
    commissionRatesTypes.REDEEM_RISKPRO_FEES_RESERVE = listReturnData[31]
    commissionRatesTypes.MINT_STABLETOKEN_FEES_RESERVE = listReturnData[32]
    commissionRatesTypes.REDEEM_STABLETOKEN_FEES_RESERVE = listReturnData[33]
    commissionRatesTypes.MINT_RISKPROX_FEES_RESERVE = listReturnData[34]
    commissionRatesTypes.REDEEM_RISKPROX_FEES_RESERVE = listReturnData[35]
    commissionRatesTypes.MINT_RISKPRO_FEES_MOC = listReturnData[36]
    commissionRatesTypes.REDEEM_RISKPRO_FEES_MOC = listReturnData[37]
    commissionRatesTypes.MINT_STABLETOKEN_FEES_MOC = listReturnData[38]
    commissionRatesTypes.REDEEM_STABLETOKEN_FEES_MOC = listReturnData[39]
    commissionRatesTypes.MINT_RISKPROX_FEES_MOC = listReturnData[40]
    commissionRatesTypes.REDEEM_RISKPROX_FEES_MOC = listReturnData[41]
  }

  dMocState.commissionRatesTypes = commissionRatesTypes
  dMocState.dayBlockSpan = listReturnData[42]
  dMocState.blockSpan = listReturnData[43]
  dMocState.blocksToSettlement = listReturnData[44]
  dMocState.state = listReturnData[45]
  dMocState.lastPriceUpdateHeight = 0
  dMocState.paused = listReturnData[46]
  dMocState.liquidationEnabled = listReturnData[47]
  dMocState.protected = listReturnData[48]
  dMocState.getMoCToken = listReturnData[49]
  dMocState.getMoCPriceProvider = listReturnData[50]
  dMocState.getBtcPriceProvider = listReturnData[51]
  dMocState.getMoCVendors = listReturnData[52]

  // Commission rates
  let listMethodsRates
  if (appMode === 'MoC') {
    listMethodsRates = [
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_BPRO_FEES_RBTC).encodeABI(),
        'uint256'
      ], // 0
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_BPRO_FEES_RBTC).encodeABI(),
        'uint256'
      ], // 1
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_DOC_FEES_RBTC).encodeABI(),
        'uint256'
      ], // 2
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_DOC_FEES_RBTC).encodeABI(),
        'uint256'
      ], // 3
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_BTCX_FEES_RBTC).encodeABI(),
        'uint256'
      ], // 4
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_BTCX_FEES_RBTC).encodeABI(),
        'uint256'
      ], // 5
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_BPRO_FEES_MOC).encodeABI(),
        'uint256'
      ], // 6
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_BPRO_FEES_MOC).encodeABI(),
        'uint256'
      ], // 7
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_DOC_FEES_MOC).encodeABI(),
        'uint256'
      ], // 8
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_DOC_FEES_MOC).encodeABI(),
        'uint256'
      ], // 9
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_BTCX_FEES_MOC).encodeABI(),
        'uint256'
      ], // 10
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_BTCX_FEES_MOC).encodeABI(),
        'uint256'
      ] // 11
    ]
  } else {
    listMethodsRates = [
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_RISKPRO_FEES_RESERVE).encodeABI(),
        'uint256'
      ], // 0
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_RISKPRO_FEES_RESERVE).encodeABI(),
        'uint256'
      ], // 1
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_STABLETOKEN_FEES_RESERVE).encodeABI(),
        'uint256'
      ], // 2
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_STABLETOKEN_FEES_RESERVE).encodeABI(),
        'uint256'
      ], // 3
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_RISKPROX_FEES_RESERVE).encodeABI(),
        'uint256'
      ], // 4
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_RISKPROX_FEES_RESERVE).encodeABI(),
        'uint256'
      ], // 5
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_RISKPRO_FEES_MOC).encodeABI(),
        'uint256'
      ], // 6
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_RISKPRO_FEES_MOC).encodeABI(),
        'uint256'
      ], // 7
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_STABLETOKEN_FEES_MOC).encodeABI(),
        'uint256'
      ], // 8
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_STABLETOKEN_FEES_MOC).encodeABI(),
        'uint256'
      ], // 9
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.MINT_RISKPROX_FEES_MOC).encodeABI(),
        'uint256'
      ], // 10
      [
        mocinrate.options.address,
        mocinrate.methods.commissionRatesByTxType(dMocState.commissionRatesTypes.REDEEM_RISKPROX_FEES_MOC).encodeABI(),
        'uint256'
      ] // 11
    ]
  }

  // Remove decode result parameter
  const cleanListMethodsRates = listMethodsRates.map(x => [x[0], x[1]])

  const multicallResultRates = await multicall.methods.tryBlockAndAggregate(false, cleanListMethodsRates).call()

  const listReturnDataRates = multicallResultRates[2].map((item, itemIndex) => web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData))

  const commissionRates = {}

  if (appMode === 'MoC') {
    commissionRates.MINT_BPRO_FEES_RBTC = listReturnDataRates[0]
    commissionRates.REDEEM_BPRO_FEES_RBTC = listReturnDataRates[1]
    commissionRates.MINT_DOC_FEES_RBTC = listReturnDataRates[2]
    commissionRates.REDEEM_DOC_FEES_RBTC = listReturnDataRates[3]
    commissionRates.MINT_BTCX_FEES_RBTC = listReturnDataRates[4]
    commissionRates.REDEEM_BTCX_FEES_RBTC = listReturnDataRates[5]
    commissionRates.MINT_BPRO_FEES_MOC = listReturnDataRates[6]
    commissionRates.REDEEM_BPRO_FEES_MOC = listReturnDataRates[7]
    commissionRates.MINT_DOC_FEES_MOC = listReturnDataRates[8]
    commissionRates.REDEEM_DOC_FEES_MOC = listReturnDataRates[9]
    commissionRates.MINT_BTCX_FEES_MOC = listReturnDataRates[10]
    commissionRates.REDEEM_BTCX_FEES_MOC = listReturnDataRates[11]
  } else {
    commissionRates.MINT_RISKPRO_FEES_RESERVE = listReturnDataRates[0]
    commissionRates.REDEEM_RISKPRO_FEES_RESERVE = listReturnDataRates[1]
    commissionRates.MINT_STABLETOKEN_FEES_RESERVE = listReturnDataRates[2]
    commissionRates.REDEEM_STABLETOKEN_FEES_RESERVE = listReturnDataRates[3]
    commissionRates.MINT_RISKPROX_FEES_RESERVE = listReturnDataRates[4]
    commissionRates.REDEEM_RISKPROX_FEES_RESERVE = listReturnDataRates[5]
    commissionRates.MINT_RISKPRO_FEES_MOC = listReturnDataRates[6]
    commissionRates.REDEEM_RISKPRO_FEES_MOC = listReturnDataRates[7]
    commissionRates.MINT_STABLETOKEN_FEES_MOC = listReturnDataRates[8]
    commissionRates.REDEEM_STABLETOKEN_FEES_MOC = listReturnDataRates[9]
    commissionRates.MINT_RISKPROX_FEES_MOC = listReturnDataRates[10]
    commissionRates.REDEEM_RISKPROX_FEES_MOC = listReturnDataRates[11]
  }

  dMocState.commissionRates = commissionRates

  return dMocState
}

const userBalance = async (web3, dContracts, userAddress, appMode) => {

  const multicall = dContracts.contracts.multicall
  const moc = dContracts.contracts.moc
  const mocinrate = dContracts.contracts.mocinrate
  const moctoken = dContracts.contracts.moctoken
  const riskprotoken = dContracts.contracts.riskprotoken
  const stabletoken = dContracts.contracts.stabletoken

  console.log(`Reading user balance ... account: ${userAddress}`)

  const listMethods = [
    [moctoken.options.address, moctoken.methods.balanceOf(userAddress).encodeABI(), 'uint256'], // 0
    [moctoken.options.address, moctoken.methods.allowance(userAddress, moc.options.address).encodeABI(), 'uint256'], // 1
    [stabletoken.options.address, stabletoken.methods.balanceOf(userAddress).encodeABI(), 'uint256'], // 2
    [riskprotoken.options.address, riskprotoken.methods.balanceOf(userAddress).encodeABI(), 'uint256'] // 3
  ]

  if (appMode === 'MoC') {
    listMethods.push([multicall.options.address, multicall.methods.getEthBalance(userAddress).encodeABI(), 'uint256']) // 4
    listMethods.push([moc.options.address, moc.methods.docAmountToRedeem(userAddress).encodeABI(), 'uint256']) // 5
    listMethods.push([moc.options.address, moc.methods.bproxBalanceOf(BUCKET_X2, userAddress).encodeABI(), 'uint256']) // 6
    listMethods.push([multicall.options.address, multicall.methods.getEthBalance(userAddress).encodeABI(), 'uint256']) // 7
  } else {
    const reservetoken = dContracts.contracts.reservetoken
    listMethods.push([reservetoken.options.address, reservetoken.methods.balanceOf(userAddress).encodeABI(), 'uint256']) // 4
    listMethods.push([moc.options.address, moc.methods.stableTokenAmountToRedeem(userAddress).encodeABI(), 'uint256']) // 5
    listMethods.push([moc.options.address, moc.methods.riskProxBalanceOf(BUCKET_X2, userAddress).encodeABI(), 'uint256']) // 6
    listMethods.push([reservetoken.options.address, reservetoken.methods.allowance(userAddress, dContracts.contracts.moc._address).encodeABI(), 'uint256']) // 7
  }

  // Remove decode result parameter
  const cleanListMethods = listMethods.map(x => [x[0], x[1]])
  const multicallResult = await multicall.methods.tryBlockAndAggregate(false, cleanListMethods).call()
  const listReturnData = multicallResult[2].map((item, itemIndex) => web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData))

  const userBalance = {}
  userBalance.blockHeight = multicallResult[0]
  userBalance.mocBalance = listReturnData[0]
  userBalance.mocAllowance = listReturnData[1]
  userBalance.docBalance = listReturnData[2]
  userBalance.bproBalance = listReturnData[3]
  userBalance.rbtcBalance = listReturnData[4]
  userBalance.docToRedeem = listReturnData[5]
  userBalance.bprox2Balance = listReturnData[6]
  userBalance.spendableBalance = listReturnData[4]
  userBalance.reserveAllowance = listReturnData[7]
  userBalance.potentialBprox2MaxInterest = '0'
  userBalance.bProHoldIncentive = '0'
  userBalance.estimateGasMintBpro = '2000000'
  userBalance.estimateGasMintDoc = '2000000'
  userBalance.estimateGasMintBprox2 = '2000000'
  userBalance.userAddress = userAddress

  const calcMintInterest = await mocinrate.methods.calcMintInterestValues(BUCKET_X2, userBalance.rbtcBalance).call()

  userBalance.potentialBprox2MaxInterest = calcMintInterest

  return userBalance
}
/*
const calcCommission = async (web3, dContracts, dataContractStatus, reserveAmount, token, action) => {
  const vendorAddress = `${process.env.VENDOR_ADDRESS}`.toLowerCase()

  const multicall = dContracts.contracts.multicall
  const mocinrate = dContracts.contracts.mocinrate

  let mocType
  let reserveType
  switch (token) {
    case 'DOC':
      if (action === 'MINT') {
        reserveType = dataContractStatus.commissionRatesTypes.MINT_DOC_FEES_RBTC
        mocType = dataContractStatus.commissionRatesTypes.MINT_DOC_FEES_MOC
      } else {
        reserveType = dataContractStatus.commissionRatesTypes.REDEEM_DOC_FEES_RBTC
        mocType = dataContractStatus.commissionRatesTypes.REDEEM_DOC_FEES_MOC
      }
      break
    case 'BPRO':
      if (action === 'MINT') {
        reserveType = dataContractStatus.commissionRatesTypes.MINT_BPRO_FEES_RBTC
        mocType = dataContractStatus.commissionRatesTypes.MINT_BPRO_FEES_MOC
      } else {
        reserveType = dataContractStatus.commissionRatesTypes.REDEEM_BPRO_FEES_RBTC
        mocType = dataContractStatus.commissionRatesTypes.REDEEM_BPRO_FEES_MOC
      }
      break
    case 'BTCX':
      if (action === 'MINT') {
        reserveType = dataContractStatus.commissionRatesTypes.MINT_BTCX_FEES_RBTC
        mocType = dataContractStatus.commissionRatesTypes.MINT_BTCX_FEES_MOC
      } else {
        reserveType = dataContractStatus.commissionRatesTypes.REDEEM_BTCX_FEES_RBTC
        mocType = dataContractStatus.commissionRatesTypes.REDEEM_BTCX_FEES_MOC
      }
      break
    case 'STABLE':
      if (action === 'MINT') {
        reserveType = dataContractStatus.commissionRatesTypes.MINT_STABLETOKEN_FEES_RESERVE
        mocType = dataContractStatus.commissionRatesTypes.MINT_STABLETOKEN_FEES_MOC
      } else {
        reserveType = dataContractStatus.commissionRatesTypes.REDEEM_STABLETOKEN_FEES_RESERVE
        mocType = dataContractStatus.commissionRatesTypes.REDEEM_STABLETOKEN_FEES_MOC
      }
      break
    case 'RISKPRO':
      if (action === 'MINT') {
        reserveType = dataContractStatus.commissionRatesTypes.MINT_RISKPRO_FEES_RESERVE
        mocType = dataContractStatus.commissionRatesTypes.MINT_RISKPRO_FEES_MOC
      } else {
        reserveType = dataContractStatus.commissionRatesTypes.REDEEM_RISKPRO_FEES_RESERVE
        mocType = dataContractStatus.commissionRatesTypes.REDEEM_RISKPRO_FEES_MOC
      }
      break
    case 'RISKPROX':
      if (action === 'MINT') {
        reserveType = dataContractStatus.commissionRatesTypes.MINT_RISKPROX_FEES_RESERVE
        mocType = dataContractStatus.commissionRatesTypes.MINT_RISKPROX_FEES_MOC
      } else {
        reserveType = dataContractStatus.commissionRatesTypes.REDEEM_RISKPROX_FEES_RESERVE
        mocType = dataContractStatus.commissionRatesTypes.REDEEM_RISKPROX_FEES_MOC
      }
      break
  }

  // Calculate commission with multicall
  const listMethods = [
    [mocinrate.options.address, mocinrate.methods.calcCommissionValue(toContractPrecision(reserveAmount), reserveType).encodeABI(), 'uint256'], // 0
    [mocinrate.options.address, mocinrate.methods.calcCommissionValue(toContractPrecision(reserveAmount), mocType).encodeABI(), 'uint256'], // 1
    [mocinrate.options.address, mocinrate.methods.calculateVendorMarkup(vendorAddress, toContractPrecision(reserveAmount)).encodeABI(), 'uint256'] // 2
  ]

  // Remove decode result parameter
  const cleanListMethods = listMethods.map(x => [x[0], x[1]])

  // Multicall results
  const multicallResult = await multicall.methods.tryBlockAndAggregate(false, cleanListMethods).call()

  // Decode multicall
  const listReturnData = multicallResult[2].map((item, itemIndex) => web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData))

  // Dictionary commissions
  const commission = {}
  commission.commission_reserve = listReturnData[0]
  commission.commission_moc = listReturnData[1]
  commission.vendorMarkup = listReturnData[2]

  return commission
}

const omocInfoAddress = async (web3, dContracts, userAddress, vestingAddress) => {
  const multicall = dContracts.contracts.multicall
  const istakingmachine = dContracts.contracts.istakingmachine
  const idelaymachine = dContracts.contracts.idelaymachine
  const isupporters = dContracts.contracts.isupporters
  const ivestingmachine = dContracts.contracts.ivestingmachine
  const ivestingfactory = dContracts.contracts.ivestingfactory
  const moctoken = dContracts.contracts.moctoken

  const listMethods = [
    [istakingmachine.options.address, istakingmachine.methods.getBalance(userAddress).encodeABI(), 'uint256'], // 0
    [istakingmachine.options.address, istakingmachine.methods.getLockedBalance(userAddress).encodeABI(), 'uint256'], // 1
    //[istakingmachine.options.address, istakingmachine.methods.getLockingInfo(userAddress).encodeABI(), ['uint256', 'uint256']], // 2
    [istakingmachine.options.address, istakingmachine.methods.getLockingInfo(userAddress).encodeABI(), [{ type: 'uint256', name: 'amount' }, { type: 'uint256', name: 'untilTimestamp' }]], // 2
    [istakingmachine.options.address, istakingmachine.methods.getWithdrawLockTime().encodeABI(), 'uint256'], // 3
    [istakingmachine.options.address, istakingmachine.methods.getSupporters().encodeABI(), 'address'], // 4
    [istakingmachine.options.address, istakingmachine.methods.getOracleManager().encodeABI(), 'address'], // 5
    [istakingmachine.options.address, istakingmachine.methods.getDelayMachine().encodeABI(), 'address'], // 6
    [idelaymachine.options.address, idelaymachine.methods.getTransactions(userAddress).encodeABI(), [{ type: 'uint256[]', name: 'ids' }, { type: 'uint256[]', name: 'amounts' }, { type: 'uint256[]', name: 'expirations' }]], // 7
    [idelaymachine.options.address, idelaymachine.methods.getBalance(userAddress).encodeABI(), 'uint256'], // 8
    [idelaymachine.options.address, idelaymachine.methods.getLastId().encodeABI(), 'uint256'], // 9
    [idelaymachine.options.address, idelaymachine.methods.getSource().encodeABI(), 'address'], // 10
    [isupporters.options.address, isupporters.methods.isReadyToDistribute().encodeABI(), 'bool'], // 11
    [isupporters.options.address, isupporters.methods.mocToken().encodeABI(), 'address'], // 12
    [isupporters.options.address, isupporters.methods.period().encodeABI(), 'uint256'], // 13
    [isupporters.options.address, isupporters.methods.totalMoc().encodeABI(), 'uint256'], // 14
    [isupporters.options.address, isupporters.methods.totalToken().encodeABI(), 'uint256'], // 15
    [moctoken.options.address, moctoken.methods.balanceOf(userAddress).encodeABI(), 'uint256'], // 16
    [moctoken.options.address, moctoken.methods.allowance(userAddress, istakingmachine.options.address).encodeABI(), 'uint256'], // 17
    [ivestingfactory.options.address, ivestingfactory.methods.isTGEConfigured().encodeABI(), 'bool'], // 18
    [ivestingfactory.options.address, ivestingfactory.methods.getTGETimestamp().encodeABI(), 'uint256'] // 19
  ]

  if (vestingAddress) {
    listMethods.push([ivestingmachine.options.address, ivestingmachine.methods.getParameters().encodeABI(), [{ type: 'uint256[]', name: 'percentages' }, { type: 'uint256[]', name: 'timeDeltas' }]]) // 20
    listMethods.push([ivestingmachine.options.address, ivestingmachine.methods.getHolder().encodeABI(), 'address']) // 21
    listMethods.push([ivestingmachine.options.address, ivestingmachine.methods.getLocked().encodeABI(), 'uint256']) // 22
    listMethods.push([ivestingmachine.options.address, ivestingmachine.methods.getAvailable().encodeABI(), 'uint256']) // 23
    listMethods.push([ivestingmachine.options.address, ivestingmachine.methods.isVerified().encodeABI(), 'bool']) // 24
    listMethods.push([ivestingmachine.options.address, ivestingmachine.methods.getTotal().encodeABI(), 'uint256']) // 25
    listMethods.push([moctoken.options.address, moctoken.methods.balanceOf(ivestingmachine.options.address).encodeABI(), 'uint256']) // 26
  }

  // Remove decode result parameter
  const cleanListMethods = listMethods.map(x => [x[0], x[1]])

  // Multicall results
  const multicallResult = await multicall.methods.tryBlockAndAggregate(false, cleanListMethods).call()

  const listReturnData = []
  let itemIndex = 0
  for (const item of multicallResult[2]) {
    if (typeof listMethods[itemIndex][2] === 'string') {
      listReturnData.push(web3.eth.abi.decodeParameter(listMethods[itemIndex][2], item.returnData))
    } else {
      listReturnData.push(web3.eth.abi.decodeParameters(listMethods[itemIndex][2], item.returnData))
    }
    itemIndex += 1
  }

  // Dictionary info
  const omocInfo = {}
  omocInfo.userAddress = userAddress
  omocInfo.vestingAddress = vestingAddress
  omocInfo.mocBalance = listReturnData[16]
  omocInfo.stakingmachine = {}
  omocInfo.stakingmachine.getBalance = listReturnData[0]
  omocInfo.stakingmachine.getLockedBalance = listReturnData[1]
  omocInfo.stakingmachine.getLockingInfo = listReturnData[2]
  omocInfo.stakingmachine.getWithdrawLockTime = listReturnData[3]
  omocInfo.stakingmachine.getSupporters = listReturnData[4]
  omocInfo.stakingmachine.getOracleManager = listReturnData[5]
  omocInfo.stakingmachine.getDelayMachine = listReturnData[6]
  omocInfo.stakingmachine.mocAllowance = listReturnData[17]
  omocInfo.delaymachine = {}
  omocInfo.delaymachine.getTransactions = listReturnData[7]
  omocInfo.delaymachine.getBalance = listReturnData[8]
  omocInfo.delaymachine.getLastId = listReturnData[9]
  omocInfo.delaymachine.getSource = listReturnData[10]
  omocInfo.supporters = {}
  omocInfo.supporters.isReadyToDistribute = listReturnData[11]
  omocInfo.supporters.mocToken = listReturnData[12]
  omocInfo.supporters.period = listReturnData[13]
  omocInfo.supporters.totalMoc = listReturnData[14]
  omocInfo.supporters.totalToken = listReturnData[15]
  omocInfo.vestingfactory = {}
  omocInfo.vestingfactory.isTGEConfigured = listReturnData[18]
  omocInfo.vestingfactory.getTGETimestamp = listReturnData[19]

  if (vestingAddress) {
    omocInfo.vestingmachine = {}
    omocInfo.vestingmachine.getParameters = listReturnData[20]
    omocInfo.vestingmachine.getHolder = listReturnData[21]
    omocInfo.vestingmachine.getLocked = listReturnData[22]
    omocInfo.vestingmachine.getAvailable = listReturnData[23]
    omocInfo.vestingmachine.isVerified = listReturnData[24]
    omocInfo.vestingmachine.getTotal = listReturnData[25]
    omocInfo.vestingmachine.mocBalance = listReturnData[26]
  } else {
    omocInfo.vestingmachine = {}
    omocInfo.vestingmachine.getParameters = ''
    omocInfo.vestingmachine.getHolder = ''
    omocInfo.vestingmachine.getLocked = ''
    omocInfo.vestingmachine.getAvailable = ''
    omocInfo.vestingmachine.isVerified = ''
    omocInfo.vestingmachine.getTotal = ''
    omocInfo.vestingmachine.mocBalance = ''
  }

  return omocInfo
}
*/


export {
  connectorAddresses,
  registryAddresses,
  contractStatus,
  userBalance
  };