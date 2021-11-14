import http from "../http";

class SalesOrderService {
  getAll() {
    return http.get("/sales-orders");
  }

  get(id) {
    return http.get(`/sales-orders/${id}`);
  }

  create(data) {
    return http.post("/sales-orders", data);
  }

  update(id, data) {
    return http.put(`/sales-orders/${id}`, data);
  }

  delete(id) {
    return http.delete(`/sales-orders/${id}`);
  }

  findByCustomerID(customerID) {
    return http.get(`/sales-orders?customer_id=${customerID}`);
  }

  findByCustomerName(customerName) {
    return http.get(`/sales-orders?customer_name=${customerName}`);
  }
}

export default new SalesOrderService();
