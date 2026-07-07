import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ourbrwsyctgagnzijexz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iKhpRJPSVSYHCzrMPYK4Q_baqB_jGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    alert('1. Старт');
    const tap_btn = document.querySelector(".click-btn");
    const quantity_text = document.querySelector(".text-quantity");
    alert('2. Кнопка и текст найдены');

    let userId = 123456789;
    let userName = "Player";

    if (window.Telegram && window.Telegram.WebApp) {
        alert('3. Telegram найден');
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id;
            userName = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name || "Player";
            alert('4. Пользователь: ' + userName);
        }
    } else {
        alert('3. Браузер, не Telegram');
    }

    async function getOrCreateUser() {
        alert('5. Ищем в БД...');
        const { data: existingUser } = await supabase
            .from('users')
            .select('coins, multitap')
            .eq('id', userId)
            .single();

        if (existingUser) {
            alert('6. Найден: coins=' + existingUser.coins + ' multitap=' + existingUser.multitap);
            return existingUser;
        }

        alert('7. Создаём нового...');
        const { data: newUser } = await supabase
            .from('users')
            .insert({ id: userId, username: userName, coins: 0, multitap: 1 })
            .select('coins, multitap')
            .single();

        alert('8. Создан: coins=' + (newUser ? newUser.coins : '?') + ' multitap=' + (newUser ? newUser.multitap : '?'));
        return newUser || { coins: 0, multitap: 1 };
    }

    const data = await getOrCreateUser();
    alert('9. Итог: coins=' + data.coins + ' multitap=' + data.multitap);

    let coins = data.coins;
    let multitap = data.multitap;

    quantity_text.textContent = `${coins} coins`;
    alert('10. Готово');

    async function upgrade() {
        multitap += 1;
        await supabase.from('users').update({ multitap: multitap }).eq('id', userId);
    }

    async function tap() {
        coins += multitap;
        quantity_text.textContent = `${coins} coins`;

        await supabase
            .from('users')
            .update({ coins: coins, last_click: new Date().toISOString() })
            .eq('id', userId);
    }

    tap_btn.addEventListener("click", tap);
});
