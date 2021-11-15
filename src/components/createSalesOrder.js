import React from "react";
import { Navigate } from "react-router-dom";
import productService from "../services/productService";
import SalesOrderService from "../services/salesOrderService";
import soldProductService from "../services/soldProductService";

export default class CreateSalesOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeCustomerName = this.onChangeCustomerName.bind(this);
    this.onChangeCustomerID = this.onChangeCustomerID.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeProductID = this.onChangeProductID.bind(this);
    this.saveSalesOrder = this.saveSalesOrder.bind(this);
    this.addNewProduct = this.addNewProduct.bind(this);

    this.state = {
      id: null,
      customer_name: "",
      customer_id: 0,
      soldProducts: [],
      status: "1",
      submitted: false,
    };
  }

  onChangeCustomerName(e) {
    this.setState({
      customer_name: e.target.value,
    });
  }

  onChangeCustomerID(e) {
    this.setState({
      customer_id: e.target.value,
    });
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
    });
  }

  onChangeQuantity(index, e) {
    const quantity = e.target.value;

    this.setState((prevState) => ({
      soldProducts: [
        ...prevState.soldProducts.slice(0, index),
        {
          ...prevState.soldProducts[index],
          quantity: quantity,
        },
        ...prevState.soldProducts.slice(index + 1),
      ],
    }));
  }

  onChangeProductID(index, e) {
    const productID = e.target.value;

    productService
      .get(productID)
      .then((response) => {
        this.setState((prevState) => ({
          soldProducts: [
            ...prevState.soldProducts.slice(0, index),
            {
              ...prevState.soldProducts[index],
              ...response.data.data,
            },
            ...prevState.soldProducts.slice(index + 1),
          ],
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  }

  saveSalesOrder() {
    const data = {
      customer_name: this.state.customer_name,
      customer_id: this.state.customer_id,
      account_id: 1,
      sales_order_status_id: this.state.status,
    };

    SalesOrderService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.data.sales_order_id,
          customer_id: response.data.data.customer_id,
          customer_name: response.data.data.customer_name,
          status: response.data.data.sales_order_status_id,
          submitted: true,
        });
        this.state.soldProducts.forEach((soldProduct) => {
          const productData = {
            product_id: soldProduct.product_id,
            sales_order_id: response.data.data.sales_order_id,
            quantity: soldProduct.quantity,
          };
          soldProductService
            .create(productData)
            .then((response) => {
              console.log(response.data);
            })
            .catch((e) => {
              console.log(e);
            });
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  addNewProduct() {
    console.log(this.state);
    this.setState((prevState) => ({
      soldProducts: [
        ...prevState.soldProducts,
        {
          product_id: "",
          description: "",
          price: "",
          quantity: "",
        },
      ],
    }));
  }

  render() {
    const { soldProducts } = this.state;
    console.log(soldProducts);
    return (
      <div>
        {this.state.submitted ? (
          <Navigate to={`/sales-orders/${this.state.id}`}></Navigate>
        ) : (
          <form>
            <label htmlFor="customerID">Customer ID: </label>
            <input type="text" id="customerID" onChange={this.onChangeCustomerID} />
            <label htmlFor="customerName">Customer Name: </label>
            <input type="text" id="customerName" onChange={this.onChangeCustomerName} />
            <label htmlFor="status">Status: </label>
            <select id="status" onChange={this.onChangeStatus}>
              <option value="1">processing</option>
              <option value="2">canceled</option>
              <option value="3">shipped</option>
            </select>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Description</th>
                  <th>Unit price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {soldProducts.map((soldProduct, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="numeric"
                        onChange={(e) => this.onChangeProductID(index, e)}
                      />
                    </td>
                    <td>{soldProduct.description}</td>
                    <td>{soldProduct.price}</td>
                    <td>
                      <input
                        type="numeric"
                        onChange={(e) => this.onChangeQuantity(index, e)}
                      />
                    </td>
                    <td>{soldProduct.price * soldProduct.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={this.addNewProduct}>
              Add Product
            </button>
            <button type="button" onClick={this.saveSalesOrder}>
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }
}
