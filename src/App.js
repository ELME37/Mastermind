import React from "react";

import Router from "./router/router";
import Layout from "./components/layout/Layout";
import Footer from "./components/footer/Footer";

export default function App() {
  return (
    <div className="App">
      <Layout>
        <Router />
      </Layout>

        <Footer />
    </div>
  );
}