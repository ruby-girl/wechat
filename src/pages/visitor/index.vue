<template>
  <layout>
    <div class="visitor">
      <van-form @submit="onSubmit">
        <div class="visitor-card">
         <van-field
            v-model="form.visitorname"
            :maxlength="12"
            name="visitorname"
            label="姓名"
            placeholder="姓名"
            clearable
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field label="手机号" v-model="form.phone" center required placeholder="请输入手机号" :border="true" />
          <van-field v-model="sms" center required clearable label="验证码" placeholder="请输入验证码" :border="false" use-button-slot>
            <van-button slot="button" size="small" type="primary" @click="gainCode">{{ time }}</van-button>
          </van-field>
          <van-field
            icon-prefix="iconfont"
            left-icon="shijian"
            readonly
            clickable
            name="datetimeEndPicker"
            :value="form.visitendtime"
            label="生日"
            placeholder="点击选择生日"
            :rules="[{ required: true, message: '请选择生日', trigger: 'onChange' }]"
            @click="selectTime('end')"
          />
        </div>
        <van-popup v-model="timeShowPicker" position="bottom">
          <van-datetime-picker v-model="currentTimeDate" type="date" @confirm="timeOnConfirm" @cancel="timeShowPicker = false" />
        </van-popup>
        
        <div class="visitor-btn">
          <van-button round block type="info" native-type="submit">确定开卡/绑定</van-button>
        </div>
      </van-form>
    </div>
  </layout>
</template>

<script>
import layout from '../../layouts/layout'
import moment from 'moment'
import API from '@/api'
import { CONFIG_STORAGE } from '@/utils/configs'
import { VueDebounce, getStore } from '@/utils/util'
export default {
  data() {
    return {
      currentSelectTime: '', // 来访时间和离开时间类型
      timeShowPicker: false, // 是否显示时间选择器
      currentTimeDate: new Date(), // 时间选择器显示当前时间
      visitoropenid: getStore(CONFIG_STORAGE.openId), // 访问者openId
      visitorphoto: '', // 访问者头像
      form: {
        phone: '', // 被访人电话
        visitorname: '', // 访客姓名
        visitoridphone: '' // 访客手机号码
      },
      isClick: true,
      time: '获取验证码',
      sms: ''
    }
  },
  components: {
    layout
  },
  mounted() {
    this.getPersonsInfo()
  },
  methods: {
    // 获取验证码
    async gainCode() {
      if (this.isClick) {
        if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(this.form.phone)) {
          const res = await API.sentCode(this.form.phone) // 获取验证码接口
          this.isClick = false
          let s = 60
          this.time = s + 's'
          let interval = setInterval(() => {
            s--
            this.time = s + 's'
            if (s < 0) {
              this.time = '重新获取'
              this.isClick = true
              clearInterval(interval)
            }
          }, 1000)
        } else {
          this.$toast('请输入正确的手机号码')
        }
      }
    },
    /**
     * @description 手机号校验
     */
    visitorphoneValidator(val) {
      const regStr = /^[1][3,4,5,7,8,9][0-9]{9}$/g
      return regStr.test(val)
    },

    /**
     * @description 输入内容防抖函数
     */
    searchInputValue: VueDebounce('searchPerson', 1000),
    /**
     * @description 搜索被访者工号，电话，身份证
     */
    searchPerson() {
      // 如果身份证或者工号存在，不调用接口
      if (this.form.jobno && this.form.certificateno) return
      const params = {
        personname: this.form.personname,
        phone: this.form.phone
      }
      API.queryPersonApi(params).then(res => {
        if (res.code === '0') {
          const { jobno, phone, idcardno, personname } = res.data
          this.form.jobno = jobno
          this.form.phone = phone
          this.form.certificateno = idcardno
          this.form.personname = personname
        } else {
          this.$toast('未查询到被访问人信息')
        }
      })
    },
    /**
     * 根据openid查询信息
     */
    getPersonsInfo() {
      const data = {
        openid: getStore(CONFIG_STORAGE.openId)
      }
      API.queryPersonsInfoApi(data).then(res => {
        if (res.code === '0') {
          if (res.data) {
            const { idcardno, personname, phone, photo, plateno } = res.data
            this.form.visitoridphone = phone
            this.form.visitorname = personname
            this.form.visitoridno = idcardno
            this.form.plateno = plateno
            this.visitorphoto = photo
          }
        } else {
          this.$toast('未查询到信息请重新预约')
        }
      })
    },
    /**
     * @description 来访时间和离开时间选择
     */
    selectTime(val) {
      this.currentSelectTime = val
      this.timeShowPicker = true
    },
    /**
     * @description timepicker确认
     */
    timeOnConfirm(val) {
      const time = moment(val).format('YYYY-MM-DD')

      this.form.visitendtime = time

      this.timeShowPicker = false
    },
    /**
     * @description 提交预约信息
     */
    onSubmit() {
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      const data = {
        ...this.form,
        visitoropenid: this.visitoropenid,
        visitorphoto: this.visitorphoto
      }
      API.visitorReservationApi(data).then(res => {
        if (res.code == '200') {
          this.$router.push({
            path: '/inviteSucess'
          })
          this.$toast.success('预约成功')
        } else {
          this.$toast('系统繁忙，请重新预约')
          this.$router.push({
            path: '/'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.visitor {
  padding-bottom: 54px;
  .visitor-card {
    position: relative;
    padding: 15px 0;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 10px;
    &-del {
      position: absolute;
      top: 10px;
      right: 15px;
      z-index: 9999;
    }
  }
  .visitor-btn {
    
    width: calc(100% - 20px);
    margin: 0 auto;
    margin-top: 50px;
    
    button + button {
      margin-left: 20px;
    }
  }
}
::v-deep .van-button--info {
  background: linear-gradient(to right, rgba(102, 145, 255, 1), rgba(0, 72, 255, 1));
  border-color: rgba(102, 145, 255, 1);
}
</style>
