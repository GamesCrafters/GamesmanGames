 if (JSON && JSON.stringify && JSON.parse) var Session = Session || (function() {
 
	// window object
	var win = window.top || window;
	
	// session store
	var store = (win.name ? JSON.parse(win.name) : {});
	
	// save store on page unload
	function Save() {
		win.name = JSON.stringify(store);
	};
	
	// page unload event
	if (window.addEventListener) window.addEventListener("unload", Save, false);
	else if (window.attachEvent) window.attachEvent("onunload", Save);
	else window.onunload = Save;

	// public methods
	return {
	
		// set a session variable
		set: function(name, value) {
			store[name] = value;
		},
		
		// get a session value
		get: function(name) {
			return (store[name] ? store[name] : undefined);
		},
		
		// clear session
		clear: function() { store = {}; },
		
		// dump session data
		dump: function() { return JSON.stringify(store); }
 
	};
 
 })();