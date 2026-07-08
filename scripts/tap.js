import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ourbrwsyctgagnzijexz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3iKhpRJPSVSYHCzrMPYK4Q_baqB_jGd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const tap_btn = document.querySelector(".click-btn");
    const quantity_text = document.querySelector(".text-quantity");
    const upgrade_button = document.querySelector(".upgrade-button");
    const upgrade_price = document.querySelector(".upgrade-price");
    const multitap_text = document.querySelector(".click-text");

    let userId = 123456789;
    let userName = "Player";

    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id;
            userName = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name || "Player";
        }
    }

    async function getOrCreateUser() {
        const { data: existingUser } = await supabase
            .from('users')
            .select('coins, multitap')
            .eq('id', userId)
            .single();

        if (existingUser) return existingUser;

        const { data: newUser } = await supabase
            .from('users')
            .insert({ id: userId, username: userName, coins: 0, multitap: 1 })
            .select('coins, multitap')
            .single();

        return newUser || { coins: 0, multitap: 1 };
    }

    const data = await getOrCreateUser();
    let coins = data.coins;
    let multitap = data.multitap;
    let upgradePrice = multitap * 200;

    quantity_text.textContent = `${coins} coins`;
    if (upgrade_price) {
        upgrade_price.textContent = `${upgradePrice} coins`;
    }
    if(multitap_text) {
        multitap_text.textContent = `click: +${multitap} coins`;
    }

    async function upgrade() {
        if (coins < upgradePrice) {
            alert('Недостаточно монет!');
            return;
        }
        coins -= upgradePrice;
        multitap += 1;
        upgradePrice = multitap * multitap * 200;

        quantity_text.textContent = `${coins} coins`;
        if (upgrade_price) {
            upgrade_price.textContent = `${upgradePrice} coins`;
        }
        if(multitap_text) {
            multitap_text.textContent = `click: +${multitap} coins`;
        }

        await supabase
            .from('users')
            .update({ coins: coins, multitap: multitap })
            .eq('id', userId);
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
    if (upgrade_button) {
        upgrade_button.addEventListener("click", upgrade);
    }
});
