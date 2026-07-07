document.addEventListener("DOMContentLoaded", () => {
    const accountButton = document.querySelector(".account-button");
    const tonSignButton = document.querySelector(".sign-TON-wallet");
    const accountName = document.querySelector(".name-text");
    const tonBalance = document.querySelector(".TON-quantity");
    const simpleBalance = document.querySelector(".SIMPLE-quantity");

    let connector = null;

    // Инициализируем TON Connect только если библиотека загружена
    if (typeof TonConnectSDK !== 'undefined') {
        connector = new TonConnectSDK.TonConnect({
            manifestUrl: 'https://simple-coin-silk.vercel.app/tonconnect-manifest.json'
        });

        if (connector.connected) {
            const wallet = connector.wallet;
            getBalance(wallet.account.address);
            document.getElementById("unsignedTONwallet").style.display = "none";
            document.getElementById("signedTONwallet").style.display = "block";
        }
    }

    let userName = 'player';

    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            userName = user.username || user.first_name || 'player';
        }
    }

    async function getBalance(address) {
        try {
            const response = await fetch(`https://tonapi.io/v2/accounts/${address}`);
            const data = await response.json();
            const balanceTON = (data.balance / 1_000_000_000).toFixed(2);
            tonBalance.textContent = `${balanceTON} TON`;
        } catch (error) {
            tonBalance.textContent = 'Ошибка';
        }
    }

    function clickAccountButton() {
        document.getElementById("ld").style.display = "none";
        document.getElementById("main").style.display = "none";
        document.getElementById("acc").style.display = "block";
        accountName.textContent = userName;
    }

    async function TONWalletSign() {
        if (!connector) {
            alert('TON Connect не загружен');
            return;
        }
        try {
            const wallets = await connector.getWallets();
            await connector.connect(wallets[0]);
            const wallet = connector.wallet;
            getBalance(wallet.account.address);

            document.getElementById("unsignedTONwallet").style.display = "none";
            document.getElementById("signedTONwallet").style.display = "block";
        } catch (error) {
            console.log(error);
        }
    }

    accountButton.addEventListener("click", clickAccountButton);
    tonSignButton.addEventListener("click", TONWalletSign);
});
