import http from './httpInstance'


const API = {
  GET_AUTHOR_URL: '/author/authUrl', // 获取网页授权code的url
  GET_AUTHOR_OPENID: '/wx/userInfo', // 根据网页授权code的url获取openId
  SENT_CODE: '/member/info/send', // 根据网页授权code的url获取openId
  CHECK_MEMEBER: '/member/info/checkMemeberOpenId', // 根据网页授权code的url获取openId
  GET_USER:'/wx/callBack',
  GET_CODE_IMG:'/member/info/memberCodeImg',
  GET_TRANSFER:'/member/info/memberTransfer',
  BIND_WECHAT:'/member/info/wechatRegister',
  GET_INFO:"/member/info/wechatLogin"//获取用户信息
}

const isDev = process.env.NODE_ENV === 'development'

Object.keys(API).forEach(key => {
  API[key] = `${isDev ? '/dev' : '/' + process.env.VUE_APP_CONTEXT}${API[key]}`
})

const ApiService = {
   /**
   * @description 发送验证码
   * @param {*} params
   * @returns
   */
    sentCode(params) {
        return http({
          method: 'get',
          url: API.SENT_CODE+'/'+params,
          
        })
    },
     /**
   * @description 验证是否绑定了微信
   * @param {*} data
   * @returns
   */
      checkMemeberOpenId(data) {
        return http({
          method: 'post',
          url: API.CHECK_MEMEBER,
          data
        })
    },
      /**
   * @description 获取用户信息
   * @param {*} data
   * @returns
   */
       wechatInfo(data) {
        return http({
          method: 'post',
          url: API.GET_INFO,
          data
        })
    },
     /**
   * @description 获取用户信息
   * @param {*} data
   * @returns
   */
      getUserInfo(params) {
        return http({
          method: 'get',
          url: API.GET_USER,
          params
        })
    },
     /**
   * @description 获取二维码图片
   * @param {*} data
   * @returns
   */
      memberCodeImg(data) {
        return http({
          method: 'post',
          url: API.GET_CODE_IMG,
          data
        })
    },
        /**
   * @description 转账
   * @param {*} data
   * @returns
   */
    memberTransfer(data) {
          return http({
            method: 'post',
            url: API.GET_TRANSFER,
            data
          })
      },
       /**
   * @description 绑卡
   * @param {*} data
   * @returns
   */
        wechatRegister(data) {
          return http({
            method: 'post',
            url: API.BIND_WECHAT,
            data
          })
      },
  /**
   * @description 获取公众号openId
   * @param {*} params
   * @returns
   */
  getWxTokenApi(params) {
    // if (isDev) {
    //   return Promise.resolve(WxToken)
    // } else {
      return http({
        method: 'get',
        url: API.GET_AUTHOR_OPENID,
        params
      })
    // }
  }
}

export default ApiService
