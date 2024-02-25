<template>
  <div class="app-container">
    <div class="addRule">
      <el-button type="primary" size="small" @click="dialogVisible = true"
        >增加停车计费规则</el-button
      >
    </div>
    <!-- 表格区域 -->
    <el-table :data="RuleList" style="width: 100%">
      <!-- header-cell-style=" background-color: #f4f6f8" -->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="ruleNumber" label="计费规则编号">
      </el-table-column>
      <el-table-column prop="ruleName" label="计费规则名称"> </el-table-column>
      <el-table-column prop="freeDuration" label="免费时长"> </el-table-column>
      <el-table-column prop="chargeCeiling" label="收费上限(元)">
      </el-table-column>
      <el-table-column prop="chargeType" label="计费方式">
        <template v-slot="{ row }">
          <span v-if="row.chargeType == 'duration'">时长收费</span>
          <span v-else-if="row.chargeType == 'turn'">按次收费</span>
          <span v-else>分段收费</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleNameView" label="计费规则"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row.id)">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes"
      :total="total"
    >
    </el-pagination>

    <!-- 添加计费规则弹窗 -->
    <el-dialog
      title="添加计费规则"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input
            v-model="ruleForm.ruleNumber"
            placeholder="请输入计费规则编号"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input
            v-model="ruleForm.ruleName"
            size="small"
            placeholder="请输入计费规则名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="计费方式(全天收费)" prop="chargeType" size="small">
          <el-radio-group v-model="ruleForm.chargeType">
            <el-radio label="duration" value="duration">时长收费</el-radio>
            <el-radio label="turn" value="turn">按次收费</el-radio>
            <el-radio label="partition" value="partition">分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="free">
          <div class="free-item">
            <el-form-item label="免费时长">
              <el-input
                v-show="showInput == false"
                v-model="ruleForm.freeDuration"
                placeholder="请输入免费时长"
                @focus="showInput = true"
                size="small"
              ></el-input>
              <el-input-number
                v-model="ruleForm.freeDuration"
                placeholder="请输入免费时长"
                @blur="showInput = false"
                v-show="showInput"
                controls-position="right"
                size="small"
              ></el-input-number>
            </el-form-item>
            <span>分钟</span>
          </div>
          <div class="free-item">
            <el-form-item label="收费上限">
              <el-input
                v-model="ruleForm.chargeCeiling"
                placeholder="请输入收费上限"
                size="small"
              ></el-input>
            </el-form-item>
            <span>元</span>
          </div>
        </div>
        <!-- 计费规则--时长收费 -->
        <div class="free" v-show="ruleForm.chargeType == 'duration'">
          <div class="free-item">
            <span class="free-item-rule_text">每</span>
            <el-form-item label="计费规则" prop="durationTime">
              <el-input
                v-model="ruleForm.durationTime"
                placeholder="请输入"
                size="small"
              ></el-input>
            </el-form-item>
          </div>
          <div class="free-item">
            <el-form-item prop="durationType">
              <el-select
                v-model="ruleForm.durationType"
                placeholder="请选择"
                class="select"
                size="small"
              >
                <el-option label="分钟" value="minute"> </el-option>
                <el-option label="小时" value="hour"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="free-item">
            <el-form-item prop="durationPrice">
              <el-input
                class="el-input_bottom"
                v-model="ruleForm.durationPrice"
                placeholder="请输入"
                size="small"
              ></el-input>
            </el-form-item>
            <span>元</span>
          </div>
        </div>
        <!-- 计费规则--按次收费 -->
        <div class="free" v-show="ruleForm.chargeType == 'turn'">
          <div class="free-item">
            <span>每次</span>
            <el-form-item label="计费规则" prop="turnPrice">
              <el-input
                v-model="ruleForm.turnPrice"
                placeholder="请输入金额"
                size="small"
              ></el-input>
            </el-form-item>
            <span>元</span>
          </div>
        </div>
        <!-- 计费规则 -- 分段收费 -->
        <div class="free" v-show="ruleForm.chargeType == 'partition'">
          <div class="freer-item">
            <div class="free-item">
              <el-form-item label="计费规则" prop="partitionFrameTime">
                <el-input
                  v-model="ruleForm.partitionFrameTime"
                  placeholder="请输入"
                  size="small"
                ></el-input>
              </el-form-item>
              <div class="el-form_text">小时内，每小时收费</div>
              <el-form-item prop="partitionFramePrice">
                <el-input
                  class="el-input_bottom"
                  size="small"
                  v-model="ruleForm.partitionFramePrice"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <span>元</span>
            </div>
            <div class="free-item">
              <div class="el-form_text1">每增加</div>
              <el-form-item prop="partitionIncreaseTime">
                <el-input
                  class="el-input_bottom"
                  v-model="ruleForm.partitionIncreaseTime"
                  placeholder="请输入"
                  size="small"
                ></el-input>
              </el-form-item>
              <div class="el-form_text2">小时，增加</div>
              <el-form-item prop="partitionIncreasePrice">
                <el-input
                  size="small"
                  class="el-input_bottom"
                  v-model="ruleForm.partitionIncreasePrice"
                  placeholder="请输入金额"
                ></el-input>
              </el-form-item>
              <span>元</span>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" @click="addRule" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRuleListApi,
  addRuleApi,
  getEditRuleApi,
  editRuleApi,
  delRuleApi,
} from "@/api/carRule";
export default {
  components: {},
  data() {
    return {
      page: 1,
      pageSize: 10,
      RuleList: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        ruleNumber: "",
        ruleName: "",
        freeDuration: "",
        chargeCeiling: "",
        chargeType: "duration",
        durationTime: "",
        durationPrice: "",
        durationType: "",
        turnPrice: "",
        partitionFrameTime: "",
        partitionFramePrice: "",
        partitionIncreaseTime: "",
        partitionIncreasePrice: "",
      },
      rules: {
        ruleNumber: [
          { required: true, message: "请输入计费规则编号", trigger: "blur" },
        ],
        ruleName: [
          { required: true, message: "请输入计费规则名称", trigger: "blur" },
        ],
        chargeType: [
          { required: true, message: "请选择计费方式", trigger: "blur" },
        ],
        partitionFrameTime: [
          { required: true, message: "请输入计费时段", trigger: "blur" },
        ],
        durationType: [
          { required: true, message: "请选择时长收费类型", trigger: "blur" },
        ],
        partitionFramePrice: [
          { required: true, message: "请输入段内费用", trigger: "blur" },
        ],
        chargeCeiling: [
          { required: true, message: "请输入收费上限", trigger: "blur" },
        ],
        turnPrice: [{ required: true, message: "请输入金额", trigger: "blur" }],
        partitionFramePrice: [
          { required: true, message: "请输入金额", trigger: "blur" },
        ],
        partitionIncreaseTime: [
          { required: true, message: "请输入时间", trigger: "blur" },
        ],
        partitionIncreasePrice: [
          { required: true, message: "请输入金额", trigger: "blur" },
        ],
        durationTime: [
          { required: true, message: "请输入时间", trigger: "blur" },
        ],
        durationPrice: [
          { required: true, message: "请输入金额", trigger: "blur" },
        ],
        durationType: [
          { required: true, message: "请选择时长类型", trigger: "blur" },
        ],
      },
      showInput: false,
    };
  },
  methods: {
    // 获取计费规则列表
    async getRuleList() {
      const res = await getRuleListApi({
        page: this.page,
        pageSize: this.pageSize,
      });
      this.RuleList = res.data.rows;
      this.total = res.data.total;
    },
    // 每页数量变化时触发的方法
    handleSizeChange(size) {
      this.pageSize = size;
      this.getRuleList();
    },
    // 页码变化时触发的方法
    handleCurrentChange(page) {
      this.page = page;
      this.getRuleList();
    },
    // 关闭添加计费规则弹窗的方法
    handleClose() {
      this.dialogVisible = false;
      this.ruleForm = {
        ruleNumber: "",
        ruleName: "",
        freeDuration: "",
        chargeCeiling: "",
        chargeType: "duration",
        durationTime: "",
        durationPrice: "",
        durationType: "",
        turnPrice: "",
        partitionFrameTime: "",
        partitionFramePrice: "",
        partitionIncreaseTime: "",
        partitionIncreasePrice: "",
      };
    },
    // 添加计费规则的方法
    async addRule() {
      if (this.ruleForm.id) {
        // 提交编辑计费规则
        const res = await editRuleApi(this.ruleForm);
        this.$message({
          message: "编辑成功",
          type: "success",
        });
      } else {
        // 提交添加计费规则
        // 时长收费
        if (this.ruleForm.chargeType == "duration") {
          const res = await addRuleApi({
            ruleNumber: this.ruleForm.ruleNumber,
            ruleName: this.ruleForm.ruleName,
            freeDuration: this.ruleForm.freeDuration,
            chargeCeiling: this.ruleForm.chargeCeiling,
            chargeType: this.ruleForm.chargeType,
            durationTime: this.ruleForm.durationTime,
            durationPrice: this.ruleForm.durationPrice,
            durationType: this.ruleForm.durationType,
            turnPrice: this.ruleForm.turnPrice,
            partitionFrameTime: this.ruleForm.partitionFrameTime,
            partitionFramePrice: this.ruleForm.partitionFramePrice,
            partitionIncreaseTime: this.ruleForm.partitionIncreaseTime,
            partitionIncreasePrice: this.ruleForm.partitionIncreasePrice,
          });
        } else if (this.ruleForm.chargeType == "turn") {
          const res = await addRuleApi({
            ruleNumber: this.ruleForm.ruleNumber,
            ruleName: this.ruleForm.ruleName,
            freeDuration: this.ruleForm.freeDuration,
            chargeCeiling: this.ruleForm.chargeCeiling,
            chargeType: this.ruleForm.chargeType,
            durationTime: this.ruleForm.durationTime,
            durationPrice: this.ruleForm.durationPrice,
            durationType: this.ruleForm.durationType,
            turnPrice: this.ruleForm.turnPrice,
            partitionFrameTime: this.ruleForm.partitionFrameTime,
            partitionFramePrice: this.ruleForm.partitionFramePrice,
            partitionIncreaseTime: this.ruleForm.partitionIncreaseTime,
            partitionIncreasePrice: this.ruleForm.partitionIncreasePrice,
          });
        } else if (this.ruleForm.chargeType == "partition") {
          const res = await addRuleApi({
            ruleNumber: this.ruleForm.ruleNumber,
            ruleName: this.ruleForm.ruleName,
            freeDuration: this.ruleForm.freeDuration,
            chargeCeiling: this.ruleForm.chargeCeiling,
            chargeType: this.ruleForm.chargeType,
            durationTime: this.ruleForm.durationTime,
            durationPrice: this.ruleForm.durationPrice,
            durationType: this.ruleForm.durationType,
            turnPrice: this.ruleForm.turnPrice,
            partitionFrameTime: this.ruleForm.partitionFrameTime,
            partitionFramePrice: this.ruleForm.partitionFramePrice,
            partitionIncreaseTime: this.ruleForm.partitionIncreaseTime,
            partitionIncreasePrice: this.ruleForm.partitionIncreasePrice,
          });
        }
        if (res.code == 10000) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
        }
      }
      this.handleClose();
      this.getRuleList();
    },
    // getEditRuleApi
    // 打开编辑框，回显计费规则
    async edit(id) {
      const res = await getEditRuleApi(id);
      this.ruleForm = res.data;
      this.dialogVisible = true;
    },
    // 删除计费规则方法
    async del(id) {
      const res = await delRuleApi(id);
      if (res.code == 10000) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
      }
      this.getRuleList();
    },
  },
  created() {
    this.getRuleList();
  },
};
</script>

<style lang="scss" scoped>
.addRule {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}

.free-item-rule_text {
  height: 50px;
  padding: 0;
}
.free {
  display: flex;
  .free-item {
    display: flex;
    margin: 0 3px;
    span {
      padding-top: 50px;
      width: 50px;
      text-align: center;
    }
  }
}
.el-input-number {
  text-align-last: left;
}
.el-select {
  margin-top: 40px;
}
.el-input_bottom {
  margin-top: 40px;
}
.el-form_text {
  width: 205px;
  height: 50px;
  padding-top: 50px;
  text-align: center;
}
.el-form_text1 {
  width: 140px;
  height: 50px;
  padding-top: 50px;
  text-align: left;
}
.el-form_text2 {
  width: 150px;
  height: 50px;
  padding-top: 50px;
  text-align: center;
}
.el-radio {
  border: 1px solid blue;
  border-radius: 3px;
  padding: 10px;
}
</style>
