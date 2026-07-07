import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ourbrwsyctgagnzijexz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iKhpRJPSVSYHCzrMPYK4Q_baqB_jGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const tap_btn = document.querySelector(".click-btn");
    const quantity_text = document.querySelector(".text-quantity");

    // --------------------------------------------------
    // ПОЛУЧАЕМ ID ИЗ TELEGRAM (или заглушка для браузера)
    // --------------------------------------------------
    let userId = 123456789;

    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id;
        }
    }

    async function getOrCreateUser() {
        const { data: existingUser } = await supabase
            .from('users')
            .select('coins')
            .eq('id', userId)
            .single();

        if (existingUser) return existingUser.coins;

        const { data: newUser } = await supabase
            .from('users')
            .insert({ id: userId, username: 'player', coins: 0 })
            .select('coins')
            .single();

        return newUser ? newUser.coins : 0;
    }

    let coins = await getOrCreateUser();
    quantity_text.textContent = `${coins} coins`;

    async function tap() {
        coins += 1;
        quantity_text.textContent = `${coins} coins`;

        await supabase
            .from('users')
            .update({ coins: coins, last_click: new Date().toISOString() })
            .eq('id', userId);
    }

    tap_btn.addEventListener("click", tap);
});
