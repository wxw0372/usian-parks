import request from "@/utils/request";

// 获取楼宇列表
export function getBuildingListApi(data) {
  return request({
    url: "/park/building",
    method: "GET",
    data,
  });
}

// 新增楼宇
export function addBuildingApi(data) {
  // 获取楼宇列表
  return request({
    url: "/park/building",
    method: "POST",
    data,
  });
}

// 删除楼宇
export function deleteBuildingApi(id) {
  return request({
    url: `/park/building/${id}`,
    method: "DELETE",
  });
}

// 编辑楼宇
export function editBuildingApi(data) {
  return request({
    url: "/park/building",
    method: "PUT",
    data,
  });
}
