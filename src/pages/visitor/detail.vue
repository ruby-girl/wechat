<template>
  <div class="container-box">
    <div class="card-box">
      <div class="card-top display-flex justify-content-flex-justify align-items-center">
        <div class="top-item">
          <div>余额</div>
          <div class="red-txt">¥{{ memberAssetQuantity }}</div>
        </div>
        <div class="top-center">
           
          <van-image round width="65" height="65" :src="memberPicture" />
          <div>{{ name }}</div>
        </div>
        <div class="top-item">
          <!-- <div>余额</div>
          <div class="red-txt" style="">¥0.11</div> -->
          <van-button type="info" size="small" @click="transfer">转账</van-button>
        </div>
      </div>
      <div class="card-bottom">
        <!-- <div class="bottom-txt">895555asdasd</div> -->
        <div v-if="hasImg">
          <img :src="barCodeIMg" alt="" class="img-box" srcset="" />
          <img :src="qrCodeImg" alt="" class="img-box" srcset="" />
        </div>
        <div v-else style="margin-bottom: 40px">
          <van-button round type="primary" @click="getCodeImg" :loading="loading">点击获取二维码</van-button>
        </div>
        <div class="bottom-txt">二维码有效期为一分钟，此付款通过余额支付</div>
        <div class="bottom-txt">支付成功后，自动刷新余额</div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api'
import { CONFIG_STORAGE } from '@/utils/configs'
import { getStore } from '@/utils/util'
export default {
  data() {
    return {
      height: window.innerHeight - 100,
      memberPicture: '',
      qrCodeImg: '',
      barCodeIMg: '',
      name: '',
      timer: null,
      hasImg: false,
      memberAssetQuantity: '',
      loading: false,
      memberCode: ''
    }
  },
  created() {
    API.wechatInfo({ openId: getStore(CONFIG_STORAGE.openId), accessToken: getStore(CONFIG_STORAGE.accessToken) }).then(res => {
      this.memberPicture = res.data.memberPicture
      this.name = res.data.memberName
      this.memberAssetQuantity = res.data.memberAssetQuantity
    })
    this.getCodeImg()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getCodeImg() {
      this.loading = true
      API.memberCodeImg({ openId: getStore(CONFIG_STORAGE.openId) }).then(res => {
        this.loading = false
        if (res.code == '200') {
          this.qrCodeImg = res.data.qrCodeImg
          this.memberCode = res.data.memberCode
          this.barCodeIMg = res.data.barCodeIMg
          this.hasImg = true
          this.$nextTick(()=>{
            this.getRes()
          })
          let _this = this
          
          this.timer = window.setTimeout(() => {
            _this.hasImg = false
          }, 60000)
        }
      })
    },
    getRes() {
      API.getMemberPayRusult({ memberCode: this.memberCode }).then(res => {
        if (res.data.code == '200') {
          this.memberAssetQuantity = res.data.memberAssetQuantity
          this.$toast.success('余额已更新')
          this.hasImg = false
        } else {
          if(this.hasImg&&res.data.code=='204'){
            this.getRes()
          }
        }
      })
    },
    transfer() {
      this.$router.push({
        path: `/transfer`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-box {
  font-size: 16px !important;
  height: 100%;
  padding: 60px 20px 20px 20px;
  background: #439057;
  box-sizing: border-box;
}
.card-box {
  background: #fff;
  border-radius: 4px;
  height: 100%;
}
.card-top {
  height: 105px;
  border-bottom: 1px dashed #ccc;
}
.top-item {
  text-align: center;
  width: 90px;
}
.top-center {
  text-align: center;
  font-size: 14px;
  position: relative;
  top: -18px;
}
.card-bottom {
  padding-top: 40px;
  text-align: center;
}
.red-txt {
  color: red;
  padding-top: 5px;
}
.img-box {
  width: 75%;
}
.bottom-txt {
  text-align: center;
  font-size: 14px;
  color: #ccc;
  line-height: 30px;
  position: relative;
  top: -10px;
}
.van-button--small {
  font-size: 14px !important;
}
// flex布局
.display-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
// .display-flex > *{
//   display: block;
// }
.display-inline-flex {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
}
.display-inline-flex > * {
  display: block;
}
/*伸缩流方向*/
.flex-direction-column {
  -webkit-box-orient: vertical;
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
/*主轴对齐*/
.justify-content-flex-center {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
}
.justify-content-flex-end {
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
}
.justify-content-flex-justify {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}
/*侧轴对齐*/
.align-items-flex-start {
  -webkit-box-align: start;
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}
.align-items-flex-end {
  -webkit-box-align: end;
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;
}
.align-items-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.align-items-baseline {
  -webkit-box-align: baseline;
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;
}
.flex-wrap {
  flex-wrap: wrap;
}
/*伸缩性*/
.flex-auto {
  -webkit-box-flex: 1;
  -ms-flex: auto;
  -webkit-flex: auto;
  flex: auto;
}
.flex-1 {
  width: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
</style>
