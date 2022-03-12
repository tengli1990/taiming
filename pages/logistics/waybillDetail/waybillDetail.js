import { getDeliveryRoutes } from '../../../apis/logistics'
import { WAYBILL_STATUS } from '../../../utils/constants'
const app = getApp()
const { $toast, $dialog } = app.globalData
Page({
 
  data: {
    mailNo:'',
    waybillNo: '',
    stepRoutes:[],
    steps: [],
    status:WAYBILL_STATUS
  },
  onLoad(opt) {
    this.setData({
      waybillNo: opt.waybillNo
    })

    this.getDetail()
  },
  getDetail() {
    const params = {
      waybill_no: this.data.waybillNo
    }
    getDeliveryRoutes(params).then(res => {
      if (res.error_code !== 0) {
        $toast(res.msg)
        return
      }
      const { routeResps } = res.data

      this.setData({
        stepRoutes: routeResps
      })

      if(!routeResps.length){
        return
      }
      const {routes, mailNo}  = routeResps[0]

      this.setData({
        mailNo: mailNo,
        steps: routes.reverse()
      })

    })
  }
})