import request from "@/utils/request";

// 获取区域列表
export function getPaymentListApi(data) {
  return request({
    url: `/parking/payment/list?page=${data.page}&pageSize=${data.pageSize}&carNumber=${data.carNumber}&paymentStatus=${data.paymentStatus}`,
    method: "GET",
  });
}
