const { resolve } = require("path");
const readline = require("readline");
import("node-fetch");

// Create a readline tool for node.js environment
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get input from user
function askQuestion(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Generate a URL to be passed to POST request
// clientDetails of structure [client_id, client_secret]
function generateURL(clientDetails) {
  return new Promise((resolve, reject) => {
    const urlRequestBody = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientDetails[0],
      client_secret: clientDetails[1],
    });
    resolve(urlRequestBody);
  });
}

// Perform POST request
async function fetchData(requestBody) {
  return new Promise((resolve, reject) => {
    try {
      const fetchResponse = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
      });
      resolve(fetchResponse);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  });
}

// Get bearer token for user
async function getToken(clientId, clientSecret) {
  const requestBody = await generateURL([clientId, clientSecret]);
  const fetchedData = await fetchData(requestBody);
  const userData = await fetchedData.json();
  const bearerToken = userData.access_token;
  return bearerToken;
}

async function main() {
  try {
    const clientId = await askQuestion("Enter Client ID: ");
    const clientSecret = await askQuestion("Enter Client Secret: ");
    const bearerToken = await getToken(clientId, clientSecret);
    console.log(`Bearer token has been set:\n${bearerToken}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    rl.close();
  }
}

main();
