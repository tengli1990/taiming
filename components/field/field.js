Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: '',
      observer:function(newVal,oldVal,change){
        this.tit = newVal
      }
    },
    brief: {
      type: String,
      value: '',
      observer:function(newVal,oldVal,change){
      }
    },
  },
  data: {
    tit:''
  },
})