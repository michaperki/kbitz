// apiUtils.js

// simulate an API call to retrieve crypto data

const getCryptoData = async () => {
  const response = await fetch("https://api.coincap.io/v2/assets");
  const data = await response.json();
  return data.data;
}

export default getCryptoData;