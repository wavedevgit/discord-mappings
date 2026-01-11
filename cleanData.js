import fs from 'fs/promises';
import { runtimeHashMessageKey } from './runtimeHashMessageKey.js';

const updateMessageFindString = (string) => {
    let result = runtimeHashMessageKey(string.replaceAll('Messages.', ''));
    if (!result.match(/^[A-Za-z_$][A-Za-z0-9_$]*$/)) result = `["${result}"]`;
    result = '.' + result;
    return result;
};

export async function generateFindWith(code) {
    const oldMessages = [...code.matchAll(/Messages\.[A-Z0-9_]+/gm)].map(
        (key) => key[0],
    );
    const newMessages = [
        ...code.matchAll(
            /intl\.(string|format)\([$_\w]+\.[$_\w]+(?<id>\..+?)\)/gm,
        ),
    ].map((message) => message.groups.id);
    // endpoints are either ANM.SOMETHING or Endpoints.SOMETHING
    // we neeed to add method too
    const endpoints = [
        ...code
            .matchAll(
                /\.(?<method>get|post|put|patch|del)\({.+(Endpoints|ANM)(?<id>\.[\w_]+(\(|))/gm,
            )
            .map((endpoint) => [
                '.' + endpoint.groups.method,
                endpoint.groups.id,
            ]),
    ];
    const fluxEvents = [
        ...code
            .matchAll(/dispatch\({(.+?|)(?<code>type:"[_\w]+")/gm)
            .map((event) => event.groups.code),
    ];

    const results = [];

    // only one endpoint is really required as it can only be used in one chunk/function
    if (endpoints.length > 0) results.push(endpoints[0][0], endpoints[0][1]);
    if (results.length === 0 && newMessages.length > 0)
        results.push(...newMessages);
    if (results.length === 0 && oldMessages.length > 0)
        results.push(...oldMessages.map(updateMessageFindString));

    if (results.length === 0 && fluxEvents.length > 0) {
        results.push(...fluxEvents);
    }
    return results;
}

const currentData = JSON.parse(await fs.readFile('./data/data.json', 'utf-8'));
const unDone = JSON.parse(await fs.readFile('./data/undone.json', 'utf-8'));

for (let chunk of currentData) {
    for (let match of chunk) {
        // rewrite as old method is fucked up
        if (match.code) match.find_with = await generateFindWith(match.code);
        if (match.findWith) match.find_with = match.findWith;
        if (typeof match.find_with === 'string')
            match.find_with = [match.find_with];
        if (match.find_with.some((i) => i.includes('Messages.')))
            match.find_with = match.find_with.map(updateMessageFindString);

        delete match.findWith;
    }
}

let i = 0;
let k = 0;
for (let chunk of unDone) {
    let generated = [];
    for (let match of chunk) {
        if (match.code) match.find_with = await generateFindWith(match.code);
        if (match.find_with.length > 0) {
            generated.push(match);
            k += 1;
        }
        i += 1;
    }
    if (generated.length > 0) currentData.push(generated);
}

console.log('done', k);
console.log('total', i);
await fs.writeFile(
    './data/data.json',
    JSON.stringify(
        currentData.filter((item) => item.length > 0),
        null,
        4,
    ),
    'utf-8',
);

await fs.writeFile(
    './data/undone.json',
    JSON.stringify(unDone, null, 4),
    'utf-8',
);
