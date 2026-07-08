import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ourbrwsyctgagnzijexz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iKhpRJPSVSYHCzrMPYK4Q_baqB_jGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    alert('1. Старт');
    const tap_btn = document.querySelector(".click-btn");
    const quantity_text = document.querySelector(".text-quantity");
    const upgrade_button = document.querySelector(".upgrade-button");
    const upgrade_price = document.querySelector(".upgrade-price");
    const multitap_text = document.querySelector(".click-text");
    const buy_farm_button = document.querySelector(".buy-farm");
    alert('2. Кнопки найдены');

    let userId = 123456789;
    let userName = "Player";

    if (window.Telegram && window.Telegram.WebApp) {
        alert('3. Telegram есть');
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id;
            userName = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name || "Player";
            alert('4. Пользователь: ' + userName + ', ID: ' + userId);
        }
    } else {
        alert('3. Браузер');
    }

    async function offlineFarmCash() {
        alert('OFFLINE: 1. Запрашиваю данные фермы...');
        const { data: farmData } = await supabase
            .from('users')
            .select('last_click, offline_income')
            .eq('id', userId)
            .single();
        alert('OFFLINE: 2. Данные: ' + JSON.stringify(farmData));

        if (!farmData || !farmData.last_click || !farmData.offline_income) {
            alert('OFFLINE: 3. Нет данных, выход');
            return 0;
        }

        const now = new Date();
        const lastClick = new Date(farmData.last_click);
        const secondsAway = Math.floor((now - lastClick) / 1000);
        const cappedSeconds = Math.min(secondsAway, 14400);
        const earned = cappedSeconds * farmData.offline_income;
        alert('OFFLINE: 4. Секунд: ' + secondsAway + ', заработано: ' + earned);

        if (earned > 0) {
            alert('OFFLINE: 5. Начисляю ' + earned + ' coins');
            coins += earned;
            await supabase.from('users').update({ coins: coins }).eq('id', userId);
            quantity_text.textContent = `${coins} coins`;
        }

        return earned;
    }

    async function getOrCreateUser() {
        alert('DB: 1. Ищем пользователя...');
        const { data: existingUser } = await supabase
            .from('users')
            .select('coins, multitap, offline_income')
            .eq('id', userId)
            .single();
        alert('DB: 2. existingUser: ' + JSON.stringify(existingUser));

        if (existingUser) {
            alert('DB: 3. Найден, возвращаю');
            return existingUser;
        }

        alert('DB: 4. Создаём нового...');
        const { data: newUser } = await supabase
            .from('users')
            .insert({ id: userId, username: userName, coins: 0, multitap: 1, offline_income: 0 })
            .select('coins, multitap, offline_income')
            .single();
        alert('DB: 5. newUser: ' + JSON.stringify(newUser));

        return newUser || { coins: 0, multitap: 1, offline_income: 0 };
    }

    const data = await getOrCreateUser();
    alert('5. data: ' + JSON.stringify(data));
    let coins = data.coins;
    let multitap = data.multitap;
    let upgradePrice = multitap * multitap * 200;
    alert('6. coins=' + coins + ' multitap=' + multitap + ' offline_income=' + data.offline_income);

    const { data: farmInfo } = await supabase
        .from('users')
        .select('offline_income')
        .eq('id', userId)
        .single();
    alert('7. farmInfo: ' + JSON.stringify(farmInfo));

    if (farmInfo && farmInfo.offline_income > 0) {
        alert('8. Ферма есть, показываю signed-farm и запускаю оффлайн-доход');
        document.getElementById("unsigned-farm").style.display = "none";
        document.getElementById("signed-farm").style.display = "block";
        await offlineFarmCash();
    } else {
        alert('8. Фермы нет');
    }

    quantity_text.textContent = `${coins} coins`;
    if (upgrade_price) {
        upgrade_price.textContent = `${upgradePrice} coins`;
    }
    if (multitap_text) {
        multitap_text.textContent = `click: +${multitap} coins`;
    }
    alert('9. Экран обновлён, готово');

    async function upgrade() {
        alert('UPGRADE: 1. Нажата кнопка');
        if (coins < upgradePrice) {
            alert('UPGRADE: Недостаточно монет!');
            return;
        }
        coins -= upgradePrice;
        multitap += 1;
        upgradePrice = multitap * multitap * 200;

        quantity_text.textContent = `${coins} coins`;
        if (upgrade_price) upgrade_price.textContent = `${upgradePrice} coins`;
        if (multitap_text) multitap_text.textContent = `click: +${multitap} coins`;

        await supabase.from('users').update({ coins: coins, multitap: multitap }).eq('id', userId);
        alert('UPGRADE: 2. Сохранено, multitap=' + multitap);
    }

    async function tap() {
        coins += multitap;
        quantity_text.textContent = `${coins} coins`;

        await supabase
            .from('users')
            .update({ coins: coins, last_click: new Date().toISOString() })
            .eq('id', userId);
    }

    async function buyFarm() {
        alert('FARM: 1. Нажата покупка, coins=' + coins);
        if (coins < 20000) {
            alert('FARM: Недостаточно монет!');
            return;
        }
        coins -= 20000;
        alert('FARM: 2. Списано, coins=' + coins);

        document.getElementById("unsigned-farm").style.display = "none";
        document.getElementById("signed-farm").style.display = "block";
        quantity_text.textContent = `${coins} coins`;

        const { error } = await supabase
            .from('users')
            .update({ offline_income: 1, coins: coins })
            .eq('id', userId);
        
        if (error) {
            alert('FARM: Ошибка сохранения: ' + JSON.stringify(error));
        } else {
            alert('FARM: 3. Сохранено в БД');
        }
    }

    tap_btn.addEventListener("click", tap);
    if (upgrade_button) upgrade_button.addEventListener("click", upgrade);
    if (buy_farm_button) {
        buy_farm_button.addEventListener("click", buyFarm);
    } else {
        alert('Кнопка buy-farm не найдена!');
    }
    alert('10. Всё готово');
});
