
// RUN AT: https://bento.mheducation.com/files/smart-factory/ac8c32b7-9b21-4939-832c-863a04585ca0/smart-package/learning-objectives/535236.json

let data = await (await fetch("https://bento.mheducation.com/files/smart-factory/ac8c32b7-9b21-4939-832c-863a04585ca0/smart-package/learning-objectives.json", {"credentials":"omit","headers":{"accept":"application/json, text/plain, */*","sec-fetch-dest":"empty"},"referrer":"https://learning.mheducation.com/static/awd/index.html?_t=1586575074170","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})).json();
const BASEURL = 'https://bento.mheducation.com/files/smart-factory/ac8c32b7-9b21-4939-832c-863a04585ca0/smart-package';
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
        data[i]['$assessmentItems'].push(res);
        //await snooze(500);
        x++;
    }
}

console.log(data);