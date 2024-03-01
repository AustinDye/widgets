import { parseISO, format, add, differenceInDays, isAfter } from 'date-fns';

class TimerTypeRotator {
  constructor({ epoch, changeAt, changeEvery, list }) {
    this.validateArgs({ epoch, changeAt, changeEvery });
    this.epoch = this.parseEpoch(epoch);
    this.changeAt = changeAt;
    this.changeEvery = changeEvery ? parseISO(changeEvery) : null;
    this.list = list;
    this.rotationIndex = 0;
    this.registerEvents();
  }

/**
 * Validates the constructor arguments based on the provided logic.
 * Throws an error if required arguments are missing or if conflicting arguments are provided.
 * @param {Object} args - The constructor arguments.
 */
validateArgs(args) {
    // Check for 'epoch' argument presence and validate its length
    if (!("epoch" in args)) {
      throw new Error("Rotate type requires an 'epoch'.");
    } else if (args.epoch.length > 1) {
      console.warn("Rotate type requires one 'epoch'. Using the first provided.");
    }
  
    // Ensure either 'changeAt' or 'changeEvery' is provided, but not both
    if (!("changeAt" in args) && !("changeEvery" in args)) {
      throw new Error("Rotate type requires either 'changeAt' or 'changeEvery'.");
    } else if ("changeAt" in args && "changeEvery" in args) {
      throw new Error("Rotate type cannot take both 'changeAt' and 'changeEvery'.");
    }
  
    // If 'changeEvery' is provided, validate its length
    if ("changeEvery" in args && args.changeEvery.length > 1) {
      console.warn("Rotate type can only have one 'changeEvery'. Using the first provided.");
    }
  
    // Additional validation for 'changeAt' format or values can be added here
    // For example, ensuring each time in 'changeAt' array is in a valid format
  }
  

/**
 * Parses the 'epoch' argument to a Date object.
 * Handles different formats, including timezone adjustments if indicated by a suffix.
 * @param {String|Array} epoch - The 'epoch' argument, which could be a string or an array with a single string element.
 * @returns {Date} The parsed 'epoch' as a Date object.
 */
parseEpoch(epoch) {
    // If 'epoch' is provided as an array, use the first element
    if (Array.isArray(epoch)) {
      epoch = epoch[0];
    }
  
    // Check for the special "S" suffix
    if (epoch.endsWith("S")) {
      // Remove the "S" suffix and parse the remaining string as a date-time in the SERVER_TIMEZONE
      // Assuming 'SERVER_TIMEZONE' is a predefined constant or could be obtained from the environment or configuration
      // The actual parsing and timezone handling would depend on the server's timezone setting or library capabilities
      return moment.tz(epoch.slice(0, -1), SERVER_TIMEZONE).toDate();
    } else {
      // Parse the epoch as a standard date-time string
      return moment(epoch).toDate();
    }
}
  
/**
 * Registers rotation events based on 'changeAt' and 'changeEvery' configurations.
 * Schedules updates for each time in 'changeAt' and sets up periodic updates for 'changeEvery'.
 */
registerEvents() {
    // Handle 'changeAt' configurations
    if (this.changeAt) {
      this.changeAt.forEach(time => {
        if (time === "sunshift") {
          // Handle sunshift events, assuming there are functions like `onErinnSunrise` and `onErinnSunset`
          // that register callbacks to be called at sunrise and sunset times in Erinn time.
          this.onErinnSunrise(this.update.bind(this));
          this.onErinnSunset(this.update.bind(this));
        } else if (time.endsWith("E")) {
          // Handle Erinn time events, assuming `onErinnTime` registers a callback for a specific Erinn time.
          this.onErinnTime(time, this.update.bind(this));
        } else {
          // Handle real time events, assuming `onRealTime` registers a callback for a specific real-world time.
          this.onRealTime(time, this.update.bind(this));
        }
      });
    }
  
    // Handle 'changeEvery' configurations
    if (this.changeEvery) {
      // Calculate the initial delay until the first 'changeEvery' event should occur from now
      const now = new Date();
      const initialDelay = this.changeEvery - (now.getTime() - this.epoch.getTime()) % this.changeEvery;
  
      // Set a timeout for the first 'changeEvery' event, after which setInterval will take over
      this.changeEveryTimeout = setTimeout(() => {
        this.update();
        // Set an interval for subsequent 'changeEvery' events
        this.changeEveryInterval = setInterval(this.update.bind(this), this.changeEvery);
      }, initialDelay);
    }
  }

