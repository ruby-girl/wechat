<template>
  <layout>
    <div class="visitor">
      <van-form @submit="onSubmit">
        <van-field label="对方手机号"  maxlength="11" type="number" v-model="form.otherMemberPhone" center required placeholder="请输入手机号" :border="true" />
        <van-field label="转账金额" maxlength="10" @input="form.assetDetailQuantity=oninput(form.assetDetailQuantity,2)" type="number" v-model="form.assetDetailQuantity" center required placeholder="请输入转账金额" :border="true" />

        
          <van-button style="margin-top:25px" :loading="loading" round block type="primary" native-type="submit">确定转账</van-button>
      
      </van-form>
    </div>
  </layout>
</template>

<script>
import layout from '@/layouts/layout'
import API from '@/api'
import { CONFIG_STORAGE } from '@/utils/configs'
import { getStore,oninput } from '@/utils/util'
export default {
  data() {
    return {
      form: {
        otherMemberPhone: '',
        assetDetailQuantity:'',
        openId:getStore(CONFIG_STORAGE.openId)
      },
      loading:false
    }
  },
  components: {
    layout
  },
  created() {},
  methods: {
    oninput,
    onSubmit() {
        if(!this.form.otherMemberPhone||!this.form.assetDetailQuantity){
            this.$toast('输入的信息不完整')
            return
        }
        let num=parseFloat(this.form.assetDetailQuantity)
        if(num<0||num==0){
          this.$toast('转账金额须大于0')
            return
        }
        API.memberTransfer(this.form).then(res=>{
            this.loading=false
            if(res.code==200){
                this.$toast.success('转账成功')
                this.form.otherMemberPhone=''
                this.form.assetDetailQuantity=''
            }else{
                this.$toast(res.msg)
            }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-right {
  padding-right: 10px;
}
.visitorList {
  &-list {
    .name {
      color: rgba(16, 16, 16, 1);
    }
    .phone {
      font-size: 12px;
      color: rgba(163, 163, 163, 1);
    }
    .status {
      display: flex;
      align-items: center;
      position: absolute;
      padding: 0 10px;
      top: 24px;
      right: 30px;
      font-size: 12px;
      border-radius: 20px;
      &.default {
        color: #fff;
        background: rgba(0, 72, 255, 1);
      }
      &.success {
        color: #fff;
        background: #07c160;
      }
      &.danger {
        color: rgba(16, 16, 16, 1);
        background: rgba(220, 222, 224, 1);
      }
      &.warning {
        color: #fff;
        background: rgb(56, 64, 73);
      }
    }
  }
}
.visitor-btn {
  position: fixed;
  width: calc(100% - 20px);
  bottom: 12px;
  display: flex;
  button + button {
    margin-left: 20px;
  }
}
.van-cell{
  font-size: 16px !important;
  padding:15px 16px;
}
.van-button--normal{
font-size: 16px !important;
}
</style>
