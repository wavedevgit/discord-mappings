import puppeteer from 'puppeteer';
import fs from 'fs/promises';

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 0,
        protocolTimeout: 0,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://canary.discord.com/login', {
        waitUntil: 'domcontentloaded',
    });
    page.on('console', (msg) => {
        console.log('page log:', msg.text());
    });

    await page.evaluate(async () => {
        await (async () => {
            window.r = webpackChunkdiscord_app.push([[Symbol()], {}, (e) => e]);
            for (let i = 0; i < 100000; i++) {
                if (r.u(i) !== 'undefined.js')
                    try {
                        await r.e(i);
                        console.log('loaded', i);
                    } catch {}
            }
        })();
    });
    const data = JSON.parse(await fs.readFile('./data/data.json', 'utf-8'));
    const result = await page.evaluate(
        (data) => {
            let __mods = Object.values(r.c);

            const tests = data.flat();
            const getMappings = (exports) => {
                const mappings = {};
                for (let prop in exports) {
                    const value = prop[exports].toString();
                    for (let test of data) {
                        if (
                            test.find_with.every((find) => value.includes(find))
                        )
                            mappings[prop] = test.name;
                    }
                }
                return mappings;
            };

            const output = [];
            for (let mod of _mods) {
                if (
                    typeof mod.exports !== 'object' &&
                    !mod.exports &&
                    Object.prototype.toString.call(value) !== '[object Object]'
                )
                    continue;
                const result = {
                    id: mod.id,
                    path: '', // empty if unknown, only official paths frorm mobile app are allowed here
                    // TODO: add path thingy
                    mappings: getMappings(mod.exports),
                };
                output.push(result);
            }
            return output;
        },
        [data],
    );
    await fs.writeFile(
        './data/result.json',
        JSON.stringify(result, null, 4),
        'utf-8',
    );
    await browser.close();
})();
