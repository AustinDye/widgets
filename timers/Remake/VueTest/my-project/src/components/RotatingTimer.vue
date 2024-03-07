<script>
import { parseISO, parse, format, add, isAfter, setHours, setMinutes, getHours, getMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import emitter from 'tiny-emitter/instance'
import { onMounted, onBeforeUnmount } from 'vue';

export default{
  props: {
    args: {
      type: Object,
      required: true,
    },
    list: {
      type: Array,
      default: '',
    },
    label: {
      type: String,
      default: 'Timer',
    },
  },
  data() {
    return{
      erinnEntries: [],
      realEntries: [],
      currentErinnIndex: null,
      currentRealIndex: null,
      curIsErinn: false,
      every: undefined,
      nextEvery: undefined,
      rotation: 0,
      lastUpdate: null,
      epoch: null,
      eventBus: undefined,
      serverTimeZone: "America/Los_Angeles",
      serverTime: undefined
    }
  },
  created() {
    if(this.$props.args.changeAt){
      console.log(this.$props);
      this.initializeEpoch();
      this.scheduleChangeEvery();
      this.scheduleChangeAt();
      console.log(this.erinnEntries);
      this.erinnEntries.sort(() => {
        this.parseTime(a, this.serverTime) - this.parseTime(b, this.serverTime)
      });
    }
    if (erinnEntries.length) {
      this.rotateErinn()
    }
  },

  onMounted(){
      emitter.on('ErinnSunshift', (callback) => {
        // Handle ErinnSunshift event
        callback()
        console.log("ErinSunshift");
      });
      emitter.on('ErinnTime', ({ time, callback }) => {
        // Handle ErinnTime event
        console.log("ErinnTime");
      });
      emitter.on('RealTime', ({ time, callback }) => {
        // Handle RealTime event
        console.log("RealTime");
      });
    },

    onBeforeUnmount(){
      emitter.off('ErinnSunshift');
      emitter.off('ErinnTime');
      emitter.off('RealTime');
    },

  methods: {
    initializeEpoch() {
      
      if (this.$props.args.epoch && this.$props.args.epoch.length > 0) {
        const epochStr = this.$props.args.epoch;
        if (epochStr.endsWith('S')) {
          const withoutS = epochStr.slice(0, -1);
          this.epoch = formatInTimeZone(withoutS,'America/Los_Angeles', 'yyyy-MM-dd HH:mm:ssXXX')
          console.log(this.epoch)
        } else {
          this.epoch = parseISO(epochStr);
        }
      }
    },

    scheduleChangeEvery() {
      if (this.$props.args.changeEvery) {
        // Assuming changeEvery is a duration string like 'P1D' (1 day)
        // `date-fns` doesn't directly support ISO 8601 duration strings, might need a custom parser or handle it differently
        // For simplicity, let's assume changeEvery is in milliseconds
        this.every = add(new Date(0), { milliseconds: this.$props.args.changeEvery });
        console.log(this.every)
      }
    },

    scheduleChangeAt() {
      const changeAt = this.$props.args.changeAt;
      if (changeAt) {
        if (changeAt === "sunshift") {
          this.erinnEntries.push("06:00E", "18:00E");
          console.log('Sunshift')
          emitter.emit('ErinnSunshift', this.update); // Emitting custom event
        } else if (changeAt.endsWith('E')) {
          this.erinnEntries.push(changeAt);
          console.log(this.erinnEntries)
          emitter.emit('ErinnTime', { time: changeAt, callback: this.update }); // Emitting custom event with payload
        } else {
          this.realEntries.push(changeAt);
          console.log('RealTime')
          emitter.emit('RealTime', { time: changeAt, callback: this.update }); // Emitting custom event with payload
        }
      }
    },

    update(event) {
      this.rotation = (this.rotation + 1) % this.list.length;
      console.log('update')

      if (event) {
        const eventTypePrefix = event.type.split('-')[0];
        switch (eventTypePrefix) {
          case "ErinnTime":
            this.currentErinnIndex = (this.currentErinnIndex + 1) % this.erinnEntries.length;
            break;
          case "RealTime":
            this.currentRealIndex = (this.currentRealIndex + 1) % this.realEntries.length;
            break;
        }
        currentIsErinn = isErinn(this.currentErinnIndex, this.currentRealIndex);
      }
    },

    parseTime(time, serverTime) {
      console.log(time)
      if (time.match(/E$/)) {
          // Is Erinn time, returns in minutes
          const mo = time.match(/^([0-9]{1,2}):([0-9]{2})E?$/);
          if (!mo) return console.warn("Bad Erinn time: " + time);
          return parseInt(mo[1], 10) * 60 + parseInt(mo[2], 10);
      } else if (time.match(/S$/)) {
          // Parse Server time of day
          let serverDate = serverTime ? parseISO(serverTime) : new Date(); // Assuming serverTime is an ISO string or null

          const [hours, minutes] = time.substr(0, time.length - 1).split(':').map(n => parseInt(n, 10));
          serverDate = setHours(serverDate, hours);
          serverDate = setMinutes(serverDate, minutes);

          return getHours(serverDate) * 60 + getMinutes(serverDate);
      } else {
          // Parse time of day with TZ
          const dateString = new Date().toISOString().slice(0, 11) + time; // Prepend current date to ensure correct parsing
          const t = parseISO(dateString);

          return getHours(t) * 60 + getMinutes(t);
      }
    },

    getServerTime() {
      const now = new Date();
      const zonedTime = utcToZonedTime(now, this.serverTimeZone); 
      this.serverTimer = format(zonedTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: this.serverTimeZone });
    },

    rotateErinn(){
      const ete = getErinnTime(epoch);
      const etn = getErinnTime(stn);
      let rotation = 0;

      // Find all Erinn-time changes between the epoch and Erinn's midnight.
      erinnEntries.forEach((entry) => {
 
      });

      // Find all Erinn-time changes between Erinn's midnight and now.
      erinnEntries.forEach((entry) => {
     
      });

      // Add rotation for every Erinn day passed wrt the number of changes per day.


    },

    getErinnTime(){
      if (serverTime) {
      // Convert serverTime to a Date object if it's not already one
      const time = typeof serverTime === 'string' ? parseISO(serverTime) : serverTime;
      
      // Convert time to UTC and calculate minutes since epoch
  
    },

    initializeChangeAt(){

    }
  
  },
  // might also use computed properties or watchers depending on how we want to react to changes in our data
}

</script>

<template>
  <h1>{{ this.$props.args.changeAt }}</h1>
  
</template>

<style scoped>

</style>
