<template>
  <div class="app-container">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="车牌号码">
          <el-input
            v-model="searchForm.carNumber"
            size="small"
            placeholder="请输入车牌号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴纳状态">
          <el-select
            v-model="searchForm.paymentStatus"
            size="small"
            placeholder="未选择"
          >
            <el-option label="未缴纳" value="0"></el-option>
            <el-option label="已缴纳" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <el-table
      :data="paymentList"
      style="width: 100%"
      header-cell-style=" background-color: #f4f6f8"
    >
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="carNumber" label="车牌号码"> </el-table-column>
      <el-table-column label="收费类型">
        <template v-slot="{ row }">
          <span v-if="row.chargeType == 'temp'">临时停车</span>
          <span v-else>月卡</span>
        </template>
      </el-table-column>
      <el-table-column prop="parkingTime" label="停车总时长"> </el-table-column>
      <el-table-column prop="actualCharge" label="缴纳费用(元)">
      </el-table-column>
      <el-table-column prop="paymentStatus" label="缴纳状态">
        <template v-slot="{ row }">
          <span v-if="row.paymentStatus == '1'">已缴纳</span>
          <span v-else>未缴纳</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="缴纳方式">
        <template v-slot="{ row }">
          <span v-if="row.paymentMethod == 'Alipay'">支付宝</span>
          <span v-else-if="row.paymentMethod == 'WeChat'">微信</span>
          <span v-else>线下</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTime" label="缴纳时间"> </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchForm.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getPaymentListApi } from "@/api/payment";
export default {
  components: {},
  data() {
    return {
      searchForm: {
        page: 1,
        pageSize: 10,
        carNumber: "",
        paymentStatus: "",
      },
      paymentList: [],
      total: 0,
    };
  },
  methods: {
    async getPaymentList() {
      const res = await getPaymentListApi(this.searchForm);
      console.log("res=>", res);
      this.paymentList = res.data.rows;
      this.total = res.data.total;
    },
    onSubmit() {
      this.getPaymentList();
    },
    // 每页数量变化时触发的方法
    handleSizeChange(size) {
      this.searchForm.pageSize = size;
      tis.getPaymentList();
    },
    // 页码变化时触发的方法
    handleCurrentChange(page) {
      this.searchForm.page = page;
      this.getPaymentList();
    },
  },
  created() {
    this.getPaymentList();
  },
};
</script>

<style lang="scss" scoped>
.search {
  border-bottom: 1px solid #f3f4f5;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
</style>
