import React from "react";
import SalesOrderService from "../services/salesOrderService";
import { Link } from "react-router-dom";
import soldProductService from "../services/soldProductService";

export default class ListSalesOrders extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSearchCustomerName =
      this.onChangeSearchCustomerName.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.retrieveSalesOrders = this.retrieveSalesOrders.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.searchCustomerName = this.searchCustomerName.bind(this);

    this.state = {
      salesOrders: [],
      currentSalesOrder: null,
      currentIndex: -1,
      currentSoldProducts: [],
      searchCustomerName: "",
    };
  }

  componentDidMount() {
    this.retrieveSalesOrders();
  }

  onChangeSearchCustomerName(e) {
    const searchCustomerName = e.target.value;

    this.setState({
      searchCustomerName: searchCustomerName,
    });
  }

  onChangeQuantity(index, e) {
    const newQuantity = e.target.value;
    const price = this.state.currentSoldProducts[index].price;
    const oldQuantity = this.state.currentSoldProducts[index].quantity;

    this.setState((prevState) => ({
      currentSoldProducts: [
        ...prevState.currentSoldProducts.slice(0, index),
        {
          ...prevState.currentSoldProducts[index],
          quantity: newQuantity,
        },
        ...prevState.currentSoldProducts.slice(index + 1),
      ],
      currentSalesOrder: {
        ...prevState.currentSalesOrder,
        total:
          parseInt(prevState.currentSalesOrder.total) +
          (newQuantity - oldQuantity) * price,
      },
    }));
  }

  retrieveSalesOrders() {
    SalesOrderService.getAll()
      .then((response) => {
        this.setState({
          salesOrders: response.data.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveSalesOrders();
    this.setState({
      currentSalesOrder: null,
      currentIndex: -1,
    });
  }

  setActiveSalesOrder(salesOrder, index) {
    soldProductService
      .findBySalesOrder(salesOrder.sales_order_id)
      .then((response) => {
        this.setState({
          currentSalesOrder: salesOrder,
          currentIndex: index,
          currentSoldProducts: response.data.data,
        });
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  }

  updateSoldProduct(index) {
    const soldProductID = this.state.currentSoldProducts[index].sold_product_id;
    const quantity = this.state.currentSoldProducts[index].quantity;
    const data = {
      quantity: quantity,
    };

    soldProductService
      .update(soldProductID, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteSoldProduct(index) {
    soldProductService
      .delete(this.state.currentSoldProducts[index].sold_product_id)
      .then((response) => {
        this.setState((prevState) => ({
          currentSoldProducts: [
            ...prevState.currentSoldProducts.slice(0, index),
            ...prevState.currentSoldProducts.slice(index + 1),
          ],
          currentSalesOrder: {
            ...prevState.currentSalesOrder,
            total:
              parseInt(prevState.currentSalesOrder.total) -
              prevState.currentSoldProducts[index].quantity *
                prevState.currentSoldProducts[index].price,
          },
        }));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  searchCustomerName() {
    SalesOrderService.findByCustomerName(this.state.searchCustomerName)
      .then((response) => {
        this.setState({
          salesOrders: response.data.data,
          currentSalesOrder: null,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const {
      searchCustomerName,
      salesOrders,
      currentSalesOrder,
      currentIndex,
      currentSoldProducts,
    } = this.state;

    return (
      <div>
        <div className="search-region">
            <input
              type="text"
              placeholder="Filter by customer name"
              value={searchCustomerName}
              onChange={this.onChangeSearchCustomerName}
            />
            <button
              type="button"
              onClick={this.searchCustomerName}
            >
              Search
            </button>
        </div>
        <div className="item-list">
          <h4>Sales Orders List</h4>
          <div>
            <Link to={`/sales-orders/add`}>Add</Link>
          </div>

          <ul>
            {salesOrders &&
              salesOrders.map((salesOrder, index) => (
                <li
                  onClick={() => this.setActiveSalesOrder(salesOrder, index)}
                  key={index}
                >
                  {`Order ${salesOrder.sales_order_id}: ${salesOrder.customer_name}`}
                </li>
              ))}
          </ul>
        </div>
        <div className="pop-item">
          {currentSalesOrder ? (
            <div>
              <h4>Sales Order</h4>
              <div>
                <span>
                  <strong>Customer ID:</strong>
                </span>{" "}
                {currentSalesOrder.customer_id}
              </div>
              <div>
                <span>
                  <strong>Customer Name:</strong>
                </span>{" "}
                {currentSalesOrder.customer_name}
              </div>
              <div>
                <span>
                  <strong>Status:</strong>
                </span>{" "}
                {currentSalesOrder.sales_order_status_name}
              </div>

              <Link to={`/sales-orders/${currentSalesOrder.sales_order_id}`}>
                Edit
              </Link>
              {/* <Link
                to={`/sales-orders/${currentSalesOrder.sales_order_id}/remove`}
              >
                Delete
              </Link> */}
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
                  {currentSoldProducts &&
                    currentSoldProducts.map((soldProduct, index) => (
                      <tr key={index}>
                        <td>{soldProduct.product_id}</td>
                        <td>{soldProduct.description}</td>
                        <td>{soldProduct.price}</td>
                        <td>
                          <input
                            value={soldProduct.quantity}
                            onChange={(e) => this.onChangeQuantity(index, e)}
                          />
                        </td>
                        <td>{soldProduct.price * soldProduct.quantity}</td>
                        <td>
                          <button
                            onClick={(e) => this.updateSoldProduct(index)}
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={(e) => this.deleteSoldProduct(index)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{currentSalesOrder.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Sales Order...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
