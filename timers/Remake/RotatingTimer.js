class RotatingTimer {
  constructor(display, args) {
    
    this.epoch = args.epoch
    this.list = args.list
    this.changeAt = args["change-at"] || ""
    this.label = args.label
    this.validateArgs(args)
  }

  testFunc(){
    console.log(epoch)
  }

  validateArgs(args) {
    if (!this.epoch) throw new Error("Rotate type requires an 'epoch'.");
    if (!this.changeAt && !this.changeEvery) throw new Error("Rotate type requires either change-at or change-every.");
    if (this.changeAt && this.changeEvery) throw new Error("Rotate type cannot take both 'changeAt' and 'changeEvery'.");
  }

  setupTimers() {
    // Simplify event registration based on 'changeAt' and 'changeEvery'
    this.changeAt.forEach(time => this.registerTimeEvent(time));
    if (this.changeEvery) this.scheduleChangeEvery();
  }

  registerTimeEvent(time) {
    // Abstracted logic for registering time-based events
  }

  scheduleChangeEvery() {
    // Logic to schedule the 'changeEvery' event
    const now = new Date();
    const initialDelay = this.changeEvery - (now.getTime() - this.epoch.getTime()) % this.changeEvery;
    setTimeout(() => this.updateRotation(), initialDelay);
  }

  updateRotation() {
    // Logic to update rotation and reschedule 'changeEvery'
    this.rotationIndex = (this.rotationIndex + 1) % this.list.length;
    this.updateDisplay();
    if (this.changeEvery) setTimeout(() => this.updateRotation(), this.changeEvery);
  }

  updateDisplay() {
    // Logic to update the display with the current state
  }

  // Additional methods as needed (e.g., `getNextChangeTime`, `parseChangeAtTime`)
}

