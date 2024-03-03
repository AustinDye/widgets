export default class SettingsParser {
    constructor(opts = []) {
      this.supportsCases = opts.includes("cases");
      this.csv = opts.includes("csv");
      this.h2c = opts.includes("hyphen2camel");
      this.cases = [];
      this.currentObject = {};
      this.currentKey = "";
      this.currentString = "";
      this.concat = false;
    }
  
    parse(settings) {
      const text = (settings + " ").match(/ +|[=,]|\{[^}]*\}|[^ ,=]+/g);
      text.forEach((token) => this.parseToken(token, settings));
      if (this.supportsCases) {
        this.cases.push(this.currentObject);
        return this.cases;
      }
      return this.currentObject;
    }
  
    parseToken(token, settings) {
        if (token.trim() === "") {
          if (this.currentKey && this.currentString) {
            if (this.csv) {
              this.currentObject[this.currentKey] = this.currentObject[this.currentKey] ? [...this.currentObject[this.currentKey], this.parseString()] : [this.parseString()];
            } else {
              if (this.currentObject[this.currentKey]) {
                // this.parseWarning(`Overriding old value for ${this.currentKey}`, settings);
              }
              this.currentObject[this.currentKey] = this.parseString();
            }
            this.currentKey = "";
          }
        } else if (token === "=") {
        //   if (!this.currentString) this.parseWarning("= without key", settings);
          this.currentKey = this.h2c ? this.currentString.replace(/-(.)/g, this.h2cf).replace(/-$/, "_") : this.currentString;
          this.currentString = "";
        } else if (token === ",") {
          if (this.currentKey && this.currentString) {
            if (this.csv) {
              this.currentObject[this.currentKey] = this.currentKey in this.currentObject ? [...this.currentObject[this.currentKey], this.parseString()] : [this.parseString()];
              this.currentString = "";
            } else {
              this.currentString += ",";
              this.concat = true;
            }
          } else {
            // this.parseWarning("unusual comma", settings);
          }
        } else {
          if (this.currentString) {
            if (this.supportsCases && this.currentString.toLowerCase() === "else") {
              this.cases.push(this.currentObject);
              this.currentObject = {};
            } else if (!this.concat) {
            //   this.parseWarning(`ignoring random literal '${this.currentString}'`, settings);
            }
          }
          this.currentString = this.concat ? this.currentString + token : token;
          this.concat = false;
        }
    }
  
    parseString() {
        let parsedString;
        if (this.currentString.startsWith("{")) {
          const tmp = this.currentString.slice(1, -1).split("/");
          parsedString = tmp.length === 1 ? tmp[0] : { string: tmp[0], extra: tmp.slice(1) };
        } else {
          parsedString = this.currentString;
        }
        this.currentString = "";
        return parsedString;
    }
  
    parseWarning(warning, settings) {
      console.warn(`parseSettings: ${warning} (settings: '${settings}')`);
    }
  
    h2cf(_, c) {
      return c.toUpperCase();
    }
  }
  
//   Usage
//   const parser = new SettingsParser(['cases', 'csv', 'hyphen2camel']);
//   const result = parser.parse('your_settings_string');
  