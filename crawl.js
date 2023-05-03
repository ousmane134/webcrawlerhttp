
const {JSDOM} = require('jsdom')
const { relative } = require('path')
function normalizeURL(urlString) {

    const urlObject = new URL(urlString)

    const hostPath =  `${urlObject.hostname}${urlObject.pathname}`

    if(hostPath.length > 0 && hostPath.slice(-1) === '/')
    {
        return hostPath.slice(0,-1)
    }
    else
        return hostPath
}

function getURLsFromHTML(htmlBody, baseURL) {

    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')

    for(const linkElement of linkElements) {
        if(linkElement.href.slice(0,1) === '/') {
            //relative
            try {

                const urlObj = new URL(linkElement.href, baseURL)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with relative URL: ${error.message}`)

            }
            
        }
        else {
            //absolute
            try {

                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch(err) {
                console.log(`error with absolute URL: ${error.message}`)

            }
        }
        
    }
    return urls
}

async function crawlPage(baseURL,currentURL,pages) {
    

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages

    }

    pages[normalizedCurrentURL] = 1
    console.log(`crawling: ${currentURL}`)
    let htmlBody = ''

    try {
        const response = await fetch(currentURL)

        if(response.status > 399 ) {
            console.log(`error in fetch with status code: ${response.status} on page: ${currentURL}`)
            return pages
        }
        const contentType = response.headers.get('content-type')
        if(!contentType.includes('text/html')) {
            console.log(`non html response, content type: ${contentType} on page: ${currentURL}`)
            return pages
        }
        htmlBody = await response.text()
       
        
        
    }catch(err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)

    }
    const nextURLs = getURLsFromHTML(htmlBody,baseURL)
    for(const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }
    return pages
    
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}