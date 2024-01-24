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
    let getters = options.getters || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName => {
      Object.defineProperty(this.getters, getterName, {
        get: () => getters[getterName](this.state)
      })
    })

    /**
     * mutations
     */
    let mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName => {
      this.mutations[mutationName] = arg => mutations[mutationName](this.state, arg)
    })

    /**
     * actions
     */
    let actions = options.actions || {}
    this.actions = {}
    Object.keys(actions).forEach(actionName => {
      // 注意这里，参数中传递了this，这个this就是当前class创建出来的store实例
      // 原因在于action中第一个参数是{commit}，这个commit其实是来自于对store的解构，因此这个store必须传入禁区，也就是此处的this
      this.actions[actionName] = arg => actions[actionName](this, arg)
    })
  }


  // 提供一个方法获取state
  get state() {
    return this.vm.state
  }

  // 提供一个commit方法，触发mutation，这里要使用箭头函数确保this是$store
  commit = (mutationName, arg) => {
    this.mutations[mutationName](arg)
  }

  // 提供一个dispatch方法，去触发action
  dispatch(actionName, arg) {
    this.actions[actionName](arg)
  }
}

// 由于要支持vue.use，因此需要提供一个install方法
// install方法的作用在于将store实例给项目中的所有组件共享
const install = function (Vue) {
  // 这里使用mixin是为了将$store混入到各个组件中去
  Vue.mixin({
    // 子组件的beforecreate晚于父组件的beforecreate，因此子组件能拿到父组件的$store
    beforeCreate() {
      // 初始化时只有根组件有$store，如果是根组件，直接将store挂载上去
      if (this.$options?.store) {
        this.$store = this.$options.store
      } else {
        // 如果不是根组件，就要去父级组件里面获取$store
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