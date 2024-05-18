"use client"

import styles from "./page.module.css"; // Styles for home page
import Navbar from "../components/Navbar";

export default function Home() {
  // Renders elements
  return (
    <div>
      <Navbar />
      <p>home page</p>
    </div>
  );
}