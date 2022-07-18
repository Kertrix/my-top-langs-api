import fetchTopLangs from "../src/fetchTopLangs";

export default async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const topLangs = await fetchTopLangs()
        res.send(topLangs)
    } catch (err) {
        return res.send(renderError(err.message, err.secondaryMessage));
    }
}