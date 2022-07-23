import { Octokit } from "octokit";

const fs = require('fs');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function fetchTopLangs() { 
    let rawdata = fs.readFileSync("./topLangs.json")
    let data = JSON.parse(rawdata)

    const ts = Math.floor(new Date().getTime() / 1000)

    if (!data || data.last_updated <= ts - 3600) {
        const response = await octokit.request('GET /user/repos', {})
        const repos = response.data
        const unwanted_langs = ['Procfile']
        
        let top_langs = {}

        for (const repo of repos) {
            const r = await octokit.request('GET /repos/{owner}/{repo}/languages', {
                owner: repo.owner.login,
                repo: repo.name
              })
            const langs = r.data

            for (const lang in langs) {
                if (lang in top_langs) {
                    top_langs[lang] += langs[lang]
                } else {
                    top_langs[lang] = langs[lang]
                }
            }
        }

        const total = Object.values(top_langs)
            .reduce((acc, val) => {
                return acc + val
            }, 0)

        for (const lang of unwanted_langs) {
            if (lang in top_langs) {
                delete top_langs[lang]
            }
        }

        for (const lang in top_langs) {
            top_langs[lang] = Math.round((top_langs[lang] / total) * 100)

        data["languages"] = top_langs
        data["last_updated"] = ts

        fs.writeFileSync("./topLangs.json", JSON.stringify(data))
        
        }

    }

    return data
    
}

module.exports = fetchTopLangs;
