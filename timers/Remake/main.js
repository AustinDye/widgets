

function test(){
    const timers = document.querySelectorAll('.make-timer');
    for(let i = 0;i < timers.length; i++){
        const timer = timers[i]
      
        const args = parseSettings(timer.innerText, ["csv", "hyphencamel"]);
		let domList = [... document.querySelector('.make-timer').getElementsByTagName('li')];
		let list = []
		domList.forEach(Element => {
			list.push(Element.innerHTML)
		})

		console.log(args)
        const rotatingTimer = new RotatingTimer(null, args, list)
        console.log(rotatingTimer)
    }
}

function parseSettings(settings, opts = []) {
	const text = (settings + " ").match(/ +|[=,]|\{[^}]*\}|[^ ,=]+/g);
	const supportsCases = opts.includes("cases");
	const csv = opts.includes("csv");
	const h2c = opts.includes("hyphen2camel");
	let currentObject = {};
	let currentKey = "";
	let currentString = "";
	let concat = false;
	const cases = [];
  
	const parseString = () => {
	  let ret;
	  if (currentString.startsWith("{")) {
		const tmp = currentString.slice(1, -1).split("/");
		ret = tmp.length === 1 ? tmp[0] : { string: tmp[0], extra: tmp.slice(1) };
	  } else {
		ret = currentString;
	  }
	  currentString = "";
	  return ret;
	};
  
	const parseWarning = (warning) => {
	  console.warn(`parseSettings: ${warning} (settings: '${settings}')`);
	};
  
	const h2cf = (_, c) => c.toUpperCase();
  
	text.forEach((token) => {
	  if (token.trim() === "") {
		if (currentKey && currentString) {
		  if (csv) {
			currentObject[currentKey] = currentObject[currentKey] ? [...currentObject[currentKey], parseString()] : [parseString()];
		  } else {
			if (currentObject[currentKey]) {
			  parseWarning(`Overriding old value for ${currentKey}`);
			}
			currentObject[currentKey] = parseString();
		  }
		  currentKey = "";
		}
	  } else if (token === "=") {
		if (!currentString) parseWarning("= without key");
		currentKey = h2c ? currentString.replace(/-(.)/g, h2cf).replace(/-$/, "_") : currentString;
		currentString = "";
	  } else if (token === ",") {
		if (currentKey && currentString) {
		  if (csv) {
			currentObject[currentKey] = currentKey in currentObject ? [...currentObject[currentKey], parseString()] : [parseString()];
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
		  if (supportsCases && currentString.toLowerCase() === "else") {
			cases.push(currentObject);
			currentObject = {};
		  } else if (!concat) {
			parseWarning(`ignoring random literal '${currentString}'`);
		  }
		}
		currentString = concat ? currentString + token : token;
		concat = false;
	  }
	});
  
	if (supportsCases) {
	  cases.push(currentObject);
	  return cases;
	}
	return currentObject;
  }
  