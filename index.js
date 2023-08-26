const axios = require("axios");
const { ZenRows } = require('zenrows');
const cheerio = require('cheerio');
const retry = require('async-retry');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    addValuesSpreadSheet,
    updateValuesSpreadSheet,
    updateRangeValuesSpreadSheet,
} = require("./googleSheetsService.js");
require("dotenv").config();

const parallel = Number(process.env.PARALLEL);
const spreadsheetId = process.env.SPREADSHEETID;
const sheetName = process.env.SHEETNAME;

const apiKey = process.env.APIKEY;
const client = new ZenRows(apiKey, { concurrency: parallel, retries: 1 });

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
        // console.log("Value updated successfully:", response.data);
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

        // console.log("Range updated successfully:", response.data);
    } catch (error) {
        console.error("Error updating range:", error);
    }
}

async function makeRequest(url, range) {
    const run = async (bail, attemptNumber) => {
    return await client.get(url, { js_render: true, premium_proxy: true, "session_id": range})
        .then(response => {
            let result = [];
            const $ = cheerio.load(response.data);
            const employees = $('a[data-tracking-control-name="org-employees_cta_face-pile-cta"]');
            if (employees.length) {
                const string = employees.text().trim();
                const prefix = "View all ";
                const suffix = " employees";

                const extractedString = string.substring(prefix.length, string.length - suffix.length);
                result[4] = extractedString;
            }

            const name = $('h1');
            if (name.length) result[0] = name.text().trim();

            const website = $('div[data-test-id="about-us__website"] a');
            if (website.length) result[1] = website.text().trim();
            const industries = $('div[data-test-id="about-us__industries"] dd');
            if (industries.length) result[2] = industries.text().trim();
            const size = $('div[data-test-id="about-us__size"] dd')
            if (size.length) result[3] = size.text().trim();
            const headquarters = $('div[data-test-id="about-us__headquarters"] dd')
            if (headquarters.length) result[6] = headquarters.text().trim();
            // const founded = $('div[data-test-id="about-us__foundedOn"] dd');
            // if (founded.length) console.log(founded.text().trim());
            const addresses = $('#address-0 p');

            if (addresses.length) result[5] = addresses.text().trim().split(', ').slice(-1)[0];

            updateRangeSpreadsheet(`B${range}:H${range}`, result);
            console.log(result);
        })
        .catch(error => {
            if (error.response && error.response.status === 429) { // HTTP status code for quota limit reached
                    throw error; 
                } else {
                    bail(error); // If not a rate limit error, don't retry and throw an error
                }
                console.log(error.data)
        });
    }
    try {
        // Use the async-retry library to retry the HTTP request if error 429 is received
        await retry(run, {
            retries: 5, // The maximum amount of times to retry the operation Default is 10
            factor: 2, // The exponential factor to use Default is 2
            minTimeout: 1000, // The number of milliseconds before starting the first retry Default is 1000
            maxTimeout: Infinity, // The maximum number of milliseconds between two retries Default is Infinity
            randomize: true, // Randomizes the timeouts by multiplying a factor between 1-2 Default is false
            onRetry: (error, attemptNumber) => console.log(`Retrying request... Attempt number: ${attemptNumber}`) // Called each time a retry is made.
        });
    } catch (err) {
        console.error('Request failed after 5 retries:', err);
    }
}

async function main() {

    const data = await testGetSpreadSheetValues();
    const urlList = data.slice(1).map((el) => {
        return el[0];
    });

    // console.log(urlList);

    const time = new Date().getTime();

    // for (let i = 0; i < Number.parseInt(urlList.length / parallel) + 1; i++) {
    //     const slice = urlList.slice(parallel * i, parallel * (i + 1));
    //     const requests = slice.map((url, index) => makeRequest(url, i * parallel + index + 2));

    //     await Promise.all(requests);
    // }

    const promises = urlList.map((url, index) => makeRequest(url, index + 2));
    await Promise.allSettled(promises);

    const last = new Date().getTime();

    console.log("Time => ", last - time);
}

main();