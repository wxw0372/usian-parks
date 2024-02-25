<template>
  <div class="app-container">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="企业名称">
          <el-input
            v-model="searchForm.carNumber"
            size="small"
            placeholder="请输入车牌号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="缴纳时间">
          <el-date-picker
            v-model="time"
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="getTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="addBtn">
      <el-button type="primary" size="small" @click="showDialog"
        >添加账单</el-button
      >
    </div>
    <!-- 表格区域 -->

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="billNumber" label="账单编号"> </el-table-column>
      <el-table-column prop="enterpriseName" label="企业名称">
      </el-table-column>
      <el-table-column prop="buildingName" label="租赁楼宇"> </el-table-column>
      <el-table-column prop="propertyFeePrice" label="物业费(元/㎡)">
      </el-table-column>
      <el-table-column prop="paymentAmount" label="账单金额(元)">
      </el-table-column>
      <el-table-column prop="createTime" label="缴费时间"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row.id)">查看</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="searchForm.pageSize"
      layout="total,  prev, pager, next, sizes, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加账单弹窗 -->
    <el-dialog
      :title="addForm.id ? '查看账单' : '添加账单'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        v-if="!addForm.id"
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-addForm"
      >
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select
            v-model="addForm.enterpriseId"
            placeholder="请选择用户"
            size="small"
          >
            <el-option
              v-for="item in allEnterprise"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select
            v-model="addForm.buildingId"
            placeholder="请选择租赁楼宇"
            size="small"
          >
            <el-option
              v-for="item in allBuilding"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费周期" prop="endTime">
          <el-date-picker
            v-model="addTime"
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="getAddTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input
            v-model="addForm.paymentAmount"
            placeholder="请输入支付金额"
            size="small"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select
            v-model="addForm.paymentMethod"
            placeholder="请选择支付方式"
            size="small"
          >
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="现金" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 查看 -->
      <el-form
        v-else
        :inline="true"
        :model="addForm"
        label-position="right"
        label-width="180px"
        class="demo-form-inline look-form-inline"
      >
        <el-form-item label="租户名称">
          <span class="form-item_text">{{ addForm.enterpriseName }}</span>
        </el-form-item>
        <el-form-item label="租赁楼宇">
          <span class="form-item_text">{{ addForm.buildingName }}</span>
        </el-form-item>
        <el-form-item label="缴费周期">
          <span class="form-item_text"
            >{{ addForm.startTime }}至{{ addForm.endTime }}</span
          >
        </el-form-item>
        <el-form-item label="物业费(元/㎡)">
          <span class="form-item_text">{{ addForm.propertyFeePrice }}</span>
        </el-form-item>
        <el-form-item label="账单金额(元)">
          <span class="form-item_text">{{ addForm.paymentAmount }}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span class="form-item_text">{{ addForm.paymentMethodValue }}</span>
        </el-form-item>
        <el-form-item label="缴费时间">
          <span class="form-item_text">{{ addForm.createTime }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPropertyListApi,
  getAllEnterpriseApi,
  getAllBuildingApi,
  getPropertyfeePriceApi,
  addPropertyApi,
  getEditPropertyApi,
  deletePropertyApi,
} from "@/api/property";
export default {
  components: {},
  data() {
    return {
      searchForm: {
        page: 1,
        pageSize: 10,
        enterpriseName: "",
        start: "",
        end: "",
      },
      // 时间
      time: [],
      // 添加弹窗缴费周期
      addTime: [],
      tableData: [],
      total: 0,
      dialogVisible: false,
      // 添加账单数据
      addForm: {
        enterpriseId: "",
        buildingId: "",
        startTime: "",
        endTime: "",
        paymentAmount: "",
        paymentMethod: "",
      },
      rules: {
        enterpriseId: [
          { required: true, message: "请输入租户", trigger: "blur" },
        ],
        buildingId: [
          { required: true, message: "请输入楼宇", trigger: "blur" },
        ],
        paymentAmount: [
          { required: true, message: "请输入支付金额", trigger: "blur" },
        ],
        paymentMethod: [
          { required: true, message: "请输入支付方式", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择缴费周期", trigger: "blur" },
        ],
      },
      // 所有企业数据
      allEnterprise: [],
      // 所有楼宇数据
      allBuilding: [],
    };
  },
  methods: {
    // 获取物业费列表
    async getPropertyfeeList() {
      const res = await getPropertyListApi(this.searchForm);
      this.tableData = res.data.rows;
      this.total = res.data.total;
    },
    // 获取搜索的缴费时间
    getTime() {
      this.searchForm.start = this.time[0];
      this.searchForm.end = this.time[1];
    },
    // 删除
    async del(id) {
      const res = await deletePropertyApi(id);
      this.$message({
        type: "success",
        message: "删除成功",
      });
      this.getPropertyfeeList();
    },
    // 页面大小变化时触发的方法
    handleSizeChange(size) {
      this.searchForm.pageSize = size;
      this.getPropertyfeeList();
    },
    // 页码变化时吃法的方法
    handleCurrentChange(page) {
      this.searchForm.page = page;
      this.getPropertyfeeList();
    },
    // 查询方法
    onSubmit() {
      this.getPropertyfeeList();
    },
    // 获取添加账单开始结束时间
    getAddTime() {
      this.addForm.startTime = this.addTime[0];
      this.addForm.endTime = this.addTime[1];
      this.getPropertyfeePrice();
    },
    // 添加账单弹窗关闭前的方法
    handleClose() {
      this.dialogVisible = false;
      this.addForm = {
        enterpriseId: "",
        buildingId: "",
        startTime: "",
        endTime: "",
        paymentAmount: "",
        paymentMethod: "",
      };
    },
    // 打开添加账单弹窗方法
    showDialog() {
      this.getAllEnterprise();
      this.getAllBuilding();
      this.dialogVisible = true;
    },
    // 获取所有企业方法
    async getAllEnterprise() {
      const res = await getAllEnterpriseApi();
      this.allEnterprise = res.data;
    },
    // 获取所有楼宇方法
    async getAllBuilding() {
      const res = await getAllBuildingApi();
      this.allBuilding = res.data;
    },
    // 获取支付费用方法
    async getPropertyfeePrice() {
      if (
        this.addForm.buildingId != "" &&
        this.addForm.startTime != "" &&
        this.addForm.endTime != ""
      ) {
        const res = await getPropertyfeePriceApi({
          buildingId: this.addForm.buildingId,
          startTime: this.addForm.startTime,
          endTime: this.addForm.endTime,
        });
        this.addForm.paymentAmount = res.data;
      }
    },
    // 添加账单方法
    addSubmit() {
      if (this.addForm.id) {
        this.handleClose();
      } else {
        this.$refs.addForm.validate(async (valid) => {
          if (valid) {
            alert("submit!");
          } else {
            const res = await addPropertyApi(this.addForm);
            this.handleClose();
            this.$message({
              type: "success",
              message: "添加成功",
            });
            this.getPropertyfeeList();
          }
        });
      }
    },
    // 查看账单详情方法
    async edit(id) {
      const res = await getEditPropertyApi(id);
      this.addForm = res.data;
      this.dialogVisible = true;
    },
  },
  created() {
    this.getPropertyfeeList();
  },
};
</script>

<style lang="scss" scoped>
.search {
  border-bottom: 1px solid #f3f4f5;
}
.addBtn {
  padding: 20px 0;
}
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
.el-input__inner {
  width: 315px;
}
.form-item_text {
  display: block;
  width: 200px;
}
</style>
