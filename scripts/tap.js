import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ourbrwsyctgagnzijexz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iKhpRJPSVSYHCzrMPYK4Q_baqB_jGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const tap_btn = document.querySelector(".click-btn");
    const quantity_text = document.querySelector(".text-quantity");

    const userId = 123456789;

    async function getOrCreateUser() {
        const { data: existingUser, error: findError } = await supabase
            .from('users')
            .select('coins')
            .eq('id', userId)
            .single();

        if (findError) {
            alert('Ошибка поиска: ' + JSON.stringify(findError));
            return 0;
        }

        if (existingUser) return existingUser.coins;

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ id: userId, username: 'player', coins: 0 })
            .select('coins')
            .single();

        if (insertError) {
            alert('Ошибка создания: ' + JSON.stringify(insertError));
            return 0;
        }

        return newUser.coins;
    }

    let coins = await getOrCreateUser();
    quantity_text.textContent = `${coins} coins`;

    async function tap() {
        coins += 1;
        quantity_text.textContent = `${coins} coins`;

        const { error: updateError } = await supabase
            .from('users')
            .update({ coins: coins, last_click: new Date().toISOString() })
            .eq('id', userId);

        if (updateError) {
            alert('Ошибка обновления: ' + JSON.stringify(updateError));
        }
    }

    tap_btn.addEventListener("click", tap);
});            .eq('id', userId)
            .single();

        if (existingUser) {
            // Пользователь есть — возвращаем его монеты
            return existingUser.coins;
        }

        // Пользователя нет — создаём новую запись
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ id: userId, username: 'player', coins: 0 })
            .select('coins')
            .single();

        if (insertError) {
            console.error('Ошибка создания пользователя:', insertError);
            return 0;
        }

        return newUser.coins;
    }

    // --------------------------------------------------
    // 3. ЗАГРУЖАЕМ МОНЕТЫ ПРИ СТАРТЕ
    // --------------------------------------------------
    let coins = await getOrCreateUser();
    quantity_text.textContent = `${coins} coins`;

    // --------------------------------------------------
    // 4. ФУНКЦИЯ КЛИКА (с записью в базу)
    // --------------------------------------------------
    async function tap() {
        // Увеличиваем локально (мгновенный отклик)
        coins += 1;
        quantity_text.textContent = `${coins} coins`;

        // Отправляем клик в базу
        const { error: updateError } = await supabase
            .from('users')
            .update({ coins: coins, last_click: new Date().toISOString() })
            .eq('id', userId);

        if (updateError) {
            console.error('Ошибка обновления монет:', updateError);
        }

        // Пишем в лог кликов (для будущей защиты от ботов)
        await supabase
            .from('clicks')
            .insert({ user_id: userId });
    }

    // --------------------------------------------------
    // 5. ВЕШАЕМ ОБРАБОТЧИК НА КНОПКУ
    // --------------------------------------------------
    tap_btn.addEventListener("click", tap);
});
