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
    let userName = "Player";
    
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id;
            userName = tg.initDataUnsafe.username || tg.initDataUnsafe.first_name || "Player";
        }
    }

    async function getOrCreateUser() {
        try {
            const data = await getOrCreateUser();
            alert('coins: ' + data.coins + ', multitap: ' + data.multitap);
            let coins = data.coins;
            let multitap = data.multitap;
            quantity_text.textContent = `${coins} coins`;
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    }
    const data = await getOrCreateUser();
    alert('coins: ' + data.coins + ', multitap: ' + data.multitap);
    let coins = data.coins;
    let multitap = data.multitap;
    
    quantity_text.textContent = `${coins} coins`;

    async function upgrade(){
        multitap += 1;

        await supabase.from('users').update({multitap: multitap}).eq('id', userId);
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
