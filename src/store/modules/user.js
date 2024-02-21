import { loginApi, getInfoApi } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    userInfo: {},
    userId: "",
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
    setToken(token);
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  getUserId: (state, userInfo) => {
    state.userId = userInfo.id;
    state.userInfo = userInfo;
  },
  // 删除token
  removeToken(state) {
    state.token = null;
    removeToken();
  },
};

const actions = {
  async login(context, form) {
    const { username, password } = form;
    const token = await loginApi({
      username: username,
      password: password,
    });
    context.commit("SET_TOKEN", token.data.token);
  },

  // get user info
  async getInfo(context) {
    const res = await getInfoApi();
    context.commit("getUserId", res.data[1]);
  },

  // user logout
  logout(context) {
    context.commit("removeToken");
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
