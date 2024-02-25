<template>
  <div class="app-container">
    <div class="search">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="企业名称：">
          <el-input
            size="mini"
            v-model="form.name"
            placeholder="请输入企业名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" size="mini" style="margin: 15px 0" @click="toAdd"
      >添加企业</el-button
    >
    <el-table
      :data="tableData"
      style="width: 100%"
      @expand-change="detail"
      header-cell-style=" background-color: #f4f6f8"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-table :data="row.rentList" style="width: 100%">
            <el-table-column prop="buildingName" label="租赁楼宇">
            </el-table-column>
            <el-table-column label="租赁起止时间">
              <template slot-scope="scope">
                <span>{{ scope.row.startTime }}至{{ scope.row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="合同状态">
              <template slot-scope="scope">
                <span v-if="(scope.row.status = 0)">待生效</span>
                <span v-else-if="(scope.row.status = 1)">生效中</span>
                <span v-else-if="(scope.row.status = 2)">已到期</span>
                <span v-else>已退租</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template v-slot="{ row }">
                <el-button type="text" size="mini" disabled="">续租</el-button>
                <el-button type="text" size="mini" disabled="">退租</el-button>
                <el-button type="text" size="mini" @click="Delete(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index"> </el-table-column>
      <el-table-column label="企业名称" prop="name"> </el-table-column>
      <el-table-column label="联系人" prop="contact"> </el-table-column>
      <el-table-column label="联系电话" prop="contactNumber"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" size="mini" @click="add(row.id)"
            >添加合同</el-button
          >
          <el-button type="text" size="mini">查看</el-button>
          <el-button type="text" size="mini">编辑</el-button>
          <el-button type="text" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFirmListApi, getRentApi } from "@/api/enterprise";
export default {
  components: {},
  data() {
    return {
      form: {
        name: "",
        page: 1,
        pageSize: 10,
      },
      tableData: [],
    };
  },
  methods: {
    // 获取企业列表
    async getFirmList() {
      const res = await getFirmListApi({
        name: this.form.name,
        page: this.form.page,
        pageSize: this.form.pageSize,
      });
      this.tableData = res.data.rows.map((item) => {
        return {
          ...item,
          rentList: [],
        };
      });
    },
    // 跳转添加企业页面
    toAdd() {
      this.$router.push("/add");
    },
    // 获取展开行内数据
    async detail(expandedRows, expanded) {
      let a = expanded.find((item) => item.id == expandedRows.id);
      if (a) {
        const res = await getRentApi(expandedRows.id);
        expandedRows.rentList = res.data;
      }
    },
    // 删除
    Delete() {},

    // 添加合同
    add() {},
  },
  created() {
    this.getFirmList();
  },
};
</script>

<style lang="scss" scoped>
.search {
  height: 60px;
  border-bottom: 1px solid #f2f2f2;
}
</style>
