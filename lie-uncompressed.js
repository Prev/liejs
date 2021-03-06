/**
 * [lie.js]
 * Let working addEventListener, document.getElementsByClassName.. etc in Internet Explorer
 *
 * @author prevdev@gmail.com
 *
 * source code in https://github.com/Prev/liejs
 * built in 2013.2.15
 *
 * MIT LICENSE
 */
(function (d, w) {
	function NodeList(length) {
		if (length) {
			for (var i=0; i<length; i++)
				this[i] = 0;
			this.length = parseInt(length);
		}else
			this.length = 0;
	}
	NodeList.prototype = {
		item: function (index) {
			return this[index];
		},
		__push: function(node) {
			var __index = this.length;
			this[__index] = node;
			this.length++;
		},
		toString: function() {
			return "[object NodeList]";
		}
	};
	
	if (!d.getElementById) {
		if (d.querySelector) {
			d.getElementById = function (id) {
				return d.querySelector("#" + id);
			}
		}else if (d.getElementsByTagName) {
			d.getElementById = function (id) {
				var t = d.getElementsByTagName("*");
				for (var i=0; i<t.length; i++){
					if (t[i].id == id)
						return t[i];
				}
			}
		}else if (d.all) {
			d.getElementById = function (id) {
				return d.all[id];
			}
		}else if (d.layers) {
			d.getElementById = function (id) {
				return d.layers[id];
			}
		}
	}
	if (!d.getElementsByClassName) {
		if (d.querySelectorAll) {
			d.getElementsByClassName = function (className) {
				return d.querySelectorAll("." + className);
			}
		}else if (d.getElementsByTagName) {
			d.getElementsByClassName = function (className) {
				var t = d.getElementsByTagName("*");
				var n = new NodeList();
				for (var i=0; i<t.length; i++){
					var classLists = t[i].className.split(" ");
					if (classLists.indexOf(className) != -1)
						n.__push(t[i]);
				}
				return n;
			}
		}
	}
	/**
	 * querySelector, querySelectorAll is partly supported
	 */
	
	if (!d.querySelector) {
		if (d.getElementById && d.getElementsByClassName && d.getElementsByTagName) {
			d.querySelector = function (selector) {
				var s = selector.substr(1, selector.length - 2);
				switch (selector.substr(0, 1)) {
					case "#" :
						return d.getElementById(s);
					break;
					
					case "." : 
						return d.getElementsByClassName(s).item(0);
					break;
					
					default :
						return d.getElementsByTagName(selector).item(0);
					break;
				}
			}
		}
	}
	if (!d.querySelectorAll) {
		if (d.getElementById && d.getElementsByClassName && d.getElementsByTagName) {
			d.querySelectorAll = function (selector) {
				var s = selector.substr(1, selector.length - 2);
				switch (selector.substr(0, 1)) {
					case "#" :
						var n = new NodeList();
						n.__push( d.getElementById(s) );
						return n;
					break;
					
					case "." : 
						return d.getElementsByClassName(s);
					break;
					
					default :
						return d.getElementsByTagName(selector);
					break;
				}
			}
		}
	}
	
	function addListenerFuncs(t) {
		if (!t.addEventListener) {
			if (t.attachEvent)
				t.addEventListener = function (type, listener, useCapture) { this.attachEvent("on" + type, listener); };
			else
				t.addEventListener = function (type, listener, useCapture) { this["on" + type] = listener; };
		}
		if (!t.removeEventListener) {
			if (t.detachEvent)
				t.removeEventListener = function (type, listener) { this.detachEvent("on" + type, listener); };
			else
				t.removeEventListener = function (type, listener) { if (listener == this["on" + type]) this["on" + type] = null; };
		}
	}
	
	addListenerFuncs(d);
	if (!w.addEventListener) {
		addListenerFuncs(w);
		d.addEventListener("readystatechange", function () {
			if (d.readyState == "complete" || d.readyState == "loaded") {
				for (var k in d.all) {
					var m = d.all[k];
					addListenerFuncs(m);
				}
				for (var i=0; i<d.forms.length; i++) {
					var m = d.forms[i];
					addListenerFuncs(m);
				}
			}
		}, true);
	}
	
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(searchElement, fromIndex) { if (!fromIndex) fromIndex = 0; for (var i=fromIndex; i<this.length; i++) { if (this[i] === searchElement) return i; } return -1; }
	}

	if (typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, ''); 
		}
	}
})(document,window);