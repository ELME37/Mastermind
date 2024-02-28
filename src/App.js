import React from "react";

import Layout from "./components/layout";
import Router from "./router";

export default function App() {
  return (
    <div className="App">
      <Layout>
        <Router />
      </Layout>
    </div>
  );
}