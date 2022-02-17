/* components/circle/circle.js */
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    draw: {//画板元素名称id
      type: String,
      value: 'draw',
      observer: function (newVal, oldVal, change) {
        // console.log(newVal, oldVal, change);
      }
    },
    per: { //百分比 通过此值转换成step
      type: String,
      value: '0',
      observer: function (newVal, oldVal, change) {
        // console.log(newVal, oldVal, change);
      }
    },
    r: {//半径
      type: Number,
      value: 50,
      observer: function (newVal, oldVal, change) {
        // console.log(newVal, oldVal, change);
      }
    },
    src: {
      type: String,
      value: '',
      observer: function (newVal, oldVal, change) {
        //  console.log(newVal, oldVal, change)
      }
    },
    isPortrait: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, change) {
        // console.log(newVal, oldVal, change)
      }
    }
  },
  data: { /*  私有数据，可用于模版渲染 */
    processImage:{
      '33.33':'3',
      '66.66':'6',
      '100':'10'
    },
  },
  methods: {

   
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // const _this = this;
      // //获取屏幕宽度
      // wx.getSystemInfo({
      //   success: function (res) {
      //     _this.setData({
      //       screenWidth: res.windowWidth
      //     });
      //   },
      // });

      // //初始化
      // const el = _this.data.draw; //画板元素
      // const per = _this.data.per; //圆形进度
      // const r = Number(_this.data.r); //圆形半径

      // _this.setData({
      //   step: (2 * Number(_this.data.per)) / 100,
      //   txt: _this.data.per
      // });


      // //获取屏幕宽度(并把真正的半径px转成rpx)
      // let rpx = (_this.data.screenWidth / 750) * r;
      // //计算出画板大小
      // this.setData({
      //   size: rpx * 2
      // });
    }
  }
})