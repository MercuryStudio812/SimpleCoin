document.addEventListener("DOMContentLoaded", () => {
    alert('1. DOM загружен');

    const accountButton = document.querySelector(".account-button");
    const tonSignButton = document.querySelector(".sign-TON-wallet");
    const accountName = document.querySelector(".name-text");
    const tonBalance = document.querySelector(".TON-quantity");
    const simpleBalance = document.querySelector(".SIMPLE-quantity");

    let connector = null;

    if (typeof TonConnectSDK !== 'undefined') {
        alert('2. TonConnectSDK найден');
        
        connector = new TonConnectSDK.TonConnect({
            manifestUrl: 'https://simple-coin-silk.vercel.app/tonconnect-manifest.json'
        });
        alert('3. Коннектор создан');

        if (connector.wallet) {
            alert('4. Кошелёк уже подключён: ' + connector.wallet.account.address);
            document.getElementById("unsignedTONwallet").style.display = "none";
            document.getElementById("signedTONwallet").style.display = "block";
            getBalance(connector.wallet.account.address);
        } else {
            alert('4. Кошелёк ещё не подключён');
        }

        connector.onStatusChange((wallet) => {
            alert('5. Статус изменился');
            if (wallet) {
                alert('6. Кошелёк подключён: ' + wallet.account.address);
                document.getElementById("unsignedTONwallet").style.display = "none";
                document.getElementById("signedTONwallet").style.display = "block";
                getBalance(wallet.account.address);
            } else {
                alert('6. Кошелёк отключён');
            }
        });
    } else {
        alert('2. TonConnectSDK НЕ найден!');
    }

    let userName = 'player';

    if (window.Telegram && window.Telegram.WebApp) {
        alert('7. Telegram WebApp найден');
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            userName = user.username || user.first_name || 'player';
            alert('8. Пользователь: ' + userName);
        } else {
            alert('8. Нет данных пользователя');
        }
    } else {
        alert('7. Не в Telegram (браузер)');
    }

    async function getBalance(address) {
        alert('9. Запрашиваю баланс для: ' + address.slice(0, 10) + '...');
        if (!address) {
            alert('9. Ошибка: адрес пустой');
            return;
        }
        try {
            const response = await fetch(`https://tonapi.io/v2/accounts/${address}`);
            const data = await response.json();
            const balanceTON = (data.balance / 1_000_000_000).toFixed(2);
            tonBalance.textContent = `${balanceTON} TON`;
            alert('10. Баланс: ' + balanceTON + ' TON');
        } catch (error) {
            tonBalance.textContent = 'Ошибка';
            alert('10. Ошибка получения баланса: ' + error);
        }
    }

    function clickAccountButton() {
        alert('A. Открываю аккаунт');
        document.getElementById("ld").style.display = "none";
        document.getElementById("main").style.display = "none";
        document.getElementById("acc").style.display = "block";
        accountName.textContent = userName;
    }

    async function TONWalletSign() {
        alert('B. Нажата кнопка привязки');
        if (!connector) {
            alert('B. Ошибка: коннектор не создан');
            return;
        }
        try {
            alert('C. Получаю список кошельков...');
            const wallets = await connector.getWallets();
            alert('D. Кошельков найдено: ' + (wallets ? wallets.length : 0));
            
            if (!wallets || wallets.length === 0) {
                alert('E. Кошельки не найдены! Установите Tonkeeper');
                return;
            }
            
            alert('F. Подключаюсь к: ' + wallets[0].name);
            const connectedWallet = await connector.connect(wallets[0]);
            
            if (connectedWallet && connectedWallet.account) {
                alert('H. Адрес из connect: ' + connectedWallet.account.address);
                document.getElementById("unsignedTONwallet").style.display = "none";
                document.getElementById("signedTONwallet").style.display = "block";
                getBalance(connectedWallet.account.address);
            } else {
                alert('H. Не удалось получить адрес');
            }
        } catch (error) {
            alert('ОШИБКА: ' + error.message);
            console.log(error);
        }
    }

    accountButton.addEventListener("click", clickAccountButton);
    tonSignButton.addEventListener("click", TONWalletSign);
    alert('Готово! Все обработчики повешены.');
});
