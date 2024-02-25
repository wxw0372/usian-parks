import request from "@/utils/request";

// 查看计费规则列表
export function getRuleListApi(data) {
  return request({
    url: `/parking/rule/list?page=${data.page}&pageSize=${data.pageSize}&`,
    method: "GET",
  });
}
// 添加计费规则
export function addRuleApi(data) {
  return request({
    url: "/parking/rule",
    method: "POST",
    data,
  });
}

// 查看计费规则详情
export function getEditRuleApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: "GET",
  });
}

// 编辑计费规则
export function editRuleApi(data) {
  return request({
    url: "/parking/rule",
    method: "PUT",
    data,
  });
}

// 删除计费规则
export function delRuleApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: "DELETE",
  });
}
