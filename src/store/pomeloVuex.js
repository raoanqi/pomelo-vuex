import Vue from 'vue'

// 由于vuex中有一个构造器store，这里用这个store类代替
class Store {
  constructor(options) {
    /**
     * state
     */
    // 下面这种写法，虽然能实现数据的正常渲染，但是数据并不是响应式的
    // this.state = options.state || {}
    // 借助vue实现数据的响应式
    this.vm = new Vue({
      data: {
        state: options.state
      }
    })

    /**
     * getters
     */
    const getters = options.getters || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName => {
      Object.defineProperty(this.getters, getterName, {
        get: () => getters[getterName](this.state)
      })
    })

    /**
     * mutations
     */
    const mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = arg => mutations[mutationName](this.state, arg)
    })

    /**
     * actions
     */
    const actions = options.actions || {}
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      // 注意这里，参数中传递了this，这个this就是当前class创建出来的store实例
      // 原因在于action中第一个参数是{commit}，这个commit其实是来自于对store的解构，因此这个store也传入进去，也就是此处的this
      this.actions[actionName] = arg => actions[actionName](this, arg)
    })
  }


  // 提供一个方法获取state
  /**
   * @returns {*}
   * es6中的getter语法
   * 该语法一般用于限制对私有属性的访问，即访问私有属性时只能通过getter访问，这样就能避免很多不安全的操作
   * 在使用时，直接：实例.方法名，例如：store.state，不用加括号
   */
  get state() {
    return this.vm.state
  }

  /**
   * @param mutationName
   * @param arg
   * 请注意这里，commit需要使用的使用箭头函数来确保commit中的this是当前的store对象
   * 因为在actions中触发mutations时，使用的是commit(mutationName, arg)的方式，
   * 所以这里必须确保commit内部能访问到store
   */
  commit = (mutationName, arg) => {
    this.mutations[mutationName](arg)
  }

  /**
   * @param actionName
   * @param arg
   * dispatch则不用像commit那样使用箭头函数，因为在调用actions时
   * 使用的方式是this.$store.dispatch(actionName)的方式，它是一定能访问到store的
   */
  dispatch(actionName, arg) {
    this.actions[actionName](arg)
  }
}

/**
 * @param Vue
 * 在Vuex的使用中，需要使用Vue.use将store以插件的方式注入，因此需要提供一个名为install的方法
 */
const install = function (Vue) {
  /**
   * mixin：全局混入，会影响到每一个组件
   * 这里采用全局混入是为了将$store挂载到每一个组件上，这样才能确保每个组件能都访问到$store
   */
  Vue.mixin({
    /**
     * 子组件的beforeCreate晚于父组件的beforeCreate
     * 所以只要确保父组件有$store，那么子组件就能顺利拿到父组件的$store
     */
    beforeCreate() {
      /**
       * new Vue({
       *   store,
       *   render: h => h(App),
       * }).$mount('#app')
       * main.js中在初始化应用程序时，会传入store，此时只有根组件能够拿到这个store，
       * 因此如果this.$options.store有值，就说明是根组件，那么直接执行this.$store = this.$options.store将store挂载到根组件
       * 根组件有$store之后，各级子组件就可以一级一级向下传递，每一个子组件都会去对应的父组件上拿到$store然后挂载
       * 从而实现全部组件都有$store的目标
       */
      if (this.$options?.store) {
        // 根组件
        this.$store = this.$options.store
      } else {
        // 各级子组件
        this.$store = this?.$parent?.$store
      }
    }
  })
}

const PomeloVuex = {
  Store,
  install
}

export default PomeloVuex