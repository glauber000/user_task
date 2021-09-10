import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    users: [],
    url: 'http://localhost:5000/users',
    isLoading: false,
    teste: 'abc',
  },

  mutations: {
    setUsers: (state, users) => (state.users = users),
    setIsLoading: (state) => (state.isLoading = !state.isLoading),
  },

  getters: {
    getUser: (state, user) => state.users.find(user),
  },

  actions: {
    loadUsr: (context) => {
      try {
        console.log('FUNCTION OK');
        context.commit('setIsLoading');
        const request = axios.get('http://localhost:5000/users');
        context.commit('setUsers', request.data);
      } catch (err) {
        context.commit('setIsLoading');
        alert(err);
      } finally {
        context.commit('setIsLoading');
      }
    },
  },
});
store.dispatch('loadUsr');
export { store };
