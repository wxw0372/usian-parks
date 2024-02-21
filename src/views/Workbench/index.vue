<template>
  <div class="app-container">
    <div class="left">
      <div class="left-item park">园区数据</div>
      <div class="left-item income">年度收入统计</div>
      <div class="left-item Coming">临期合同提醒</div>
    </div>
    <div class="right">
      <div class="right-item entrance">快捷入口</div>
      <div class="right-item equipment">设备告警派单</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.app-main {
  background-color: #f4f6f8;
}
.app-container {
  background-color: #f4f6f8;
  display: flex;
  justify-content: space-between;
  .left {
    width: 65%;
    .left-item {
      padding: 10px;
      background-color: #fff;
      margin-bottom: 20px;
    }
    .park {
      height: 150px;
    }
    .income {
      height: 350px;
    }
    .Coming {
      height: 500px;
    }
  }
  .right {
    width: 30%;
    .right-item {
      padding: 10px;
      background-color: #fff;
      margin-bottom: 20px;
    }
    .entrance {
      height: 150px;
    }
    .equipment {
      height: 250px;
    }
  }
}
</style>
