import React from "react";
import ProductService from "../services/productService";
import { Navigate } from "react-router-dom";

export default class CreateProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.saveProduct = this.saveProduct.bind(this);

    this.state = {
      id: null,
      description: "",
      price: 0,
      status: "1",
      submitted: false,
    };
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value,
    });
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
    });
  }

  saveProduct() {
    const data = {
      description: this.state.description,
      price: this.state.price,
      product_status_id: this.state.status,
    };

    ProductService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.data.product_id,
          price: response.data.data.price,
          description: response.data.data.description,
          status: response.data.data.product_status_id,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        {this.state.submitted ? (
          <Navigate to={`/products/${this.state.id}`}></Navigate>
        ) : (
          <form>
            <label htmlFor="description">Description: </label>
            <input type="text" id="description" onChange={this.onChangeDescription} />
            <label htmlFor="price">Price: </label>
            <input type="numeric" id="price" onChange={this.onChangePrice} />
            <label htmlFor="status">Status: </label>
            <select id="status" onChange={this.onChangeStatus}>
              <option value="1">available</option>
              <option value="2">unavailable</option>
            </select>
            <button type="button" onClick={this.saveProduct}>
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }
}
