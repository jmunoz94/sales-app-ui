import React from "react";
import ProductService from "../services/productService";
import { Link } from "react-router-dom";

export default class ListProducts extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSearchDescription = this.onChangeSearchDescription.bind(this);
    this.retrieveProducts = this.retrieveProducts.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.searchDescription = this.searchDescription.bind(this);

    this.state = {
      products: [],
      currentProduct: null,
      currentIndex: -1,
      searchDescription: "",
    };
  }

  componentDidMount() {
    this.retrieveProducts();
  }

  onChangeSearchDescription(e) {
    const searchDescription = e.target.value;

    this.setState({
      searchDescription: searchDescription,
    });
  }

  retrieveProducts() {
    ProductService.getAll()
      .then((response) => {
        this.setState({
          products: response.data.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveProducts();
    this.setState({
      currentProduct: null,
      currentIndex: -1,
    });
  }

  setActiveProduct(product, index) {
    this.setState({
      currentProduct: product,
      currentIndex: index,
    });
  }

  searchDescription() {
    ProductService.findByDescription(this.state.searchDescription)
      .then((response) => {
        this.setState({
          products: response.data.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { searchDescription, products, currentProduct, currentIndex } =
      this.state;

    return (
      <div>
        <div className="search-region">
            <input
              type="text"
              placeholder="Filter by description"
              value={searchDescription}
              onChange={this.onChangeSearchDescription}
            />
            <button
            type="button"
            onClick={this.searchDescription}
            >
            Search
            </button>
        </div>
        <div className="item-list">
          <h4>Products List</h4>
          <ul>
            {products &&
              products.map((product, index) => (
                <li
                  onClick={() => this.setActiveProduct(product, index)}
                  key={index}
                >
                  {product.description}
                </li>
              ))}
          </ul>
          <Link to={`/products/add`}>Add</Link>
        </div>
        <div className="pop-item">
          {currentProduct ? (
            <div>
              <h4>Product</h4>
              <div>
                <span>
                  <strong>Description:</strong>
                </span>{" "}
                {currentProduct.description}
              </div>
              <div>
                <span>
                  <strong>Status:</strong>
                </span>{" "}
                {currentProduct.product_status_id === 1
                  ? "Available"
                  : "Unavailable"}
              </div>

              <Link to={"/products/" + currentProduct.product_id}>Edit</Link>
              {/* <Link
                to={`/products/${currentProduct.product_id}/remove`}
              >
                Delete
              </Link> */}
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Product...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
