const fs = require('fs');

import fetchTopLangs from "../src/fetchTopLangs";

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        res.json(await fetchTopLangs())
    } catch (err) {
        return res.send(renderError(err.message, err.secondaryMessage));
    }
}