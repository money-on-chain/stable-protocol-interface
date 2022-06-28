import { toContract } from '../numberHelper';
import nodeManagerBase from './nodeManagerBase';
import nodeManagerStaking from './nodeManagerStaking';

const BigNumber = require('bignumber.js');

export default async function nodeManagerMoc({
    web3,
    contracts,
    partialExecutionSteps,
    priceFeed,
    gasPrice
}) {
    // TODO: try not repeat this in both nodemanagers
    const strToBytes32 = (bucket) => web3.utils.asciiToHex(bucket, 32);
    const bucketX2 = 'X2';

    const { moc } = contracts;

    // Base functions
    const base = await nodeManagerBase({
        web3,
        contracts,
        partialExecutionSteps,
        priceFeed,
        gasPrice,
        appMode: 'MoC'
    });

    const staking = await nodeManagerStaking({
        web3,
        contracts,
        gasPrice,
        getAccount: base.getAccount
    });

    const  vendor  = {
      address: "0xf69287F5Ca3cC3C6d3981f2412109110cB8af076",
      markup: "500000000000000"
    };

    // MoC functions
    const mocFunctions = {};

    mocFunctions.getSpendableBalance = (address) =>
        web3.eth.getBalance(address);
    mocFunctions.getReserveAllowance = (address) =>
        web3.eth.getBalance(address);

    const addCommissionAndVendorMarkup = async (
        weiAmount,
        transactionType,
        commissionCurrencyCode
    ) => {
        let result = new BigNumber(weiAmount);
        if (commissionCurrencyCode === 'RESERVE') {
            const commissionValue = new BigNumber(
                await base.calcCommissionValue(weiAmount, transactionType)
            );
            const vendorMarkup = new BigNumber(
                await base.calculateVendorMarkup(vendor.address, weiAmount)
            );
            result = result.plus(commissionValue).plus(vendorMarkup);
        }
        return result;
    };

    mocFunctions.mintBpro = async (
        btcAmount,
        userToleranceAmount,
        transactionType,
        commissionCurrencyCode,
        callback
    ) => {
        const from = await base.getAccount();
        const weiAmount = toContract(web3.utils.toWei(btcAmount, 'ether'));

        let totalBtcAmount = await addCommissionAndVendorMarkup(
            weiAmount,
            transactionType,
            commissionCurrencyCode
        );

        totalBtcAmount = toContract(
            new BigNumber(totalBtcAmount).plus(
                new BigNumber(userToleranceAmount)
            )
        );

        const duplicateEstimateGasMintBpro =
            2 *
            (await mocFunctions.estimateGasMintBpro(
                from,
                weiAmount,
                totalBtcAmount
            ));

        return moc.methods.mintBProVendors(weiAmount, vendor.address).send(
            {
                from,
                value: totalBtcAmount,
                gasPrice: await gasPrice(),
                gas: duplicateEstimateGasMintBpro,
                gasLimit: duplicateEstimateGasMintBpro
            },
            callback
        );
    };

    mocFunctions.estimateGasMintBpro = async (
        address,
        weiAmount,
        totalBtcAmount
    ) =>
        moc.methods.mintBProVendors(weiAmount, vendor.address).estimateGas({
            from: address,
            value: totalBtcAmount
        });

    mocFunctions.mintBprox2 = async (
        btcAmount,
        userToleranceAmount,
        transactionType,
        commissionCurrencyCode,
        callback
    ) => {
        const from = await base.getAccount();
        const weiAmount = toContract(web3.utils.toWei(btcAmount, 'ether'));
        const btcInterestAmount = await base.calcMintInterestValues(weiAmount);

        let totalBtcAmount = await addCommissionAndVendorMarkup(
            weiAmount,
            transactionType,
            commissionCurrencyCode
        );

        totalBtcAmount = toContract(
            new BigNumber(totalBtcAmount)
                .plus(new BigNumber(btcInterestAmount))
                .plus(new BigNumber(userToleranceAmount))
        );

        const duplicateEstimateGasMintBprox2 =
            2 *
            (await mocFunctions.estimateGasMintBprox2(
                from,
                weiAmount,
                totalBtcAmount
            ));
        return moc.methods
            .mintBProxVendors(strToBytes32(bucketX2), weiAmount, vendor.address)
            .send(
                {
                    from,
                    value: totalBtcAmount,
                    gasPrice: await gasPrice(),
                    gas: duplicateEstimateGasMintBprox2,
                    gasLimit: duplicateEstimateGasMintBprox2
                },
                callback
            );
    };

    mocFunctions.estimateGasMintBprox2 = async (
        address,
        weiAmount,
        totalBtcAmount
    ) =>
        moc.methods
            .mintBProxVendors(strToBytes32(bucketX2), weiAmount, vendor.address)
            .estimateGas({ from: address, value: totalBtcAmount });

    mocFunctions.mintDoc = async (
        btcAmount,
        userToleranceAmount,
        transactionType,
        commissionCurrencyCode,
        callback
    ) => {
        const from = await base.getAccount();
        const weiAmount = toContract(web3.utils.toWei(btcAmount, 'ether'));

        let totalBtcAmount = await addCommissionAndVendorMarkup(
            weiAmount,
            transactionType,
            commissionCurrencyCode
        );

        totalBtcAmount = toContract(
            new BigNumber(totalBtcAmount).plus(
                new BigNumber(userToleranceAmount)
            )
        );

        const duplicateEstimateGasMintDoc =
            2 *
            (await mocFunctions.estimateGasMintDoc(
                from,
                weiAmount,
                totalBtcAmount
            ));
        return moc.methods.mintDocVendors(weiAmount, vendor.address).send(
            {
                from,
                value: totalBtcAmount,
                gasPrice: await gasPrice(),
                gas: duplicateEstimateGasMintDoc,
                gasLimit: duplicateEstimateGasMintDoc
            },
            callback
        );
    };

    mocFunctions.estimateGasMintDoc = async (
        address,
        weiAmount,
        totalBtcAmount
    ) =>
        moc.methods.mintDocVendors(weiAmount, vendor.address).estimateGas({
            from: address,
            value: totalBtcAmount
        });

    return { ...base, ...mocFunctions, staking };
};
