document.addEventListener("DOMContentLoaded", () => {
    const accountButton = document.querySelector(".account-button");
    const accountName = document.querySelector(".name-text");
    const tonBalance = document.querySelector(".TON-quantity");

    let userName = 'player';

    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            userName = user.username || user.first_name || 'player';
        }
    }

    // TonConnect UI — используем правильный объект
    if (typeof TON_CONNECT_UI !== 'undefined') {
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://simple-coin-silk.vercel.app/tonconnect-manifest.json'
        });

        // Вставляем кнопку подключения
        const buttonContainer = document.getElementById("unsignedTONwallet");
        buttonContainer.innerHTML = '';
        const button = document.createElement('div');
        button.id = 'ton-connect-button';
        buttonContainer.appendChild(button);
        
        tonConnectUI.uiOptions = { buttonRootId: 'ton-connect-button' };

        tonConnectUI.onStatusChange(async (wallet) => {
            if (wallet) {
                document.getElementById("unsignedTONwallet").style.display = "none";
                document.getElementById("signedTONwallet").style.display = "block";
                getBalance(wallet.account.address);
            }
        });
    }

    async function getBalance(address) {
        if (!address) return;
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

    accountButton.addEventListener("click", clickAccountButton);
});
