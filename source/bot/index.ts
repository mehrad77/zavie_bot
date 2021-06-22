import { existsSync, readFileSync } from 'fs';
import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { Telegraf } from 'telegraf';
import TelegrafSessionLocal from 'telegraf-session-local';
import cron from "node-cron";
import axios, { AxiosResponse } from "axios";
import { MyContext } from './my-context.js';
import { OpenWeatherMapResponseType } from '../@types/index.js';

const groupID = -1001352113717;

const removeChatTitleEventMessage = async (ctx: any) => {
	await ctx.deleteMessage()

}

const token = (
	existsSync('/run/secrets/bot-token.txt') &&
	readFileSync('/run/secrets/bot-token.txt', 'utf8').trim()
) || (
	existsSync('bot-token.txt') &&
	readFileSync('bot-token.txt', 'utf8').trim()
) || process.env['BOT_TOKEN'];

if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}

const bot = new Telegraf<MyContext>(token);

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

export async function start(): Promise<void> {
	cron.schedule('*/5 * * * *', () => {
		axios.get('https://api.openweathermap.org/data/2.5/weather?lat=35.69963822421955&lon=51.32022402010034&units=metric&appid=06662bd043969e4b502822dbc443125f')
			.then((response: AxiosResponse<OpenWeatherMapResponseType>) => {
				const main = response.data.main;
				bot.telegram.setChatTitle(
					groupID,
					`${main.feels_like.toFixed(0)}°C ☘️`
				);
			})
			.catch(function (error) {
				console.error(error);
			});
	});

	bot.on('new_chat_title', removeChatTitleEventMessage);
	
	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
