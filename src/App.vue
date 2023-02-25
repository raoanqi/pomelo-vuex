<template>
  <div id="app">
    <div>Test</div>
    <div>{{ $store.state.number }}</div>
    <div>{{ $store.getters.numberAddOne }}</div>
    <button
        style="width: 200px;background-color: pink;"
        @click="addNumber(10)">
      Add Number(mutation)
    </button>
    <button
        style="width:200px;background-color: red;"
        @click="addNumberAsync(100)">
      Add Number(action)
    </button>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    addNumber(number) {
      this.$store.commit('addNumber', number)
    },
    addNumberAsync(number) {
      this.$store.dispatch('addNumberAsync', number)
    }
  }
}
</script>