import React from "react";
import { useParams } from "react-router";
import SalesOrderService from "../services/salesOrderService";

export default class UpdateSalesOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeCustomerName = this.onChangeCustomerName.bind(this);
    this.onChangeCustomerID = this.onChangeCustomerID.bind(this);
    this.getSalesOrder = this.getSalesOrder.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.updateSalesOrder = this.updateSalesOrder.bind(this);
    this.deleteSalesOrder = this.deleteSalesOrder.bind(this);

    this.state = {
      currentSalesOrder: {
        sales_order_id: null,
        customer_name: "",
        customer_id: 0,
        sales_order_status_id: "",
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getSalesOrder(this.props.id);
  }

  onChangeCustomerID(e) {
    const customer_id = e.target.value;

    this.setState((prevState) => ({
      currentSalesOrder: {
        ...prevState.currentSalesOrder,
        customer_id: customer_id,
      },
    }));
  }

  onChangeCustomerName(e) {
    const customer_name = e.target.value;

    this.setState((prevState) => ({
      currentSalesOrder: {
        ...prevState.currentSalesOrder,
        customer_name: customer_name,
      },
    }));
  }

  getSalesOrder(id) {
    SalesOrderService.get(id)
      .then((response) => {
        this.setState({
          currentSalesOrder: response.data.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onChangeStatus(e) {
    const salesOrderStatusID = e.target.value;

    this.setState((prevState) => ({
      currentSalesOrder: {
        ...prevState.currentSalesOrder,
        sales_order_status_id: salesOrderStatusID,
      },
    }));
  }

  updateSalesOrder() {
    console.log(this.state.currentSalesOrder);
    SalesOrderService.update(
      this.state.currentSalesOrder.sales_order_id,
      this.state.currentSalesOrder
    )
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The Sales Order was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteSalesOrder() {
    SalesOrderService.delete(this.state.currentSalesOrder.sales_order_id)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentSalesOrder } = this.state;

    return (
      <div>
        {currentSalesOrder ? (
          <div>
            <h4>SalesOrder</h4>
            <form>
              <div>
                <label htmlFor="customerID">CustomerID</label>
                <input
                  type="text"
                  id="customerID"
                  value={currentSalesOrder.customer_id}
                  onChange={this.onChangeCustomerID}
                />
              </div>
              <div>
                <label htmlFor="customerName">Customer Name</label>
                <input
                  type="text"
                  id="customerName"
                  value={currentSalesOrder.customer_name}
                  onChange={this.onChangeCustomerName}
                />
              </div>

              <div>
                <span>
                  <strong>Status:</strong>
                </span>
                <select
                  value={currentSalesOrder.sales_order_status_id}
                  onChange={this.onChangeStatus}
                >
                  <option value="1">processing</option>
                  <option value="2">canceled</option>
                  <option value="3">shipped</option>
                </select>
              </div>
            </form>

            {/* <button
              onClick={this.deleteSalesOrder}
            >
              Delete
            </button> */}

            <button
              type="submit"
              onClick={this.updateSalesOrder}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a SalesOrder...</p>
          </div>
        )}
      </div>
    );
  }
}

export const WrappedUpdateSalesOrderForm = (props) => {
  const params = useParams();

  return <UpdateSalesOrderForm {...props} id={params.id} />;
};
