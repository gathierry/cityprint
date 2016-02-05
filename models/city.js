

function City(cityname, country, continent) {
	this.cityname = cityname; // string
	this.country = country;
	this.continent = continent;
	this.cid = cityname + "-" + country
}

module.exports = City;

