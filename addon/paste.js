// See: https://stackoverflow.com/a/19328891
var saveData = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
      var json = JSON.stringify(data),
          blob = new Blob([json], {type: "octet/stream"}),
          url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
  };
}());

function b64DecodeUnicode(e) {
  return decodeURIComponent(atob(e).split("").map(function (e) {
    return "%" + ("00" + e.charCodeAt(0).toString(16)).slice(-2)
  }).join(""))
}

function deobfuscate(t) {
  if (t.length % 9 > 0 || t.match(/[^a-zA-Z0-9\/= +]/g)) throw new Error("Hidata payload does not match the interface");
  var n = t.replace(/(.)(.)(.)(.)(.)(.)(.)(.)(.)/g, "$2$6$8$1$4$9$3$5$7").replace(/ +$/, ""),
    r = b64DecodeUnicode(n);

  return JSON.parse(r)
}

// RUN AT: https://bento.mheducation.com/files/smart-factory/###/smart-package/learning-objectives/###.json
async function main() {
  let res = await fetch("https://bento.mheducation.com/files/smart-factory/9d011dde-974e-420f-9950-bba039188d69/smart-package/learning-objectives.json", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://learning.mheducation.com/static/awd/index.html?_t=1598255834008",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
  //let res = await fetch("https://bento.mheducation.com/files/smart-factory/9d011dde-974e-420f-9950-bba039188d69/smart-package/learning-objectives.json", {"credentials":"omit","headers":{"accept":"application/json, text/plain, */*","sec-fetch-dest":"empty"},"referrer":"https://learning.mheducation.com/static/awd/index.html?_t=1586575074170","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
  let data = await res.json();
  const BASEURL = 'https://bento.mheducation.com/files/smart-factory/9d011dde-974e-420f-9950-bba039188d69/smart-package';
  const snooze = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let x = 0;
  let totalAss = 0;

  for(let i of data) {
    totalAss += i.assessmentItems.length;
  }

  for(let i = 0; i < data.length; i++) {
    data[i]['$$path'] = await (await fetch(`${BASEURL}/${data[i]['$path']}`)).json();
    data[i]['$assessmentItems'] = [];
    for(let j = 0; j < data[i].assessmentItems.length; j++) {
      console.log(`i: ${i}/${data.length} | ass: ${x}/${totalAss}`);
      let res = await (await fetch(`${BASEURL}/${data[i].assessmentItems[j]['$path']}`)).json();
      res['hidata']['payload'] = deobfuscate(res['hidata']['payload']);
      data[i]['$assessmentItems'].push(res);
      //await snooze(500);
      x++;
    }
  }

  console.log(data);
  saveData(data, "kin.deobfuscated.json");
}

main();
