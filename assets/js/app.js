import "phoenix_html";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import Schedule from "./components/Schedule";

import "../css/app.scss";

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Schedule />
  </ApolloProvider>,
  document.getElementById("react-app")
);
