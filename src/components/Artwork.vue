<template>
  <div class="artwork">
    <div>
      <div class="image-name">
        {{ artwork.slug }}
      </div>
      <div
        v-for="overlayImage in overlayImages"
        :key="overlayImage.slug"
        class="overlay-image-wrapper"
      >
        <img
          :ref="overlayImage.id"
          :src="overlayImage.src"
          :class="[overlayImage.id, 'overlay-image']"
        >
      </div>
      <img
        :src="artwork.full"
        class="template"
      >
      <div
        ref="final-screen"
        class="final-screen"
      >
        Création en cours
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs';

import { sleep, waitForImagesToLoad } from '../utils/helpers';

export default {
  props: {
    artwork: {
      type: Object,
      required: true,
    },
  },
  computed: {
    overlayImages() {
      const { artwork } = this;
      return [
        {
          src: artwork.input_image,
          id: 'input-image',
        },
        {
          src: artwork.pixel_sorted_image,
          id: 'pixelsorted-image',
        },
        {
          src: artwork.style_transferred_image,
          id: 'style-transferred-image',
        },
        {
          src: artwork.style_image,
          id: 'style-image',
        },
        {
          src: artwork.colored_image,
          id: 'colored-image',
        },
        {
          src: artwork.visually_similar_image,
          id: 'visually-similar-image',
        },
        {
          src: artwork.full,
          id: 'final-image',
        },
      ];
    },
  },
  async mounted() {
    await Promise.all([sleep(process.env.VUE_APP_INITIAL_SLEEP), waitForImagesToLoad(this.$el)]);
    /* eslint-disable no-await-in-loop, no-restricted-syntax */
    for (const overlayImage of this.overlayImages) {
      await this.revealLayer(overlayImage.id);
      await sleep(process.env.VUE_APP_SLEEP_BETWEEN_STEPS);
    }
    /* eslint-enable no-await-in-loop, no-restricted-syntax */
    await sleep(5000);
    this.$emit('done');
    await sleep(500);
    await this.revealLayer('final-screen');
  },
  methods: {
    revealLayer(ref) {
      return anime({
        targets: this.$refs[ref],
        opacity: [0, 1],
        duration: process.env.VUE_APP_IMAGES_TRANSITION_DURATION,
        easing: 'easeInOutQuad',
      }).finished;
    },
  },
};
</script>

<style lang="scss" scoped>
.artwork {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.artwork > div {
  text-align: center;
  position: relative;
}
.template {
  width: 100%;
}
.image-name,
.final-screen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-color: #dbefda;
  color: #fff;
  font-size: 2.5em;
}
.overlay-image-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.final-image,
.pixelsorted-image,
.style-transferred-image,
.input-image {
  width: 100%;
}
img {
  opacity: 0;
  max-width: 100%;
}
.final-screen {
  opacity: 0;
}
</style>
