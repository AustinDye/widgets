// convenience split function
function split(x, at, limit) {
	x = x.split(at);
	if (x.length > limit) x[limit - 1] = x.splice(limit - 1).join(at);
	return x;
}

// Convenience parsing function
function parseSettings(settings, opts) {
	var text = (settings + " ").match(/ +|[=,]|\{[^}]*\}|[^ ,=]+/g), cases = [];

	// opts
	opts = opts || [];
	var supportsCases = opts.indexOf("cases") != -1,
	    csv = opts.indexOf("csv") != -1,
	    h2c = opts.indexOf("hyphen2camel") != -1;

	// This is a pretty simple syntax
	// It works on one object until there's an else case then pushes that
	// An entry is like key=value
	// Entries are space-separated
	// Values can include spaces if they're quoted with {}
	// Extra data can be encoded into the quoted section with /
	// Values can be comma separated OUTSIDE OF the quotes
	var currentObject = {}, currentKey = "", currentString = "", concat = false;

	function parseString() {
		var ret;
		if (currentString.charAt(0) == "{") {
			var tmp = currentString.substring(1, currentString.length - 1).split("/");
			if (tmp.length == 1) ret = tmp[0];
			else ret = { "string": tmp[0], "extra": tmp.slice(1) };
		} else {
			ret = currentString;
		}
		currentString = "";
		return ret;
	}

	function parseWarning(warning) {
		console.warn("parseSettings: " + warning + " (settings: '" + settings + "')");
	}

	function h2cf(all, c) {
		return c.toUpperCase();
	}

	for (var i = 0; i < text.length; ++i) {
		var token = text[i];
		if (token.trim() == "") {
			if (currentKey && currentString) {
				if (csv) {
					if (currentObject[currentKey]) {
						currentObject[currentKey].push(parseString());
					} else {
						currentObject[currentKey] = [parseString()];
					}
				} else {
					if (currentObject[currentKey]) {
						parseWarning("Overriding old value for " + currentKey);
					}
					currentObject[currentKey] = parseString();
				}
				currentKey = "";
			}
		} else if (token == "=") {
			if (!currentString) parseWarning("= without key");
			currentKey = h2c ? currentString.replace(/-(.)/g, h2cf).replace(/-$/, "_") : currentString;
			currentString = "";
		} else if (token == ",") {
			if (currentKey && currentString) {
				if (csv) {
					if (currentKey in currentObject) {
						currentObject[currentKey].push(parseString());
					} else {
						currentObject[currentKey] = [parseString()];
					}
					currentString = "";
				} else {
					currentString += ",";
					concat = true;
				}
			} else {
				parseWarning("unusual comma");
			}
		} else {
			if (currentString) {
				if (supportsCases && currentString.toLowerCase() == "else") {
					cases.push(currentObject);
					currentObject = {};
				} else if (!concat) {
					parseWarning("ignoring random literal '" + currentString + "'");
				}
			}
			if (concat) {
				currentString += token;
				concat = false;
			} else {
				currentString = token;
			}
		}
	}

	if (supportsCases) {
		cases.push(currentObject);
		return cases;
	}
	else return currentObject;
}

// Query time
// var SERVER_TIMEZONE = "America/Los_Angeles";
// function getServerTime() {
// 	return moment().tz(SERVER_TIMEZONE)
// }

// function getErinnTime(serverTime, split) {
// 	if (serverTime) {
// 		serverTime = moment(serverTime.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z");
// 		var hour = Math.floor(serverTime / TIME_PER_ERINN_HOUR) % 24,
// 		    minute = Math.floor(serverTime / TIME_PER_ERINN_MINUTE) % 60;
// 		if (split) return [hour, minute];
// 		else return hour * 60 + minute;
// 	} else {
// 		// This is in minutes
// 		return erinnTime;
// 	}
// }

// // Erinn time functionality
// var TIME_PER_ERINN_MINUTE = 1500;                       // 1.5 s
// var TIME_PER_ERINN_HOUR   = TIME_PER_ERINN_MINUTE * 60; // 1 min 30 s
// var TIME_PER_ERINN_DAY    = TIME_PER_ERINN_HOUR * 24;   // 36 min
// var erinnDay, erinnTime;
// (function() {
// 	var serverTime = getServerTime();
// 	erinnTime = getErinnTime(serverTime, true);
// 	var hour = erinnTime[0],
// 	    minute = erinnTime[1];

// 	erinnDay = hour > 6 && hour < 18 ? 0 : 1;