 /**
 * Calculates the current rotation index based on the current time, 'epoch', and timing configurations.
 */
calculateRotation() {
    const now = new Date(); // Get the current time
  
    if (this.changeEvery) {
      // If rotation is based on a regular interval ('changeEvery')
      // If rotation is based on specific times ('changeAt')
      // This requires more complex logic, similar to what was described in your original code

    }
    // Ensure the rotation index loops within the list length
  }
  
  /**
   * Calculates the rotation based on specific times ('changeAt').
   * This is a more complex scenario that involves comparing the current time to each 'changeAt' time.
   * @param {Date} now - The current date and time.
   * @returns {Number} The calculated rotation index.
   */
  calculateRotationFromChangeAt(now) {
    // Convert 'changeAt' times to Date objects for comparison
    // Count the number of past 'changeAt' times to determine the rotation
  }
  
  /**
   * Parses a 'changeAt' time string to a Date object.
   * This method should handle the format of 'changeAt' times and convert them to Date objects.
   * @param {String} timeStr - The 'changeAt' time string.
   * @returns {Date} The 'changeAt' time as a Date object.
   */
  parseChangeAtTime(timeStr) {
    // Implementation depends on the format of 'changeAt' times
    // For example, if 'changeAt' times are in 'HH:mm' format:
  }

/**
 * Updates the rotation index and performs necessary actions to reflect the change.
 * This could include updating a display, triggering events, or any other required updates.
 */
update() {
    // Increment the rotation index
    // Perform any necessary updates that should occur with each rotation
    // If using 'changeEvery' for automatic rotation, schedule the next update
}
  
  /**
   * Performs the necessary updates associated with a rotation change.
   * This method can be customized to include any actions that need to be taken when the rotation updates.
   */
  performUpdates() {
    // Update display, trigger events, or perform other necessary actions here
    // For example, if there's a UI component that needs to be updated:
    // If there are any events or callbacks that need to be triggered, do so here
    // For example:
    // this.onRotationChange(this.getCurrentValue());
  }
  
  /**
   * Retrieves the current value from the list based on the rotation index.
   * @returns The current value in the rotation.
   */
  getCurrentValue() {
    return this.list[this.rotationIndex];
  }

 /**
 * Calculates and returns the time for the next rotation change.
 * This will differ based on whether the rotation is based on specific times ('changeAt')
 * or a regular interval ('changeEvery').
 * @returns {Date} The time at which the next rotation change will occur.
 */
  getNextChangeTime() {
    // If rotation is based on a regular interval ('changeEvery')
    // If rotation is based on specific times ('changeAt')
    // If neither 'changeEvery' nor 'changeAt' is configured, return null or throw an error
  }
  
  /**
   * Finds the next specific change time ('changeAt') after the current time.
   * Assumes 'changeAt' times are sorted and in the same day.
   * @param {Date} now - The current date and time.
   * @returns {Date} The time for the next specific rotation change, or null if none found.
   */
  getNextChangeAtTime(now) {
    // If no future changeAt time is found for today, return the first changeAt time of the next day
  }
  
  /**
   * Parses a 'changeAt' time string to a Date object for the given or next day.
   * @param {String} timeStr - The 'changeAt' time string (e.g., 'HH:mm').
   * @param {Date} referenceDate - The date to use as a reference for the time.
   * @returns {Date} The 'changeAt' time as a Date object.
   */
  parseChangeAtTime(timeStr, referenceDate) {
 
  }
  
}
