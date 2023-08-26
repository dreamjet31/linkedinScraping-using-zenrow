// googleSheetsService.js

const { google } = require("googleapis");
const sheets = google.sheets("v4");
require("dotenv").config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({ spreadsheetId, auth }) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
  });
  return res;
}

async function addValuesSpreadSheet({
  spreadsheetId,
  auth,
  sheetName,
  values,
}) {
  const resource = {
    values: [values], // values should be an array of arrays representing rows and columns
  };

  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    resource,
  });
  return res;
}

async function updateValuesSpreadSheet({
  spreadsheetId,
  auth,
  sheetName,
  row,
  column,
  value,
}) {
  const range = `${sheetName}!${column}${row}`;
  const resource = {
    values: [[value]],
  };

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    auth,
    range,
    valueInputOption: "USER_ENTERED",
    resource,
  });
  return res;
}

async function updateRangeValuesSpreadSheet({
  spreadsheetId,
  auth,
  sheetName,
  range,
  values,
}) {
  const resource = {
    values: [values],
  };

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    auth,
    range: `${sheetName}!${range}`,
    valueInputOption: "USER_ENTERED",
    resource,
  });
  return res;
}

module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  addValuesSpreadSheet,
  updateValuesSpreadSheet,
  updateRangeValuesSpreadSheet,
};
