import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ourbrwsyctgagnzijexz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iKhpRJPSVSYHCzrMPYK4Q_baqB_jGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    alert('1. Старт');
    const tap_btn = document.querySelector(".click-btn");
    alert('2. Кнопка: ' + !!tap_btn);
    const quantity_text = document.querySelector(".text-quantity");
    alert('3. Текст: ' + !!quantity_text);

    let userId = 123456789;
    let userName = "Player";

    if (window.Telegram && window.Telegram.WebApp) {
        alert('4. Telegram есть');
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id;
            userName = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name || "Player";
            alert('5. Пользователь: ' + userName);
        } else {
            alert('5. Нет данных пользователя');
        }
    } else {
        alert('4. Не в Telegram');
    }

    alert('6. ID: ' + userId);

    async function getOrCreateUser() {
        alert('7. Ищем в БД...');
        const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('coins, multitap')
            .eq('id', userId)
            .single();

        if (findError) {
            alert('8. Ошибка поиска: ' + JSON.stringify(findError));
        }

        if (existingUser) {
            alert('9. Найден! coins=' + existingUser.coins + ' multitap=' + existingUser.multitap);
            return existingUser;
        }

        alert('10. Не найден, создаём...');
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ id: userId, username: userName, coins: 0, multitap: 1 })
            .select('coins, multitap')
            .single();

        if (insertError) {
            alert('11. Ошибка создания: ' + JSON.stringify(insertError));
        }

        alert('12. Создан! coins=' + newUser?.coins + ' multitap=' + newUser?.multitap);
        return newUser || { coins: 0, multitap: 1 };
    }

    const data = await getOrCreateUser();
    alert('13. data.coins=' + data.coins + ' data.multitap=' + data.multitap);

    let coins = data.coins;
    let multitap = data.multitap;

    quantity_text.textContent = `${coins} coins`;
    alert('14. Экран обновлён: ' + coins + ' coins');

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
    alert('15. Готово, ждём клики');
});
