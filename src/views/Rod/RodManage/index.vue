<template>
  <div class="app-container">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="一体杆名称">
          <el-input
            v-model="searchForm.poleName"
            size="small"
            placeholder="请输入一体杆名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="一体杆编号">
          <el-input
            v-model="searchForm.poleNumber"
            size="small"
            placeholder="请输入一体杆编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="运行状态">
          <el-select
            v-model="searchForm.poleStatus"
            placeholder="请选择运行状态"
          >
            <el-option label="正常" value="0"></el-option>
            <el-option label="异常" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="OnSearch"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加区域 -->
    <div class="addBtn">
      <el-button type="primary" size="small" @click="showDialog"
        >添加一体杆</el-button
      >
      <el-button size="small" @click="allDelete">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%" @select="getIds">
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="poleName" label="一体杆名称"> </el-table-column>
      <el-table-column prop="poleNumber" label="一体杆编号"> </el-table-column>
      <el-table-column prop="poleIp" label="一体杆IP"> </el-table-column>
      <el-table-column prop="areaName" label="安装区域"> </el-table-column>
      <el-table-column prop="poleType" label="一体杆类型">
        <template v-slot="{ row }">
          <span v-if="row.poleType == 'entrance'">入口</span>
          <span v-else-if="row.poleType == 'export'">出口</span>
        </template>
      </el-table-column>
      <el-table-column prop="poleStatus" label="运行状态">
        <template v-slot="{ row }">
          <span v-if="row.poleStatus == 1">异常</span>
          <span v-else>正常</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row)">编辑</el-button>
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

    <!-- 添加一体杆弹窗 -->
    <el-dialog
      :title="this.dialogForm.id ? '编辑一体杆' : '添加一体杆'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="dialogForm"
        :rules="rules"
        ref="dialogForm"
        class="demo-dialogForm"
      >
        <el-form-item label="一体杆名称" prop="poleName">
          <el-input v-model="dialogForm.poleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="一体杆编号" prop="poleNumber">
          <el-input v-model="dialogForm.poleNumber" size="small"></el-input>
        </el-form-item>
        <el-form-item label="一体杆IP" prop="poleIp">
          <el-input v-model="dialogForm.poleIp" size="small"></el-input>
        </el-form-item>
        <el-form-item label="关联区域" prop="areaId">
          <el-select
            v-model="dialogForm.areaId"
            size="small"
            placeholder="请选择关联区域"
          >
            <el-option
              v-for="item in dropList"
              :key="item.areaId"
              :label="item.areaName"
              :value="item.areaId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一体杆类型" prop="poleType">
          <el-select
            v-model="dialogForm.poleType"
            placeholder="请选择一体杆类型"
          >
            <el-option label="入口" value="entrance"></el-option>
            <el-option label="出口" value="export"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOnSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPoleListApi,
  deletePoleApi,
  getRelationListApi,
  addPoleApi,
  editPoleApi,
} from "@/api/RodManage";
export default {
  components: {},
  data() {
    return {
      searchForm: {
        page: 1,
        pageSize: 10,
        poleName: "",
        poleNumber: "",
        poleStatus: "",
      },
      tableData: [],
      total: 0,
      ids: [],
      dialogVisible: false,
      dialogForm: {
        poleName: "",
        poleNumber: "",
        poleIp: "",
        areaId: "",
        poleType: "",
      },
      //   关联区域数据
      dropList: [],
      rules: {
        poleName: [
          { required: true, message: "请输入一体杆名称", trigger: "blur" },
        ],
        poleNumber: [
          { required: true, message: "请输入一体杆编号", trigger: "blur" },
        ],
        poleIp: [
          { required: true, message: "请输入一体杆IP", trigger: "blur" },
        ],
        areaId: [
          { required: true, message: "请选择关联区域", trigger: "blur" },
        ],
        poleType: [
          { required: true, message: "请选择一体杆类型", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取一体杆列表
    async getPoleList() {
      const res = await getPoleListApi(this.searchForm);
      this.tableData = res.data.rows;
      this.total = res.data.total;
    },
    // 页面大小变化时触发的方法
    handleSizeChange(size) {
      this.searchForm.pageSize = size;
      this.getPoleList();
    },
    // 页码变化时吃法的方法
    handleCurrentChange(page) {
      this.searchForm.page = page;
      this.getPoleList();
    },
    // 查询方法
    OnSearch() {
      this.getPoleList();
    },
    // 删除一体杆
    async del(ids) {
      await deletePoleApi(ids);
      this.$message({
        type: "success",
        message: "删除成功",
      });
      this.getPoleList();
    },
    // 获取ids
    getIds(selection) {
      const idArr = [];
      selection.forEach((item) => {
        idArr.push(item.id);
      });
      this.ids = idArr.join();
    },
    // 批量删除
    async allDelete() {
      if (thiss.ids) {
        await deletePoleApi(this.ids);
        this.$message({
          type: "success",
          message: "删除成功",
        });
      }
    },
    // 获取关联区域下拉列表
    async getDropList() {
      const res = await getRelationListApi();
      this.dropList = res.data;
    },
    // 关闭添加弹窗方法
    handleClose() {
      this.dialogVisible = false;
      this.dialogForm = {
        poleName: "",
        poleNumber: "",
        poleIp: "",
        areaId: "",
        poleType: "",
      };
    },
    // 打开添加弹窗方法
    showDialog() {
      this.getDropList();
      this.dialogVisible = true;
    },
    // 添加方法
    async addOnSubmit() {
      this.searchForm.page = 1;
      this.searchForm.pageSize = 10;
      if (this.dialogForm.id) {
        await editPoleApi({
          id: this.dialogForm.id,
          poleName: this.dialogForm.poleName,
          poleNumber: this.dialogForm.poleNumber,
          poleIp: this.dialogForm.poleIp,
          areaId: this.dialogForm.areaId,
          poleType: this.dialogForm.poleType,
        });
        this.$message({
          message: "编辑成功",
          type: "success",
        });
      } else {
        const res = await addPoleApi(this.dialogForm);
        console.log("res=>", res);
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }
      this.handleClose();
      this.getPoleList();
    },
    // 编辑方法
    edit(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
  },
  created() {
    this.getPoleList();
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
.el-select {
  width: 100%;
}
</style>
