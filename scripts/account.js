document.addEventListener("DOMContentLoaded", () => {
    const accountButton = document.querySelector(".account-button");
    const accountName = document.querySelector(".name-text");

    let userName = 'player';

    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            userName = user.username || user.first_name || 'player';
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
