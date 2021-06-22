import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { I18n as TelegrafI18n } from '@edjopato/telegraf-i18n';
import { MenuMiddleware } from 'telegraf-inline-menu';
import { Telegraf } from 'telegraf';
import TelegrafSessionLocal from 'telegraf-session-local';
import cron from "node-cron";
import axios, { AxiosRequestConfig } from "axios";
import { MyContext } from './my-context.js';
import { menu } from './menu/index.js';

const token = process.env['BOT_TOKEN'];
if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}

const bot = new Telegraf<MyContext>(token);

const localSession = new TelegrafSessionLocal({
	database: 'persist/sessions.json'
});

bot.use(localSession.middleware());

const i18n = new TelegrafI18n({
	directory: 'locales',
	defaultLanguage: 'en',
	defaultLanguageOnMissing: true,
	useSession: true
});

bot.use(i18n.middleware());

if (process.env['NODE_ENV'] !== 'production') {
	// Show what telegram updates (messages, button clicks, ...) are happening (only in development)
	bot.use(generateUpdateMiddleware());
}

const menuMiddleware = new MenuMiddleware('/', menu);
bot.command(
	'start',
	async context => menuMiddleware.replyToContext(context)
);

bot.use(menuMiddleware.middleware());

bot.catch(error => {
	console.error('telegraf error occured', error);
});

var getInnovationFactoryWeather: AxiosRequestConfig = {
	method: 'get',
	url: 'api.openweathermap.org/data/2.5/weather?lat=35.69963822421955&lon=51.32022402010034&units=metric&appid=06662bd043969e4b502822dbc443125f',
	headers: {}
};

export async function start(): Promise<void> {
	await bot.telegram.setMyCommands([
		{ command: 'start', description: 'open the menu' }
	]);

	cron.schedule('* * * * *', () => {
		axios(getInnovationFactoryWeather)
			.then(function (response) {
				console.log(JSON.stringify(response.data.main));
			})
			.catch(function (error) {
				console.log(error);
			});

		// bot.telegram.sendMessage(1155817798, "scheduled message");
		// bot.telegram.setChatTitle(-557983424, "new title");
	});

	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
