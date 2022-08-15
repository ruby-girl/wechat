<template>
  <layout>
    <div class="visitor">
      <van-form @submit="onSubmit">
        <div class="visitor-card">
          <van-field v-model="form.memberName" :maxlength="12" name="memberName" label="姓名" required placeholder="请输入姓名" clearable />
          <van-field label="手机号" type="number" v-model="form.memberPhone" center required placeholder="请输入手机号" :border="true" />
          <van-field v-model="sms" type="number" center required clearable label="验证码" placeholder="请输入验证码" :border="true" use-button-slot>
            <van-button slot="button" size="small" type="primary" native-type="button" @click="gainCode">{{ time }}</van-button>
          </van-field>
          <!-- <van-field
            icon-prefix="iconfont"
            left-icon="shijian"
            readonly
            clickable
            required
            name="datetimeEndPicker"
            :value="form.visitendtime"
            label="生日"
            placeholder="点击选择生日"
            :border="true"
            @click="selectTime()"
          /> -->
          <!-- <van-field
          readonly
          clickable
          name="picker"
          :value="form.categoryName"
          label="分组"
          placeholder=""
          @click="showSelectPicker = true"
        /> -->
        </div>
        <!-- <van-popup v-model="timeShowPicker" position="bottom">
          <van-datetime-picker v-model="currentTimeDate" type="date" @confirm="timeOnConfirm" @cancel="timeShowPicker = false" />
        </van-popup> -->
        <!-- <van-popup v-model="showSelectPicker" position="bottom">
      <van-picker
        show-toolbar
        value-key="name"
        :columns="columns"
        @confirm="onSelectConfirm"
        @cancel="showSelectPicker = false"
      />
    </van-popup> -->
        <div class="visitor-btn">
          <van-button :loading="loading" round block type="primary" native-type="submit">确定开卡/绑定</van-button>
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
      timeShowPicker: false, // 是否显示时间选择器
      currentTimeDate: new Date(), // 时间选择器显示当前时间
      visitoropenid: getStore(CONFIG_STORAGE.openId), // 访问者openId
      visitorphoto: '', // 访问者头像
      form: {
        memberPhone: '', // 电话
        memberName: '', // 姓名
        code: '', //验证码
        visitendtime: '',
        openId:getStore(CONFIG_STORAGE.openId)
      },
      loading: false,
      isClick: true,
      time: '获取验证码',
      sms: '',
      openId: getStore(CONFIG_STORAGE.openId),
      showSelectPicker: false,
      columns: [
        { name: '这', value: 1 },
        { name: '是', value: 2 }
      ]
    }
  },
  components: {
    layout
  },
  created() {
    // API.checkMemeberOpenId({openId:getStore(CONFIG_STORAGE.openId)}).then(res=>{
    // })
  },
  mounted() {},
  methods: {
    //获取年龄
    getAge(date) {
      var age = ''

      var r = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear()
        age = Y - r[1]
        return age
      }
    },
    onSelectConfirm(v) {
      this.showSelectPicker = false
      this.form.category = v.value
      this.form.categoryName = v.name
    },
    // 获取验证码
    async gainCode() {
      if (this.isClick) {
        if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(this.form.memberPhone)) {
          const res = await API.sentCode(this.form.memberPhone) // 获取验证码接口
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
     * @description 来访时间和离开时间选择
     */
    selectTime(val) {
      // this.currentSelectTime = val
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
      if (!this.form.memberName || !this.form.memberPhone || !this.sms) {
        this.$toast('输入的信息不完整')
        return
      }
      this.form.code=this.sms
      // this.form.memberAge = this.getAge(this.form.visitendtime)
      this.loading=true
      API.wechatRegister(this.form).then(res => {
        this.loading=false
        if (res.code == '200') {
          this.$router.push({
            path: '/visitorDetail'
          })
          this.$toast.success('绑定成功')
        } else {
          this.$toast(res.msg)
          
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.van-cell {
  font-size: 16px !important;
  padding: 15px 16px;
}
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
.van-button--normal {
  font-size: 16px !important;
}
</style>
