let customHeaders = new Headers();

// Add a few headers - UITZONDERING
customHeaders.append('Accept', 'application/json');

let html = document.querySelector('html');

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}
// 5 TODO: maak updateSun functie

const updateSun = function (percentage, sun) {
	sun.style.left = percentage + "%";
	sun.style.bottom = (100 - percentage) + "%";
}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
		// In de functie moeten we eerst wat zaken ophalen en berekenen.
		// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	html_sun = document.querySelector(".js-sun");
	html_time_left = document.querySelector(".js-time-left");
	var current_time = new Date(); // current date/time

		// Bepaal het aantal minuten dat de zon al op is.
	var diff = ((current_time.getTime() - sunrise.getTime()) / 1000) / 60;

		// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	var percetage_timeleft = Math.round(diff / totalMinutes * 100);
	updateSun(percetage_timeleft, html_sun);

		// We voegen ook de 'is-loaded' class toe aan de body-tag.
	const html_body = document.querySelector('body')
	html_body.classList.add('is-loaded');
		// Vergeet niet om het resterende aantal minuten in te vullen.
	html_sun.setAttribute("data-time", current_time.getHours() + ":" + current_time.getMinutes())
	const time_left = Math.round(totalMinutes - diff);
	if (time_left >= 0) {
		html.classList.remove('is-night')
		html_time_left.innerHTML = time_left
	}
	else {
		html.classList.add('is-night')
		html_time_left.innerHTML = "0"
	}

	var updateSite = setInterval(function () {
		console.log("refresh")
		html_sun = document.querySelector(".js-sun");
		html_time_left = document.querySelector(".js-time-left");
		
		var current_time = new Date();
	
	
		var diff = ((current_time.getTime() - sunrise.getTime()) / 1000) / 60;
		var percetage_timeleft = Math.round(diff / totalMinutes * 100)
		updateSun(percetage_timeleft, html_sun);
		html_sun.setAttribute("data-time", current_time.getHours() + ":" + current_time.getMinutes())
	
		const time_left = Math.round(totalMinutes - diff);
		console.log(time_left);
		if (time_left >= 0) {
			html.classList.remove('is-night')
			html_time_left.innerHTML = time_left
		}
		else {
			html.classList.add('is-night')
			html_time_left.innerHTML = "0"
		}
	
	}, 60000);

	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	const html_location = document.querySelector(".js-location");
	const html_sunrise = document.querySelector(".js-sunrise");
	const html_sunset = document.querySelector(".js-sunset");

	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	html_location.innerHTML = queryResponse.city.name + ", " + queryResponse.city.country;

	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	const sunriseTime = queryResponse.city.sunrise;
	const sunsetTime = queryResponse.city.sunset;

	html_sunrise.innerHTML = _parseMillisecondsIntoReadableTime(sunriseTime);
	html_sunset.innerHTML = _parseMillisecondsIntoReadableTime(sunsetTime);

	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	const r = new Date(sunriseTime * 1000);
	const s = new Date(sunsetTime * 1000)

	var diff = ((s.getTime() - r.getTime()) / 1000) / 60;  // Hoeveel minuten zitten er tussen sunrise en sunset

	placeSunAndStartMoving(diff, r);
};

const fetchData = async function (endpoint) {
	try {
		const response = await fetch(endpoint, { headers: customHeaders });
		const data = await response.json();
		console.log(data)
		showResult(data)
	} catch (error) {
		console.error('An Error occured, we handled it', error);
	}

}

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	// Eerst bouwen we onze url op
	const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=31cb49b33818129be3e5b3464026a6ba&units=metric&lang=nl&cnt=1`
	// Met de fetch API proberen we de data op te halen.
	fetchData(url);
	// Als dat gelukt is, gaan we naar onze showResult functie.
};

document.addEventListener('DOMContentLoaded', function () {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});
