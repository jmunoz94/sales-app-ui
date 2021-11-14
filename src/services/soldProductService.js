import http from "../http";

class SoldProductService {
  get(id) {
    return http.get(`/sold-products/${id}`);
  }

  create(data) {
    return http.post("/sold-products", data);
  }

  update(id, data) {
    return http.put(`/sold-products/${id}`, data);
  }

  delete(id) {
    return http.delete(`/sold-products/${id}`);
  }

  findBySalesOrder(salesOrderID) {
    return http.get(`/sales-orders/${salesOrderID}/sold-products`);
  }
}

export default new SoldProductService();
