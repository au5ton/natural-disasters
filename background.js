var pattern = "https://learning.mheducation.com/static/awd/main.6971deee4720fdefece7.js";

function redirect(requestDetails) {
    console.log("Redirecting: " + requestDetails.url);
    //console.log(requestDetails);
    // requestDetails.requestHeaders.forEach(function(header){
    //     if (header.name.toLowerCase() == "content-type") {
    //         header.value = "application/javascript;charset=utf-8";
    //     }
    // });
    return {
        redirectUrl: browser.runtime.getURL('injection/main.6971deee4720fdefece7.js')
    };
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[pattern]},
  ["blocking"]
);