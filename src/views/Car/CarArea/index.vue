<template>
  <div class="app-container">
    <div class="addBtn">
      <el-button type="primary" size="small" @click="showDialo = true"
        >添加区域</el-button
      >
    </div>
    <el-table :data="areaList" style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="areaName" label="区域名称"> </el-table-column>
      <el-table-column prop="spaceNumber" label="车位数(个)"> </el-table-column>
      <el-table-column prop="areaProportion" label="面积(㎡)">
      </el-table-column>
      <el-table-column prop="ruleName" label="计费规则">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.hoverRuleName"
            placement="top"
          >
            <span style="border: 0; background-color: #ffffff00">{{
              row.ruleName
            }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row)">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next,  sizes,jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加弹出框 -->
    <el-dialog
      :title="dialoForm.id ? '编辑区域' : '添加区域'"
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
        <el-form-item label="区域名称" prop="areaName">
          <el-input
            v-model="dialoForm.areaName"
            placeholder="请输入区域名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="车位数(个)" prop="spaceNumber">
          <el-input
            v-model="dialoForm.spaceNumber"
            placeholder="请输入车位个数"
          ></el-input>
        </el-form-item>
        <el-form-item label="面积(㎡)" prop="areaProportion">
          <el-input
            v-model="dialoForm.areaProportion"
            placeholder="请输入面积"
          />
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <template>
            <el-select v-model="dialoForm.ruleId" placeholder="请选择">
              <el-option
                v-for="item in dropList"
                :key="item.value"
                :label="item.ruleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="dialoForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAreaListApi,
  addAreaApi,
  getDropListApi,
  delAreaApi,
  editAreaApi,
} from "@/api/area";
export default {
  components: {},
  data() {
    return {
      areaList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      showDialo: false,
      dialoForm: {
        areaName: "",
        spaceNumber: "",
        areaProportion: "",
        ruleId: "",
        remark: "",
      },
      rules: {
        areaName: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
        ],
        spaceNumber: [
          { required: true, message: "请输入车位数", trigger: "blur" },
        ],
        areaProportion: [
          { required: true, message: "请输入面积", trigger: "blur" },
        ],
        ruleId: [
          { required: true, message: "请选择关联计费规则", trigger: "blur" },
        ],
      },
      dropList: [],
    };
  },
  methods: {
    // 获取区域列表
    async getAreaList() {
      const res = await getAreaListApi({
        page: this.page,
        pageSize: this.pageSize,
      });
      this.areaList = res.data.rows;
      this.total = res.data.total;
    },
    // 数量变化时触发
    handleSizeChange(size) {
      this.pageSize = size;
      this.getAreaList();
    },
    // 页码变化时触发
    handleCurrentChange(page) {
      this.page = page;
      this.getAreaList();
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
    // 获取关联区域下拉列表
    async getDropList() {
      const res = await getDropListApi();
      console.log(res);
      this.dropList = res.data.rows;
    },
    // 添加区域方法
    async submitAdd() {
      if (this.dialoForm.id) {
        const res = await editAreaApi({
          id: this.dialoForm.id,
          areaName: this.dialoForm.areaName,
          spaceNumber: this.dialoForm.spaceNumber,
          areaProportion: this.dialoForm.areaProportion,
          ruleId: this.dialoForm.ruleId,
          remark: this.dialoForm.remark,
        });
        //   console.log('123123',res);
      } else {
        const res = await addAreaApi(this.dialoForm);
        console.log("res==>", res);
        this.dialoForm = {
          areaName: "",
          spaceNumber: "",
          areaProportion: "",
          ruleId: "",
          remark: "",
        };
      }
      this.showDialo = false;
      this.getAreaList();
    },
    // 删除区域方法
    async del(id) {
      const res = await delAreaApi(id);
      this.getAreaList();
    },
    // 回显
    edit(row) {
      this.showDialo = true;
      this.dialoForm = JSON.parse(JSON.stringify(row));
    },
  },
  created() {
    this.getAreaList();
    this.getDropList();
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 70%;
  margin: 15px auto;
}
</style>
