import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import Storage from "./utility/StorageUtil";
import { Provider } from "react-redux";
import store from "./redux/store";

const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

Storage.Init().then(() => {
  // ReactDOM.render(
  //   <React.StrictMode>
  //     <Provider store={store}>
  //       <Router basename={baseUrl}>
  //         <App />
  //       </Router>
  //     </Provider>
  //   </React.StrictMode>,
  //   rootElement
  // );
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router basename={baseUrl}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
