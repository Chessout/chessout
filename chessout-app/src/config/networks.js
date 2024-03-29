// Customized with our walletConnectV2ProjectId
export const networkConfig = {
    devnet: {
        skipFetchFromServer: true,
        id: 'devnet',
        shortId: 'D',
        name: 'Devnet',
        egldLabel: 'xEGLD',
        egldDenomination: '18',
        decimals: '4',
        gasPerDataByte: '1500',
        walletConnectDeepLink:
            'https://maiar.page.link/?apn=com.multiversx.maiar.wallet&isi=1519405832&ibi=com.multiversx.maiar.wallet&link=https://maiar.com/',
        walletConnectBridgeAddresses: ['https://bridge.walletconnect.org'],
        walletAddress: 'https://devnet-wallet.multiversx.com',
        apiAddress: 'https://devnet-api.multiversx.com',
        explorerAddress: 'https://devnet-explorer.multiversx.com',
        apiTimeout: '6000',
        walletConnectV2ProjectId: '53d57eb30ff708437ff141a5c621027f'
    },

    testnet: {
        skipFetchFromServer: true,
        id: 'testnet',
        shortId: 'T',
        name: 'Testnet',
        egldLabel: 'xEGLD',
        egldDenomination: '18',
        decimals: '4',
        gasPerDataByte: '1500',
        walletConnectDeepLink:
            'https://maiar.page.link/?apn=com.multiversx.maiar.wallet&isi=1519405832&ibi=com.multiversx.maiar.wallet&link=https://maiar.com/',
        walletConnectBridgeAddresses: ['https://bridge.walletconnect.org'],
        walletAddress: 'https://testnet-wallet.multiversx.com',
        apiAddress: 'https://testnet-api.multiversx.com',
        explorerAddress: 'https://testnet-explorer.multiversx.com',
        apiTimeout: '6000',
        walletConnectV2ProjectId: '53d57eb30ff708437ff141a5c621027f'
    },

    mainnet: {
        skipFetchFromServer: true,
        id: 'mainnet',
        shortId: '1',
        name: 'Mainnet',
        egldLabel: 'EGLD',
        egldDenomination: '18',
        decimals: '4',
        gasPerDataByte: '1500',
        walletConnectDeepLink:
            'https://maiar.page.link/?apn=com.multiversx.maiar.wallet&isi=1519405832&ibi=com.multiversx.maiar.wallet&link=https://maiar.com/',
        walletConnectBridgeAddresses: ['https://bridge.walletconnect.org'],
        walletAddress: 'https://wallet.multiversx.com',
        apiAddress: 'https://api.multiversx.com',
        explorerAddress: 'https://explorer.multiversx.com',
        apiTimeout: '6000',
        walletConnectV2ProjectId: '53d57eb30ff708437ff141a5c621027f'
    },
};