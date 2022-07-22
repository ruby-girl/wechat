<template>
  <layout>
   
  </layout>
</template>

<script>
import layout from '@/layouts/layout'
import API from '@/api'
import { CONFIG_STORAGE } from '@/utils/configs'
import { getStore } from '@/utils/util'
export default {
  data() {
    return {
     
    }
  },
  components: {
    layout
  },
  created() {
    API.checkMemeberOpenId({ openId: getStore(CONFIG_STORAGE.openId) }).then(res => {
      if (res.code == '200') {
        this.$router.push({
          path: `/visitorDetail`
        })
      }else{
        this.$router.push({
          path: `/inviteVisitor`
        })
      }
    })
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
</style>
