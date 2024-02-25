import request from "@/utils/request";

// 获取区域列表
export function getPoleListApi(data) {
  return request({
    url: `/pole/info/list?page=${data.page}&poleName=${data.poleName}&poleNumber=${data.poleNumber}&poleStatus=${data.poleStatus}&page=${data.page}&pageSize=${data.pageSize}`,
    method: "GET",
  });
}

//删除一体杆
export function deletePoleApi(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: "DELETE",
  });
}

// 获取关联区域下拉列表
export function getRelationListApi() {
  return request({
    url: "/parking/area/dropList",
    method: "GET",
  });
}

//添加一体杆
export function addPoleApi(data) {
  return request({
    url: "/pole/info",
    method: "POST",
    data,
  });
}

// 编辑一体杆
export function editPoleApi(data) {
  return request({
    url: "/pole/info",
    method: "PUT",
    data,
  });
}
