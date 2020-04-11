//const pattern = "https://bento.mheducation.com/files/smart-factory/*/smart-package/assessment-items/*.json";
// see: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
const pattern = `*://bento.mheducation.com/*.json`

const snooze = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function interceptBody(details) {
  console.log(`⚡ Intercepted: ${details.url}`);
  return new Promise((resolve, reject) => {
    try {
      let filter = browser.webRequest.filterResponseData(details.requestId);
      let decoder = new TextDecoder('utf-8');
      let encoder = new TextEncoder();

      let responseBody = ''

      filter.onstart = event => {
        console.log('➡ started')
      }

      filter.ondata = event => {
        // decode data
        let str = decoder.decode(event.data, { stream: true });
        // save chunk
        responseBody += str;
        // pipe back
        filter.write(encoder.encode(str));
      }

      filter.onstop = event => {
        console.log('⛔ stopped')
        resolve(JSON.parse(responseBody))
        filter.disconnect()
      }
    }
    catch (err) {
      reject(err)
    }
  })
}

async function postData(entry) {
  const response = await fetch('https://us-central1-natural-disasters-758dc.cloudfunctions.net/entry/add', {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry) // body data type must match "Content-Type" header
  });
  return await response.text()
}

browser.runtime.connect()

browser.webRequest.onBeforeRequest.addListener((details) => {
  // (async () => {
  //   let body = await interceptBody(details);
  //   await postData({
  //     type: 'manifest',
  //     body: body
  //   })
  // })();
},
  { urls: [`*://bento.mheducation.com/*/manifest.json`] },
  ['blocking']
)

browser.webRequest.onBeforeRequest.addListener((details) => {
  // (async () => {
  //   let body = await interceptBody(details);
  //   await postData({
  //     type: 'toc',
  //     body: body
  //   })
  // })();
},
  { urls: [`*://bento.mheducation.com/*/toc.json`] },
  ['blocking']
)

browser.webRequest.onBeforeRequest.addListener((details) => {
  console.log(details);
  (async () => {
    let body = await interceptBody(details);
    
    let url = new URL(details.url)
    let arr = url.pathname.split('/')
    arr.pop()
    let basename = arr.join('/')

    console.log(body.length)
    // ask the injection to get something for us
    await browser.tabs.executeScript(details.tabId, { file: 'injection.js' })
    await browser.tabs.sendMessage(details.tabId, {
      task: 'fetchpls',
      args: {
        url: `${url.origin}${basename}${body[0]['$path']}`
      }
    })
  })();
},
  { urls: [`*://bento.mheducation.com/*/learning-objectives.json`] },
  ['blocking']
)

// whenever the injection wants to send out data
browser.runtime.onMessage.addListener((message) => {
  console.log('[background] onMessage: ', message)
  if(message.task === 'postpls') {
    (async () => {
      await postData(message.args)
    })();
  }
})
