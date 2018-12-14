const fs = require('fs');
const path = require('path');

const leftpad0 = section => section.length === 2 ? section : `0${section}`;
const thru = cb => x => { cb(x); return x };
const dbg = x => console.log(x) || x;
const render = (lang, content) => content.map(line => [line[0], line[lang]]).map(line => `${line[0]}\n${line[1]}\n\n`).join('\n');

//
const context = { langs: {} };

//
Promise.resolve()
  .then(() => fs.readFileSync('./source.csv', 'utf8').split('\n').map(line => line.split(',')))
  .then(thru(content => {
    content[0].map(x => x.trim()).forEach((x, xi) => context.langs[x] = xi);
    console.log(context);
  }))
  .then(content => content.map(line => [line[0].replace(/\./g, ':'), ...line.slice(1)] ))
  .then(content => content.map(line => [leftpad0(line[0]), ...line.slice(1)] ))
  .then(content => content.map(line => [`${line[0]},000`, ...line.slice(1)] ))
  .then(content => content.map((line, idx, contentArr) => [`${line[0]} --> ${((contentArr[idx+1] || [])[0] || '01:03:43,000')}`, ...line.slice(1)] ))

  // split
  .then(content => {
    const { langs } = context;
    console.log(langs);

    const korean = render(langs.Korean, content.slice(1));
    const english = render(langs.English, content.slice(1));

    fs.writeFileSync('korean.srt', korean);
    fs.writeFileSync('english.srt', english);

    return content;
  })
  // .then(console.log);
