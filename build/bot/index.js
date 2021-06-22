"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var fs_1 = require("fs");
var telegraf_middleware_console_time_1 = require("telegraf-middleware-console-time");
var telegraf_1 = require("telegraf");
var telegraf_session_local_1 = __importDefault(require("telegraf-session-local"));
var node_cron_1 = __importDefault(require("node-cron"));
var axios_1 = __importDefault(require("axios"));
var index_js_1 = require("../constants/index.js");
var groupID = -1001352113717;
var removeChatTitleEventMessage = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.deleteMessage()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var token = (fs_1.existsSync('/run/secrets/bot-token.txt') &&
    fs_1.readFileSync('/run/secrets/bot-token.txt', 'utf8').trim()) || (fs_1.existsSync('bot-token.txt') &&
    fs_1.readFileSync('bot-token.txt', 'utf8').trim()) || process.env['BOT_TOKEN'];
if (!token) {
    throw new Error('You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)');
}
var bot = new telegraf_1.Telegraf(token);
var localSession = new telegraf_session_local_1.default({
    database: 'persist/sessions.json'
});
bot.use(localSession.middleware());
if (process.env['NODE_ENV'] !== 'production') {
    // Show what telegram updates (messages, button clicks, ...) are happening (only in development)
    bot.use(telegraf_middleware_console_time_1.generateUpdateMiddleware());
}
bot.catch(function (error) {
    console.error('telegraf error occured', error);
});
function start() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var lastWeather;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    lastWeather = '';
                    node_cron_1.default.schedule('* * * * *', function () {
                        axios_1.default.get('https://api.openweathermap.org/data/2.5/weather', {
                            params: {
                                appid: "06662bd043969e4b502822dbc443125f",
                                lat: "35.69963822421955",
                                lon: "51.32022402010034",
                                units: 'metric',
                                lang: 'fa',
                            }
                        })
                            .then(function (response) {
                            var main = response.data.main;
                            var weather = response.data.weather[0];
                            bot.telegram.setChatTitle(groupID, main.feels_like.toFixed(0) + "\u00B0C " + index_js_1.emojis[(weather === null || weather === void 0 ? void 0 : weather.icon) || 'default']);
                            if ((weather === null || weather === void 0 ? void 0 : weather.description) !== lastWeather) {
                                lastWeather = (weather === null || weather === void 0 ? void 0 : weather.description) || '';
                                bot.telegram.sendMessage(groupID, index_js_1.emojis[(weather === null || weather === void 0 ? void 0 : weather.icon) || 'default'] + " " + lastWeather);
                            }
                        })
                            .catch(function (error) {
                            console.error(error);
                        });
                    });
                    bot.on('new_chat_title', removeChatTitleEventMessage);
                    return [4 /*yield*/, bot.launch()];
                case 1:
                    _b.sent();
                    console.log(new Date(), 'Bot started as', (_a = bot.botInfo) === null || _a === void 0 ? void 0 : _a.username);
                    return [2 /*return*/];
            }
        });
    });
}
exports.start = start;
//# sourceMappingURL=index.js.map