// 	setTimeout(triggerErinnSunshift,
// 		TIME_PER_ERINN_HOUR * (
// 			(hour < 6 ? 6 : (
// 				hour < 18 ? 18 : 30
// 			) - hour) - 1
// 		) + TIME_PER_ERINN_MINUTE * (60 - minute)
// 	);

// 	erinnTime = hour * 60 + minute;
// 	setTimeout(triggerErinnMinute, TIME_PER_ERINN_MINUTE)
// })();

// function triggerErinnSunshift() {
// 	erinnDay = erinnDay ? 0 : 1;
// 	$(document).trigger("ErinnSunshift", [erinnDay]);

// 	setTimeout(triggerErinnSunshift, TIME_PER_ERINN_HOUR * (18 - 6));
// }

// function onErinnSunshift(handler) {
// 	if (typeof(handler) !== "function") return;
// 	$(document).on("ErinnSunshift", handler);
// }

// function triggerErinnMinute() {
// 	// Increase time
// 	erinnTime = (erinnTime + 1) % (60 * 24);

// 	// Call general trigger
// 	$(document).trigger("ErinnMinute", [erinnTime]);

// 	// Format time and call trigger
// 	var time = moment("00:00", "HH:mm").minutes(erinnTime).format("HH:mm");
// 	$(document).trigger("ErinnTime-" + time);

// 	setTimeout(triggerErinnMinute, TIME_PER_ERINN_MINUTE)
// }

// function onErinnMinute(handler) {
// 	if (typeof(handler) !== "function") return;
// 	$(document).on("ErinnMinute", handler);
// }

// function onErinnTime(time, handler) {
// 	if (typeof(handler) !== "function") return;

// 	// Validate the time given.
// 	var rtime = time.match(/^([0-9]{1,2}):([0-9]{2})E?$/);
// 	if (!rtime) return console.warn("Bad time for onErinnTime: " + time);
// 	time = (rtime[1].length == 1 ? "0" + rtime[1] : rtime[1]) + ":" + rtime[2]

// 	// Register the time.
// 	$(document).on("ErinnTime-" + time, handler);
// }

// // Real time functionality
// var lastMinute, lastWeatherCheck;

// $(function() {
// 	var now = lastWeatherCheck = moment();
// 	lastMinute = now.minutes();
// 	setTimeout(triggerSecond, 1000 - now.milliseconds());
// });

// function triggerSecond() {
// 	var now = getServerTime();
// 	if (now.minutes() != lastMinute) {
// 		lastMinute = now.minutes();

// 		// If it's a weather changeover (multiple of 20 mins), trigger those
// 		var wc = moment(lastWeatherCheck);
// 		if (lastWeatherCheck < wc.minutes(20) && now >= wc
// 		||  lastWeatherCheck < wc.minutes(40) && now >= wc
// 		||  lastWeatherCheck < wc.minutes(59).add(1, "minute") && now >= wc
// 		) {
// 			$(document).trigger("WeatherChange", [now]);
// 		}
// 		lastWeatherCheck = now;

// 		// If it's been a minute, trigger minute handlers
// 		$(document).trigger("TickMinute", [now]);

// 		// Trigger server time handlers
// 		$(document).trigger("RealTime-" + now.format("HH:mm"))
// 	}

// 	// Trigger second handlers
// 	$(document).trigger("TickSecond", [now]);

// 	setTimeout(triggerSecond, 1000 - now.milliseconds());
// }

// function onTickSecond(handler) {
// 	if (typeof(handler) !== "function") return;
// 	$(document).on("TickSecond", handler);
// }

// function offTickSecond(handler) {
// 	if (typeof(handler) !== "function") return;
// 	$(document).off("TickSecond", handler);
// }

// function onTickMinute(handler) {
// 	if (typeof(handler) !== "function") return;
// 	$(document).on("TickMinute", handler);
// }

// function onWeatherChange(handler) {
// 	if (typeof(handler) !== "function") return;
// 	$(document).on("WeatherChange", handler);
// }

// function onRealTime(time, handler, off) {
// 	if (typeof(handler) !== "function") return;

// 	// Validate the time given.
// 	var rtime = time.match(/^([0-9]{1,2}):([0-9]{2})S?$/);
// 	if (!rtime) return console.warn("Bad time for onRealTime: " + time);
// 	time = (rtime[1].length == 1 ? "0" + rtime[1] : rtime[1]) + ":" + rtime[2]

// 	// Register the time.
// 	$(document)[off ? "off" : "on"]("RealTime-" + time, handler);
// }

// function offRealTime(time, handler) { onRealTime(time, handler, true); }

