<template>
  <el-container class="app-container">
    <el-header class="header">
      <div class="header-left">
        <span @click="toIndex">←返回</span> |
        <span>添加企业</span>
      </div>
      <div class="header-right">黑马管理员</div>
    </el-header>
    <el-main class="main">
      <div class="box">
        <div class="box-title">企业信息</div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="企业名称" prop="name">
            <el-input size="mini" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="法人" prop="legalPerson">
            <el-input size="mini" v-model="ruleForm.legalPerson"></el-input>
          </el-form-item>
          <el-form-item label="注册地址" prop="registeredAddress">
            <el-input
              size="mini"
              v-model="ruleForm.registeredAddress"
            ></el-input>
          </el-form-item>
          <el-form-item label="所在行业" prop="industryCode">
            <el-select
              v-model="ruleForm.industryCode"
              placeholder="请选择所在行业"
            >
              <el-option
                v-for="item in industryList"
                :key="item.industryCode"
                :label="item.industryName"
                :value="item.industryCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业执照" prop="businessLicenseUrl">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="box">
        <div class="box-title">联系人信息</div>
      </div> -->
    </el-main>
    <el-footer class="footer">
      <el-button plain size="mini">重置</el-button>
      <el-button type="primary" size="mini">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { getIndustryApi } from "@/api/enterprise";
export default {
  components: {},
  data() {
    return {
      ruleForm: {
        name: "",
        legalPerson: "",
        registeredAddress: "",
        industryCode: "",
        businessLicenseUrl: "",
        businessLicenseId: "",
        contact: "",
        contactNumber: "",
      },
      rules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "请输入法人", trigger: "blur" },
        ],
        registeredAddress: [
          { required: true, message: "请输入注册地址", trigger: "blur" },
        ],
        industryCode: [
          { required: true, message: "请选择所在行业", trigger: "blur" },
        ],
        businessLicenseUrl: [
          { required: true, message: "请上传营业执照", trigger: "blur" },
        ],
      },
      industryList: [],
      fileList: [],
    };
  },
  methods: {
    // 返回
    toIndex() {
      this.$router.push("/park/tree");
    },
    // 获取所在行业列表
    async getIndustryList() {
      const res = await getIndustryApi();
      this.industryList = res.data;
    },
    // 上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
  mounted() {
    this.getIndustryList();
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  padding: 0;
  .header {
    height: 60px;
    line-height: 60px;
  }
  .main {
    background-color: #f4f6f8;
    .box {
      width: 85%;
      padding: 40px;
      margin: 0 auto 20px;
      background-color: #fff;
      position: relative;
      .box-title {
        position: absolute;
        top: 20px;
        left: 0;
        border-left: 2px solid #4770ff;
      }
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 40%;
          margin-left: 30px;
        }
      }
    }
  }
  .footer {
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
}
</style>
