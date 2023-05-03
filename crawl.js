
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
        if(linkElement .href.slice(0,1) === '/') {
            //relative
            try {

                const urlObj = new URL(`${baseURL}${linkElement.href}`)
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

module.exports = {
    normalizeURL,
    getURLsFromHTML
}