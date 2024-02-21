import request from "@/utils/request";

// 获取企业列表
export function getFirmListApi(data) {
  return request({
    url: "/park/enterprise",
    method: "GET",
    data,
  });
}

// 获取企业租赁信息列表-展开查看
export function getRentApi(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: "GET",
  });
}

// 获取企业所属行业列表
export function getIndustryApi() {
  return request({
    url: "/park/industry",
    method: "GET",
  });
}
