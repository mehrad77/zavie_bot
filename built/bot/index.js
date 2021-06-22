import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { Telegraf } from 'telegraf';
import TelegrafSessionLocal from 'telegraf-session-local';
import cron from "node-cron";
import axios from "axios";
const groupID = -1001352113717;
const removeChatTitleEventMessage = async (ctx) => {
    await ctx.deleteMessage();
};
const token = process.env['BOT_TOKEN'];
if (!token) {
    throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}
const bot = new Telegraf(token);
const localSession = new TelegrafSessionLocal({
    database: 'persist/sessions.json'
});
bot.use(localSession.middleware());
if (process.env['NODE_ENV'] !== 'production') {
    // Show what telegram updates (messages, button clicks, ...) are happening (only in development)
    bot.use(generateUpdateMiddleware());
}
bot.catch(error => {
    console.error('telegraf error occured', error);
});
export async function start() {
    var _a;
    cron.schedule('* * * * *', () => {
        axios.get('https://api.openweathermap.org/data/2.5/weather?lat=35.69963822421955&lon=51.32022402010034&units=metric&appid=06662bd043969e4b502822dbc443125f')
            .then((response) => {
            const main = response.data.main;
            bot.telegram.setChatTitle(groupID, `${main.feels_like.toFixed(0)}°C ☘️`);
        })
            .catch(function (error) {
            console.error(error);
        });
    });
    bot.on('new_chat_title', removeChatTitleEventMessage);
    await bot.launch();
    console.log(new Date(), 'Bot started as', (_a = bot.botInfo) === null || _a === void 0 ? void 0 : _a.username);
}
//# sourceMappingURL=index.js.map