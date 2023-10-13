import React from "react";
import getCryptoData from "../utils/apiUtils/apiUtils";

const Dashboard = () => {
  const [cryptoData, setCryptoData] = React.useState([]);

  React.useEffect(() => {
    getCryptoData().then((data) => {
      setCryptoData(data);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome to your dashboard! This is where you can display user-specific
        information and actions.
      </p>

      <h2>Crypto Data</h2>
      <ul>
        {cryptoData.map((crypto) => (
          <li key={crypto.id}>{crypto.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
