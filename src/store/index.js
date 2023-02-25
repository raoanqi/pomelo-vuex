import Vue from 'vue'
import PomeloVuex from "@/store/pomeloVuex";

Vue.use(PomeloVuex)

// 从这里能够看出，vuex中有一个构造器store
const store = new PomeloVuex.Store({
    state: {
        number: 666
    },
    getters: {
        numberAddOne: (state) => state.number + 1
    },
    mutations: {
        addNumber(state, arg) {
            state.number += arg
        }
    },
    actions: {
        addNumberAsync({commit}, arg) {
            setTimeout(() => {
                commit('addNumber', arg)
            }, 1000)
        }
    }
})

export default store
