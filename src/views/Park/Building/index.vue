<template>
  <div class="app-container">
    <div class="search">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="楼宇名称：">
          <el-input
            size="mini"
            v-model="form.name"
            placeholder="请输入楼宇名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      type="primary"
      size="mini"
      style="margin: 15px 0"
      @click="showDialo = true"
      >添加楼宇</el-button
    >
    <el-table
      :data="tableData"
      style="width: 100%"
      header-cell-style=" background-color: #f4f6f8"
    >
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="楼宇名称"> </el-table-column>
      <el-table-column prop="floors" label="层数"> </el-table-column>
      <el-table-column prop="area" label="在管面积(㎡)"> </el-table-column>
      <el-table-column prop="propertyFeePrice" label="物业费(原/㎡)">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <span v-if="row.status == 0">空置中</span>
          <span v-else>租赁中</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" size="mini" @click="edit(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="showDeleteDialog(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="form.page"
      :page-sizes="[10, 15, 18, 20]"
      :page-size.sync="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加弹出框 -->
    <el-dialog
      :title="dialoForm.id ? '编辑楼宇' : '添加楼宇'"
      :visible.sync="showDialo"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        :model="dialoForm"
        :rules="rules"
        ref="ruleForm"
        label-position="top"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item label="楼宇名称" prop="name">
          <el-input v-model="dialoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input v-model="dialoForm.floors"></el-input>
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <el-input v-model="dialoForm.area">
            <template slot="append">㎡</template>
          </el-input>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <el-input v-model="dialoForm.propertyFeePrice">
            <template slot="append">元/㎡</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认框 -->
    <el-dialog :visible.sync="deleteDialog" width="30%">
      <span>是否确认删除当前楼宇?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="del">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBuildingListApi,
  addBuildingApi,
  deleteBuildingApi,
  editBuildingApi,
} from "@/api/building";
export default {
  components: {},
  data() {
    return {
      form: {
        name: "",
        page: 1,
        pageSize: 10,
      },
      dialoForm: {
        name: "",
        floors: "",
        area: "",
        propertyFeePrice: "",
      },
      rules: {
        name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }],
        floors: [
          { required: true, message: "请输入楼宇层数", trigger: "blur" },
        ],
        area: [{ required: true, message: "请输入在管面积", trigger: "blur" }],
        propertyFeePrice: [
          { required: true, message: "请输入物业费", trigger: "blur" },
        ],
      },
      showDialo: false,
      deleteDialog: false,
      total: 0,
      tableData: [],
      id: null,
    };
  },
  methods: {
    // 获取楼宇列表方法
    async getList() {
      const res = await getBuildingListApi({
        name: this.form.name,
        page: this.form.page,
        pageSize: this.form.pageSize,
      });
      // console.log("res=>", res);
      this.tableData = res.data.rows;
      this.total = res.data.total;
      // console.log("tableData=>", this.tableData);
    },
    handleSizeChange(val) {
      console.log("sizeChange=>", val);
      console.log("pageSize=>", this.form.pageSize);
      this.form.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log("currentChange=>", val);
      console.log("page=>", this.form.page);
      this.form.page = val;
      this.getList();
    },
    // 搜索楼宇
    search() {
      this.getList();
    },
    // 新增楼宇方法
    async submit() {
      if (this.dialoForm.id) {
        const res = await editBuildingApi({
          id: this.dialoForm.id,
          name: this.dialoForm.name,
          floors: this.dialoForm.floors,
          area: this.dialoForm.area,
          propertyFeePrice: this.dialoForm.propertyFeePrice,
        });
        console.log("res=>", res);
        this.showDialo = false;
        this.getList();
        this.dialoForm = {
          name: "",
          floors: "",
          area: "",
          propertyFeePrice: "",
        };
      } else {
        const res = await addBuildingApi(this.dialoForm);
        console.log("res=>", res);
        this.showDialo = false;
        this.getList();
        this.dialoForm = {
          name: "",
          floors: "",
          area: "",
          propertyFeePrice: "",
        };
      }
    },
    // 删除楼宇方法
    async deleteBuilding(id) {
      const res = await deleteBuildingApi(id);
      this.getList();
    },
    // 打开删除确认框
    showDeleteDialog(id) {
      this.id = id;
      this.deleteDialog = true;
    },
    // 删除楼宇
    del() {
      this.deleteBuilding(this.id);
      this.deleteDialog = false;
    },
    // 编辑楼宇方法
    edit(row) {
      this.dialoForm = JSON.parse(JSON.stringify(row));
      this.showDialo = true;
    },
    // 取消编辑
    handleClose() {
      this.showDialo = false;
      this.dialoForm = {
        name: "",
        floors: "",
        area: "",
        propertyFeePrice: "",
      };
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
// .app-container {
// height: calc(100vh - 60px);
// }
.search {
  height: 60px;
  border-bottom: 1px solid #f2f2f2;
}
.el-dialog__footer {
  background-color: #f4f6f8;
}
</style>
