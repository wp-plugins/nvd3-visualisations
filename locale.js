
// All national dependent definitions how to format numbers, currencies, dates, etc.

myCountry = "US";  // Update this (US/FI/RU) based on your blog's readers: add new locale's block below

function detectBrowser(wanted) { // Optional if you want to support multinational audience

	if (wanted)
		return (navigator.language || navigator.userLanguage);
	return 0;
}

function myLocale(code) {  

if (!code)
	code = myCountry;

// Each new country needs one d3.locale block as below, use example format:
// xx_XX where XX is your country's locale and xx its language.

// Finland
var fi_FI = d3.locale({
  "decimal": ",",
  "thousands": " ",
  "grouping": [3],
  "currency": ["", " €"],
  "dateTime": "%a %b %e %X %Y",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["", ""],
  "days": ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"],
  "shortDays": ["SU", "MA", "TI", "KE", "TO", "PE", "LA"],
  "months": ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesakuu", "Heinakuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
  "shortMonths": ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesa", "Heina", "Elo", "Syys", "Loka", "Marras", "Joulu"]
});

// USA
var en_US = d3.locale({
  "decimal": ".",
  "thousands": ",",
  "grouping": [3],
  "currency": ["$", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

// Russian
var ru_RU = d3.locale({
  "decimal": ",",
  "thousands": "\xa0",
  "grouping": [3],
  "currency": ["", " руб."],
  "dateTime": "%A, %e %B %Y г. %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
});

// Changing default funcs of d3 to follow selected national rules: 

code = code.toUpperCase();
if (code.indexOf('FI') > -1) {
	d3.time.format 	= fi_FI.timeFormat;
	d3.format 		= fi_FI.numberFormat;
	return;
}
if (code.indexOf('US') > -1) {
	d3.time.format 	= en_US.timeFormat;
	d3.format 		= en_US.numberFormat;
	return;
}
if (code.indexOf('RU') > -1) {
	d3.time.format 	= ru_RU.timeFormat;
	d3.format 		= ru_RU.numberFormat;
	return;
}
}
