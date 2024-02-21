<template>
  <div class="login">
    <div class="img">
      <img class="bgimg" src="../../../public/bg.jpeg" alt="" />
    </div>
    <div class="login-container">
      <h3>智慧园区-登录</h3>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="login-form"
        auto-complete="on"
      >
        <el-form-item label="账号" prop="username">
          <el-input size="mini" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input size="mini" v-model="form.password"></el-input>
        </el-form-item>
        <el-checkbox label="记住我" name="type" />
        <el-button
          class="btn"
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "demo",
        password: "zh@hm#23",
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate((vaild) => {
        if (vaild) {
          this.$store.dispatch("user/login", this.form);
          // this.$store.dispatch("user/getInfo");
          this.$router.push("/");
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login {
  display: flex;
  .img {
    width: 60%;
    height: 100vh;
    .bgimg {
      width: 100%;
      height: 100%;
      border-radius: 0 50px 50px 0;
    }
  }
}

/* reset element-ui css */
.login-container {
  width: 400px;
  height: 300px;
  margin: auto;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: #fff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      caret-color: $cursor;
      border: 1px solid #ccc;
    }
  }
  .btn {
    margin-top: 20px;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  h3 {
    margin-left: 35px;
    margin-bottom: 30px;
  }
}
</style>