// // Scroll box functionality
// function Scroller(list) {
// 	var idx = 0, interval, pub, time, auto;

// 	function prestage(newIdx, right) {
// 		newIdx = newIdx < 0 ? list.length + newIdx : newIdx % list.length;
// 		var $old = $(list[idx].id), $new = $(list[newIdx].id);

// 		// Animate the old one out
// 		var oldLeft = $old.position().left;
// 		$old.animate({
// 			"left": right ? -$old.outerWidth() : $old.outerWidth()
// 		}, {
// 			"done": function () { $(this).hide(); }
// 		});

// 		// Cancel and reset old interval, so that manual changes aren't quickly moved
// 		if (time) {
// 			clearInterval(interval);
// 			interval = setInterval(pub.right, time);
// 		}

// 		idx = newIdx;
// 		return [$new, oldLeft];
// 	}

// 	function stage(newIdx, right) {
// 		var ret = prestage(newIdx, right);
// 		var $new = ret[0], oldLeft = ret[1];

// 		// Animate the new one in
// 		$new.css("left", right ? $new.outerWidth() : -$new.outerWidth()).show().animate({
// 			"left": oldLeft
// 		}, {
// 			"done": function () { $(this).css("left", ""); }
// 		});
// 	}

// 	function marquee(dir, func) {
// 		// Marquee should pause any automation
// 		pub.pause();

// 		$new = prestage(newIdx, right);

// 		// Animate quickly into the stage to start
// 		$new.css("left", right ? $new.outerWidth() : -$new.outerWidth()).show().animate({
// 			"left": Math.round($new.outerWidth() * 7 / 8)
// 		});
// 	}

// 	pub = {
// 		show: function() { $(list[idx].id).show(); return this; },

// 		left:  function() { stage(idx - 1, false); return this; },
// 		right: function() { stage(idx + 1, true); return this; },

// 		autoLeft: function(t) {
// 			if (time != t || auto != pub.left) {
// 				time = t;
// 				auto = pub.left;
// 				pub.resume();
// 			}
// 			return this;
// 		},
// 		autoRight: function(t) {
// 			if (time != t || auto != pub.right) {
// 				time = t;
// 				auto = pub.right;
// 				pub.resume();
// 			}
// 			return this;
// 		},

// 		marqueeLeft: function() { marquee(idx - 1, false); return this; },
// 		marqueeRight: function() { marquee(idx + 1, true); return this; },

// 		pause: function() {
// 			clearInterval(interval);
// 			interval = undefined;
// 			return this;
// 		},
// 		resume: function() {
// 			if (typeof(interval) === "undefined") {
// 				clearInterval(interval);
// 			}
// 			interval = setInterval(auto, time);
// 			return this;
// 		},

// 		shift: function(item) { list.shift(item); return this; },
// 		unshift: function(item) { return list.unshift(item); },
// 		push: function (item) { list.push(item); return this; },
// 		pop: function (item) { return list.pop(item); },
// 		peek: function () { return list[list.length - 1]; },
// 		len: function () { return list.length; }
// 	};

// 	return pub;
// }

// // Countdown functionality
// function countDown($time, til, pfx, callback, natural) {
// 	var til = moment(til);

// 	if (pfx) pfx += " ";
// 	else pfx = "";

// 	var handler = function() {
// 		var diff = til.diff(moment());
// 		if (diff <= 0) {
// 			offTickSecond(handler);
// 			if (callback) callback($time);
// 		} else {
// 			$time.text(pfx + diff2str(diff, natural))
// 		}
// 	}
// 	onTickSecond(handler);

// 	return $time;
// }

// function diff2str(ms, natural) {
// 	var s = Math.floor(ms / 1000) % 60,
// 	    m = Math.floor(ms / (60 * 1000)) % 60,
// 	    h = Math.floor(ms / (60 * 60 * 1000));

// 	m = m.toString();
// 	if (m < 10) m = "0" + m;
// 	s = s.toString()
// 	if (s < 10) s = "0" + s;

// 	var text;
// 	if (natural) {
// 		var d = Math.floor(h / 24);
// 		if (d > 0) {
// 			text = d.toString() + " days";
// 		} else if (h > 0) {
// 			text = h.toString() + " hours";
// 		} else {
// 			text = m + ":" + s;
// 		}
// 	} else {
// 		if (h > 0) {
// 			h = h.toString()
// 			if (h < 10) h = "0" + h;
// 			text = h + ":" + m;
// 		} else {
// 			text = m + ":" + s;
// 		}
// 	}

// 	return text;
// }

