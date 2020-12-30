import React from "react";
import Link from "next/link";
import Head from "../components/head";

const Home = () => (
  <div>
    <Head title="Home" />
    <div className="hero">
      <h1 className="title">Welcome to Next!</h1>
      <p className="description">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>
    </div>
  </div>
);

export default Home;
