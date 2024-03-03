<script>
import { parseISO, format, add, isAfter } from 'date-fns';

export default{
  props: {
    display: {
      type: String,
    },
    args: {
      type: Object,
      required: true,
    },
    list: {
      type: String,
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
      curEI: null,
      curRI: null,
      curIsErinn: false,
      every: undefined,
      nextEvery: undefined,
      rotation: 0,
      lastUpdate: null,
      epoch: null,
    }
  },
  created() {
    console.log(this.props)

  },
  methods: {
    initializeEpoch() {
      
      if (args.epoch && args.epoch.length > 0) {
        const epochStr = args.epoch[0];
        if (epochStr.endsWith('S')) {
          const withoutS = epochStr.slice(0, -1);
          this.epoch = zonedTimeToUtc(withoutS, process.env.SERVER_TIMEZONE);
        } else {
          this.epoch = parseISO(epochStr);
        }
      }
    },

    initializeEvery() {
      if (this.args.changeEvery) {
        // Assuming changeEvery is a duration string like 'P1D' (1 day)
        // `date-fns` doesn't directly support ISO 8601 duration strings, so you might need a custom parser or handle it differently
        // For simplicity, let's assume changeEvery is in milliseconds
        this.every = add(new Date(0), { milliseconds: this.args.changeEvery });
      }
    },
    // Add other methods to manipulate erinnEntries, realEntries, etc. as needed
  },
  // You might also use computed properties or watchers depending on how you want to react to changes in your data
}

</script>

<template>
  <h1>{{ this.epoch }}</h1>
  
</template>

<style scoped>

</style>
