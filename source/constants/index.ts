/**
 * read more: https://openweathermap.org/weather-conditions
 */
export const emojis = {
	'01d' : '☀️', // clear sky
	'02d' : '🌤', // few clouds
	'03d' : '⛅️', // scattered clouds 
	'04d' : '☁️', //  broken clouds 
	'09d' : '⛈☔️', // shower rain 
	'10d' : '🌦💦', // rain
	'11d' : '🌩🌪', // thunderstorm 
	'13d' : '❄️☃️', // snow
	'50d' : '🐳', // mist
	'01n' : '🌙',
	'02n' : '☁️',
	'03n' : '☁️☁️',
	'04n' : '☁️☁️☁️',
	'09n' : '☔️',
	'10n' : '💦🌧💦',
	'11n' : '🌪',
	'13n' : '🌨☃️🌨',
	'50n' : '🐳',
	'default': '😳'
};

export type EmojisType = keyof typeof emojis;