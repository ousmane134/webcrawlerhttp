const  { crawlPage } = require('./crawl.js')
async function main() {

    if(process.argv.length < 3) {
        console.log("no website provided")
       // process.exit(1)
    }
    else if(process.argv.length > 3) {
        console.log("Too many command line args")
       // process.exit(1)
    }

    const baseURL = process.argv[2]

    console.log(`Starting the crawl ${baseURL}`)
    const pages = await crawlPage(baseURL, baseURL, {})
    for(const page of Object.entries(pages)) {
        console.log(page)
    }
}

main()