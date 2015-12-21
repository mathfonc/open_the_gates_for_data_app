/*
*	Title: upstart test
*	Created: 07-12-2015
*	Modified: 21-12-2015
*	Author: Mathias Fonck
* 	-----------------------------------------------
*	
*	Worldbank countries:
*	http://api.worldbank.org/countries/all?format=jsonP&prefix=jsonp_callback&per_page=300
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

(function() {
	
	// Describe an App object with own functionalities
	var App = {
		init: function() {
			var self = this;
			
			// UPDATE: URL for unique callbacks (will be extended by unique values)
			this.WBCOUNTRIESAPIURL = "http://api.worldbank.org/countries/all?format=jsonP&per_page=300&prefix=jsonp_callback";
            this.WBSTARTUPPROCEDURESAPIURL = "http://api.worldbank.org/countries/all/indicators/IC.REG.PROC?format=jsonP&prefix=jsonp_callback&date=2015&per_page=300";
			this.WBTIMETOSTARTBUSINESSAPIURL =  "http://api.worldbank.org/countries/all/indicators/IC.REG.DURS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBNEWREGISTEREDBUSINESSESAPIURL = "http://api.worldbank.org/countries/all/indicators/IC.BUS.NREG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBNEWBUSINESSESDENSITYAPIURL = "http://api.worldbank.org/countries/all/indicators/IC.BUS.NDNS.ZS?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBINTERESTRATEAPIURL = "http://api.worldbank.org/countries/all/indicators/FR.INR.RINR?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			this.WBINFLATIONAPIURL = "http://api.worldbank.org/countries/all/indicators/NY.GDP.DEFL.KD.ZG?format=jsonP&prefix=jsonp_callback&per_page=300&date=2015";
			
			this._dataCountries = null;// Variable for the list of countries
			this._dataCountry = {
				"procedures": null, 
				"time to start a new business": null,// 
				"new registered businesses": null, //
                "new registered businesses density": null,
                "interest rate": null,
                "inflation": null
			}// Variable for the details of a country
			
			// Handlebars Cache
			this._hbsCache = {};// Handlebars cache for templates
			this._hbsPartialsCache = {};// Handlebars cache for partials
			
			// Create a clone from the JayWalker object
			this._jayWalker = JayWalker;
			this._jayWalker.init();
			this._jayWalker._countryDetailsJSONPLoaded.add(function(iso2code) {
				self.loadDatasetsFromCountry(iso2code);// Test: load details data from country
			});
			
			this.registerNavigationToggleListeners();// Register All Navigation Toggle Listeners
			
			this.registerWindowListeners();// Register All Navigation Toggle Listeners
			
			// Register listeners for list layout
			this.registerListenersForListLayout();
			
			this.loadCountriesFromWorldBankAPI();// Execute method loadCountriesFromWorldBankAPI(): Load countries from the Worldbank API
			
		},
		
		registerNavigationToggleListeners: function() {
			var toggles = document.querySelectorAll('.navigation-toggle');
			
			if(toggles != null && toggles.length > 0) {
				var toggle = null;
				
				for(var i = 0; i < toggles.length; i++ ) {
					toggle = toggles[i];
					toggle.addEventListener('click', function(ev) {
						ev.preventDefault();
						
						document.querySelector('body').classList.toggle(this.dataset.navtype);
						
						return false;
					});	
				}
			}
		},
		registerWindowListeners: function() {
			window.addEventListener('resize', function(ev) {
				if(document.querySelector('body').classList.contains('offcanvas-open')) {
					document.querySelector('body').classList.remove('offcanvas-open');
				}
				
				if(document.querySelector('body').classList.contains('headernav-open')) {
					document.querySelector('body').classList.remove('headernav-open');
				}
			});
		},
		registerListenersForListLayout: function() {
			
			var self = this;
			
			var anchors = document.querySelectorAll('[data-listlayout]');
			if(anchors != null && anchors.length > 0) {
				_.each(anchors, function(anchor) {
					anchor.addEventListener('click', function(ev) {
						ev.preventDefault();
						
						var layout = this.dataset.listlayout;
						var target = this.dataset.target;
						
						if(target == 'countries-list') {
							self.updateCountriesUI('countries-' + layout, '#countries-' + layout + '-template');// Call updateCountriesUI method when successful
						}
						
						return false;	
					});	
				});
			}
		},
		loadCountriesFromWorldBankAPI: function() {
			// Closure
			// UPDATE
			var self = this, url = String.format(this.WBCOUNTRIESAPIURL);
			
			// Load JSONP from corresponding API with certain URL
			// JSONP Callback is defined by a function name in this case
			// prefix=jsonp_callback. The Utils object contains a new function
			// which can handle the callback
			Utils.getJSONPByPromise(url).then(
				function(data) {
					if(data != null) {
						var countries = data[1]; // Get the countries from JSON (second item from array, first item is paging)
						var countriesFiltered = _.filter(countries, function(country) {
							return !(/\d/.test(country.iso2Code));
						});// First remove weird countries with LoDash + Assign data as value flor global variable _dataCountries within the App
						var badISO2Codes = ['XT', 'XN', 'ZG', 'ZF', 'OE', 'XS', 'XR', 'XU', 'XQ', 'XP', 'ZQ', 'XO', 'XN', 'XM', 'XL', 'ZJ', 'XJ', 'XY', 'XE', 'EU', 'XC', 'JG', 'XD'];
						self._dataCountries = _.filter(countriesFiltered, function(country) {
							var validCountry = true, i = 0;
							
							while(validCountry && i < badISO2Codes.length) {
								if(country.iso2Code == badISO2Codes[i]) {
									validCountry = false;
								} else {
									i++;
								}
							}
							
							return validCountry;
						});// Filter (weird codes: XT, XN, ZG, ZF, OE, XS, XR, XU, XQ, XP, ZQ, XO, XN, XM, XL, ZJ, XJ, XY, XE, EU, XC, JG)
						self._dataCountries = _.sortBy(self._dataCountries, function(country) {
							return country.name;
						});// Sorting on country name
						self.updateCountriesUI('countries-tiles', '#select-options-countries');// Call updateCountriesUI method when successful*/
					}	
				},
				function(status) {
					console.log(status);
				}
			);
		},
		updateCountriesUI: function(hbsTmplName, hbsTmplId) {
			if(!this._hbsCache[hbsTmplName]) {
				var src = document.querySelector(hbsTmplId).innerHTML;// Get the contents from the specified hbs template
				this._hbsCache[hbsTmplName] = Handlebars.compile(src);// Compile the source and add it to the hbs cache
			}	
			document.querySelector('.countries-list').innerHTML = this._hbsCache[hbsTmplName](this._dataCountries);// Write compiled content to the appropriate container
		}
		
	};
	
	App.init();// Intialize the application
	
})();