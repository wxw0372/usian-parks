import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

// router.beforeEach((to, from, next) => {
//   const hasToken = getToken();
//   if (hasToken) {
//     if (to.path == "/login") {
//       next("/");
//     } else {
//       next();
//     }
//   } else {
//     if (to.path == "/login") {
//       next();
//     } else {
//       next("/login");
//     }
//   }
// });

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    // 有token情况
    if (to.path === "/login") {
      next("/");
    } else {
      if (!store.getters.id) {
        store.dispatch("user/getInfo");
      }
      next();
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
