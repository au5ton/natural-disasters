const pattern = "https://learning.mheducation.com/static/awd/main.*.js";

//const injection = browser.runtime.getURL('injection/main.6971deee4720fdefece7.js');
const injection = 'https://cdn.jsdelivr.net/gh/au5ton/natural-disasters/injection/main.6971deee4720fdefece7.js';

function redirect(requestDetails) {
    console.log("Redirecting: " + requestDetails.url);
    //console.log(requestDetails);
    // requestDetails.requestHeaders.forEach(function(header){
    //     if (header.name.toLowerCase() == "content-type") {
    //         header.value = "application/javascript;charset=utf-8";
    //     }
    // });
    return {
        redirectUrl: injection
    };
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern]},
  ["blocking"]
);
