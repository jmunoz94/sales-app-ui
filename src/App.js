import "./App.css";
import { Routes, Route } from "react-router-dom";

import CreateProductForm from "./components/createProduct";
import CreateSalesOrderForm from "./components/createSalesOrder";
import ListProducts from "./components/readProduct";
import ListSalesOrders from "./components/readSalesOrder";
import { WrappedUpdateProductForm } from "./components/updateProduct";
import { WrappedUpdateSalesOrderForm } from "./components/updateSalesOrder";

const App = () => {
  return (
    <div className="App">
      <h1>Sales Order Management System</h1>
      <nav>
        <a href="/products">Products</a>
        <a href="/sales-orders">Sales Orders</a>
        <a href="/accounts">Accounts</a>
      </nav>
      <div>
        <Routes>
          <Route exact path="/products" element={<ListProducts />} />
          <Route exact path="/products/add" element={<CreateProductForm />} />
          <Route path="/products/:id" element={<WrappedUpdateProductForm />} />
          <Route path="/sales-orders" element={<ListSalesOrders />} />
          <Route path="/sales-orders/add" element={<CreateSalesOrderForm />} />
          <Route
            path="/sales-orders/:id"
            element={<WrappedUpdateSalesOrderForm />}
          />
        </Routes>
      </div>
      <footer>
        MisionTIC 2021
      </footer>
    </div>
  );
};

export default App;
