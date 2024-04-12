# LinkedIn Company Profile Scraper

## Introduction
This project is aimed to scrape public company profile data from LinkedIn and store them into Google Sheets. The project utilizes ZenRows API for web scraping in order to bypass LinkedIn's CAPTCHA tools and avoid IP blocking problems caused by sending too many requests in a short period of time. Axios and cheerio are used for API interaction. 8 requests are sent in parallel each time and the results are saved into a Google Sheet.

## Pre-requisites
You need to fill up the environment variables in the .env. Here is an example file:

.env.example:
```
GCLOUD_PROJECT=
GOOGLE_APPLICATION_CREDENTIALS=./service_account_credentials.json
SPREADSHEETID=
SHEETNAME=
PARALLEL=8
APIKEY=
```
Ensure you have node.js installed, and the suitable authentication and access permissions for Zenrows and Google Sheets API.

## Steps to run the project:

## Installation

1. Clone the repository from [here](https://github.com/flurryunicorn/linkedinScraping-using-zenrow).
2. Run `npm install` to install all the necessary dependencies.
3. Create a `.env` file based on the example `.env.example` and fill it with your real credentials.
4. Run the scraping command using `node index.js`.

Make sure your Googlesheet is shared with the client email.

## Data Storage
The scraped data is stored in a Google Sheet using Google Sheets API (googleapis). This makes it easy to view, share, and work with the scraped data. The spreadsheet ID and sheet name are specified in the .env file.

## Built With
- Node.js
- Axios - Used to make HTTP requests 
- Cheerio - Used for web scraping
- ZenRows API - Used to bypass CAPTCHA and IP blocking
- Google Sheets API (googleapis) - Used to store the scraped data

Feel free to fork or clone this repository for your own purposes. Contributions are also welcomed!
