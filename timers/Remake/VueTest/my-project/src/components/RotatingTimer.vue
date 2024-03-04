<script>
import { parseISO, format, add, isAfter } from 'date-fns';
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
      eventBus: undefined
    }
  },
  created() {
    console.log(this.$props)
    this.initializeEpoch()
    this.scheduleChangeEvery()
    this.scheduleChangeAt()
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


    initializeChangeAt(){

    }
    // Add other methods to manipulate erinnEntries, realEntries, etc. as needed
  },
  // might also use computed properties or watchers depending on how you want to react to changes in your data
}

</script>

<template>
  <h1>{{ this.$props.args.changeAt }}</h1>
  
</template>

<style scoped>

</style>
