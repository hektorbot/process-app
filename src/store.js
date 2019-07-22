import Vue from 'vue';
import Vuex from 'vuex';

import http from './utils/http';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    artworksStack: [],
    preventShift: true,
  },
  mutations: {
    pushArtwork(state, artwork) {
      state.artworksStack.push(artwork);
    },
    shiftStack(state) {
      state.artworksStack.shift();
    },
    lockStack(state) {
      state.preventShift = true;
    },
    unlockStack(state) {
      state.preventShift = false;
    },
  },
  actions: {
    async requestNewArtwork({ getters, commit, dispatch }) {
      const { data } = await http({
        method: 'GET',
        url: '/artworks/',
        params: {
          limit: 1,
          offset: 0,
        },
      });
      const [artwork] = data.results;
      if (!getters.artworkIsInStack(artwork)) {
        commit('pushArtwork', artwork);
      }
      dispatch('shiftStackIfPossible');
    },
    shiftStackIfPossible({ state, commit }) {
      if (!state.preventShift && state.artworksStack.length > 1) {
        commit('shiftStack');
        commit('lockStack');
      }
    },
    lockStack({ commit }) {
      commit('lockStack');
    },
    unlockStack({ commit, dispatch }) {
      commit('unlockStack');
      dispatch('shiftStackIfPossible');
    },
  },
  getters: {
    artworkIsInStack: state => artwork => state
      .artworksStack
      .findIndex(item => item.slug === artwork.slug) !== -1,
    topArtwork: state => (state.artworksStack.length ? state.artworksStack[0] : null),
  },
});
