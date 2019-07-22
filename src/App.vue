<template>
  <div id="app">
    <transition
      :css="false"
      @enter="onArtworkEnter"
      @leave="onArtworkLeave"
    >
      <Artwork
        v-if="topArtwork"
        :key="topArtwork.id"
        :artwork="topArtwork"
        @done="onArtworkRevealed"
      />
    </transition>
  </div>
</template>

<script>
import anime from 'animejs';
import { mapActions, mapGetters } from 'vuex';

import Artwork from './components/Artwork.vue';

export default {
  name: 'App',
  components: {
    Artwork,
  },
  data() {
    return {
      pollInterval: null,
    };
  },
  computed: {
    ...mapGetters(['topArtwork']),
  },
  created() {
    this.requestNewArtwork();
    this.pollInterval = setInterval(
      this.requestNewArtwork,
      process.env.VUE_APP_POLL_INTERVAL,
    );
  },
  beforeDestroy() {
    clearInterval(this.pollInterval);
  },
  methods: {
    ...mapActions(['requestNewArtwork', 'lockStack', 'unlockStack']),
    onArtworkEnter(el, complete) {
      anime({
        targets: el,
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutQuad',
        complete,
      });
    },
    onArtworkLeave(el, complete) {
      anime({
        targets: el,
        opacity: [1, 0],
        duration: 1000,
        easing: 'easeInOutQuad',
        complete,
      });
    },
    onArtworkRevealed() {
      this.unlockStack();
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono:700&display=swap');

body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'IBM Plex Mono', monospace;
  word-break: break-all;
}
#app {
}
</style>
