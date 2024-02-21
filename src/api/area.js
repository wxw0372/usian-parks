import request from "@/utils/request";

// 获取区域列表
export function getAreaListApi(data) {
  return request({
    url: `/parking/area/list/?page=${data.page}&pageSize=${data.pageSize}`,
    method: "GET",
  });
}

// 添加区域
export function addAreaApi(data) {
  return request({
    url: "/parking/area",
    method: "POST",
    data,
  });
}
// 获取关联区域下拉列表
export function getDropListApi() {
  return request({
    url: "/parking/rule/list",
    method: "GET",
  });
}
// 删除区域
export function delAreaApi(id) {
  return request({
    url: `/parking/area/${id}`,
    method: "DELETE",
  });
}

// 编辑区域
export function editAreaApi(data) {
  return request({
    url: "/parking/area",
    method: "PUT",
    data,
  });
}
