/*
*	Title: upstart test
*	Modified: 07-12-2015
*	Version: 1.0.0
*	Author: Mathias Fonck
* 	-----------------------------------------------
*	
*	Start-up procedures to register a business (number):
*	http://api.worldbank.org/countries/all/indicators/IC.REG.PROC?format=jsonP&prefix=jsonp_callback&date=2015&per_page=300
*	Time required to start a business (days):
*	http://api.worldbank.org/countries/all/indicators/IC.REG.DURS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	New businesses registered (number):
*	http://api.worldbank.org/countries/all/indicators/IC.BUS.NREG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	New business density (new registrations per 1,000 people ages 15-64):
*	http://api.worldbank.org/countries/all/indicators/IC.BUS.NDNS.ZS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	[Real interest rate %:
*	http://api.worldbank.org/countries/all/indicators/FR.INR.RINR?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*	Inflation, GDP deflator (annual %):
*	http://api.worldbank.org/countries/all/indicators/NY.GDP.DEFL.KD.ZG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015
*
*/

//anonieme IIFE; wordt uitgevoerd als document is geladen
(function () { 
	//aanmaken van app object met eigen functionaliteiten
	var App = {
		init: function() {
			var self = this; //closure
			
			this.WBSTARTUPPROCEDURESAPI = "http://api.worldbank.org/countries/all/indicators/IC.REG.PROC?format=jsonP&prefix=jsonp_callback&date=2015&per_page=300";
			this.WBTIMETOSTARTBUSINESSAPI =  "http://api.worldbank.org/countries/all/indicators/IC.REG.DURS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBNEWREGISTEREDBUSINESSESAPI = "http://api.worldbank.org/countries/all/indicators/IC.BUS.NREG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBNEWBUSINESSESDENSITYAPI = "http://api.worldbank.org/countries/all/indicators/IC.BUS.NDNS.ZS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBINTERESTRATE = "http://api.worldbank.org/countries/all/indicators/FR.INR.RINR?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBINFLATION = "http://api.worldbank.org/countries/all/indicators/NY.GDP.DEFL.KD.ZG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			
			this._dataStartup = {
				"procedures": null,
				"time to start a business": null,
				"registered businesses": null,
				"bussiness density": null,
				"interest rate": null,
				"inflation": null
			}
			
			this.loadAPIFromWorldBank();
		},
		"loadAPIFromWolrdBank": function() {
			var self = this; //closure
			
		},
		loadStartupProceduresFromWorldBankAPI: function(iso2code) {
			// Closure
			var self = this, url = String.format(this.WBSTARTUPPROCEDURESAPI, iso2code, new Date().getTime());
			
			// Load JSONP from corresponding API with certain URL
			// JSONP Callback is defined by a function name in this case
			// prefix=jsonp_callback. The Utils object contains a new function
			// which can handle the callback
			Utils.getJSONPByPromise(url).then(
				function(data) {
					if(data != null) {
						var startupProcedures = data[1]; // Get the forrest area from the selected country from JSON (second item from array, first item is paging)
						var startupProceduresFiltered = _.filter(startupProcedures, function(startUpProceduresPerYear) {
							return startUpProceduresPerYear.value != null;
						});// First remove all years where value is null with LoDash
						startupProceduresFiltered = _.sortBy(startupProceduresFiltered, function(startUpProceduresPerYear) {
							return startUpProceduresPerYear.year;
						});// Sorting on year
						self._dataStartup.startupProcedures = startupProceduresFiltered;// Add the forrest area data to the details of a country
						self.updateCountryDetailsUI('country-details', '#country-details-template');// Call updateCountryDetailsUI method when successful
					}	
				},
				function(status) {
					console.log(status);
				}
			);
		},
	};
	App.init();
})();