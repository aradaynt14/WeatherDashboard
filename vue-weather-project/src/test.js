const url = 'https://api.weatherstack.com/autocomplete?access_key=aece18e8a7765582bf657165a4d97930&query=New Delhi';
const options = {
	method: 'GET'
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}