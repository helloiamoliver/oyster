require("dotenv").config();
const { AssetCache } = require("@11ty/eleventy-cache-assets");
const Airtable = require("airtable");

// You configure here…
const airtableBaseId = "app0i161NIgieEfH1";
const airtableTable = "All";
const airtableTableView = "All";
const assetCacheId = "oyster";

var base = new Airtable({ apiKey: process.env.KEY }).base(
    airtableBaseId
);

module.exports = () => {
    let asset = new AssetCache(assetCacheId);

    // Cache the data in 11ty for one day
    if (asset.isCacheValid("1h")) {
        console.log("Serving airtable data from the cache…");
        return asset.getCachedValue();
    }

    // The 11ty cache is cold… so we need to talk to Airtable
    return new Promise((resolve, reject) => {
        let allDatasets = [];

        base(airtableTable)
            .select({
                view: airtableTableView,
            })
            .eachPage(
                function page(records, fetchNextPage) {
                    records.forEach((record) => {
                        allDatasets.push({
                            id: record._rawJson.id,
                            ...record._rawJson.fields,
                        });
                    });
                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Put the data into the 11ty cache
                        asset.save(allDatasets, "json");
                        resolve(allDatasets);
                    }
                },
            );
    });
};