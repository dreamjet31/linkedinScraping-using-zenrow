const {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  addValuesSpreadSheet,
  updateValuesSpreadSheet,
  updateRangeValuesSpreadSheet,
} = require("./googleSheetsService.js");
require("dotenv").config();

const spreadsheetId = process.env.SPREADSHEETID;
const sheetName = process.env.SHEETNAME;
const values = ["John", "Doe", "example@example.com"];

async function testGetSpreadSheet() {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheet({
      spreadsheetId,
      auth,
    });
    console.log(
      "output for getSpreadSheet",
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.log(error.message, error.stack);
  }
}

async function testGetSpreadSheetValues() {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth,
    });
    // console.log(JSON.stringify(response.data.values, null, 2));
    return response.data.values;
  } catch (error) {
    // console.log(error.message, error.stack);
    return error.message;
  }
}

async function testAddValuesSpreadSheet() {
  try {
    const auth = await getAuthToken();
    const response = await addValuesSpreadSheet({
      spreadsheetId,
      sheetName,
      auth,
      values,
    });
    console.log(
      "output for addValuesSpreadSheet",
      JSON.stringify(response.data, null, 2)
    );
  } catch (error) {
    console.log(error.message, error.stack);
  }
}

async function updateSpreadsheet(row, column, value) {
  try {
    // Get the authentication token
    const auth = await getAuthToken();

    // Update the value in the spreadsheet
    const response = await updateValuesSpreadSheet({
      spreadsheetId,
      auth,
      sheetName,
      row,
      column,
      value,
    });
    console.log("Value updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating value:", error);
  }
}

async function updateRangeSpreadsheet(range, values) {
  try {
    // Get authentication token
    const auth = await getAuthToken();

    // Range and values to update
    // const range = "B2:F2";
    // const values = ["Value1", "Value2", "Value3", "Value4", "Value5"];

    // Update the range with the values
    const response = await updateRangeValuesSpreadSheet({
      spreadsheetId,
      auth,
      sheetName,
      range,
      values,
    });

    console.log("Range updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating range:", error);
  }
}

async function main() {
  const data = await testGetSpreadSheetValues();
  const urls = data.slice(1).map((el) => {
    return el[0];
  });

  console.log(urls);
  // updateSpreadsheet(2, 'K', 1888);
  // testAddValuesSpreadSheet();
}

main();
