
console.log('BIG HIIIIIIIIIIIi')

// whenever the background wants us to fetch something
browser.runtime.onMessage.addListener((message) => {
  console.log('[injection] onMessage: ', message)
  if(message.task === 'fetchpls') {
    (async () => {
      let res = await fetch(message.args.url)
      console.log('fetchpls')
      console.log(await res.text())
    })();
  }
})

browser.runtime.sendMessage({ foo: 'bar' })