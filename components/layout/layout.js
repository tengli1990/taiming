/* components/circle/circle.js */
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    footer: {//画板元素名称id
      type: Boolean,
      value: false
    },
    footerFixed: {//画板元素名称id
      type: Boolean,
      value: false
    },
  },
  data: { /*  私有数据，可用于模版渲染 */
  },
  methods: {
   
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    }
  }
})