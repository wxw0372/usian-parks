import request from "@/utils/request";

// 获取区域列表
export function getPropertyListApi(data) {
  return request({
    url: `/park/propertyfee?page=${data.page}&enterpriseName=${data.enterpriseName}&start=${data.start}&end=${data.end}&page=${data.page}&pageSize=${data.pageSize}`,
    method: "GET",
  });
}
// 获取所有企业
export function getAllEnterpriseApi() {
  return request({
    url: "/park/all/enterprise",
    method: "GET",
  });
}

// 获取所有楼宇
export function getAllBuildingApi() {
  return request({
    url: "/park/all/building",
    method: "GET",
  });
}

//获取物业费预算金额
export function getPropertyfeePriceApi(data) {
  return request({
    url: "/park/propertyfee/pre/payment",
    method: "POST",
    data,
  });
}

// 添加账单
export function addPropertyApi(data) {
  return request({
    url: "/park/propertyfee",
    method: "POST",
    data,
  });
}

// 查看账单详情
export function getEditPropertyApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: "GET",
  });
}

// 删除账单信息
export function deletePropertyApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: "DELETE",
  });
}
