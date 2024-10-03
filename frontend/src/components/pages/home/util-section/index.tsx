
// components/TestUtils.tsx
import Cookies from "js-cookie";
import { useState } from "react";

import styles from "./styles.module.css";

export default function TestUtils() {
  const [message, setMessage] = useState("");

  const clearCookie = () => {
    Cookies.remove("lichess_id");
    Cookies.remove("lichess_access_token");
    setMessage("Cookies cleared!");
  };

  const clearDatabase = async () => {
    try {
      const response = await fetch("/api/clear-db", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Failed to clear the database:", err);
      setMessage("Failed to clear the database");
    }
  };

  return (
    <div className={styles.testUtils}>
      <h1>Testing Utilities</h1>
      <p>{message}</p>
      <button onClick={clearCookie}>Clear Cookies</button>
      <button onClick={clearDatabase}>Clear Database</button>
    </div>
  );
}

