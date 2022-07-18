const fetchTopLanguage = require("../src/fetchTopLangs")

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const topLangs = await fetchTopLanguage()
        res.send(topLangs)
    } catch (err) {
        return res.send(renderError(err.message, err.secondaryMessage));
    }
}