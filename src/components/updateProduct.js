import React from "react";
import { useParams } from "react-router";
import ProductService from "../services/productService";

export default class UpdateProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);

    this.state = {
      currentProduct: {
        product_id: null,
        description: "",
        price: 0,
        product_status_id: "1",
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getProduct(this.props.id);
  }

  onChangePrice(e) {
    const price = e.target.value;

    this.setState((prevState) => {
      return {
        currentProduct: {
          ...prevState.currentProduct,
          price: price,
        },
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentProduct: {
        ...prevState.currentProduct,
        description: description,
      },
    }));
  }

  getProduct(id) {
    ProductService.get(id)
      .then((response) => {
        this.setState({
          currentProduct: response.data.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateStatus(status) {
    var data = {
      product_id: this.state.currentProduct.product_id,
      price: this.state.currentProduct.price,
      description: this.state.currentProduct.description,
      product_status_id: status,
    };

    ProductService.update(this.state.currentProduct.product_id, data)
      .then((response) => {
        this.setState((prevState) => ({
          currentProduct: {
            ...prevState.currentProduct,
            product_status_id: status,
          },
        }));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateProduct() {
    ProductService.update(
      this.state.currentProduct.product_id,
      this.state.currentProduct
    )
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The Product was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteProduct() {
    ProductService.delete(this.state.currentProduct.product_id)
      .then((response) => {
        console.log(response.data);
        this.props.history.push("/products");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentProduct } = this.state;

    return (
      <div>
        {currentProduct ? (
          <div>
            <h4>Product</h4>
            <form>
              <div>
                <label htmlFor="price">Price</label> {" "}
                <input
                  type="text"
                  id="price"
                  value={currentProduct.price}
                  onChange={this.onChangePrice}
                />
              </div>
              <div>
                <label htmlFor="description">Description</label> {" "}
                <input
                  type="text"
                  id="description"
                  value={currentProduct.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div>
                <span>
                  <strong>Status:</strong>
                </span>
                {currentProduct.product_status_id === "1"
                  ? "Available"
                  : "Unavailable"}
              </div>
            </form>

            {currentProduct.product_status_id === "1" ? (
              <button
                onClick={() => this.updateStatus("2")}
              >
                Set to Unavailable
              </button>
            ) : (
              <button
                onClick={() => this.updateStatus("1")}
              >
                Set to Available
              </button>
            )}

            {/* <button
              onClick={this.deleteProduct}
            >
              Delete
            </button> */}

            <button
              type="submit"
              onClick={this.updateProduct}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Product...</p>
          </div>
        )}
      </div>
    );
  }
}

export const WrappedUpdateProductForm = (props) => {
  const params = useParams();

  return <UpdateProductForm {...props} id={params.id} />;
};
