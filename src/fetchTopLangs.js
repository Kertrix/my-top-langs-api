import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function fetcher() {
    let top_langs = {}
    const unwanted_langs = ['Procfile']

    const response = await octokit.request('GET /user/repos', {})
    const repos = response.data
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
    }

    return top_langs;
}

module.exports = fetchTopLanguage;
