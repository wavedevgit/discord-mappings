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
            let _mods = Object.values(r.c);
            const chunks = Object.entries(wreq.m);
            const findChunkByCode = (...codes) => {
                for (let i = 0; i < chunks.length; i++) {
                    const [id, func] = chunks[i];
                    const chunkCode = func.toString();

                    if (codes.every((code) => chunkCode.includes(code)))
                        return [id, wreq(id)];
                }
            };
            const httpUtils = findChunkByCode('HTTPUtils');
            const codeH = wreq.m[httpUtils[0]].toString();
            const decodeHttpUtils = (module) => {
                const mappings = {};
                const requestHandler = codeH.match(
                    /let (?<requestHandler>[\w_$]+)=null;function/,
                ).groups.requestHandler;
                const retryRequest = codeH.match(
                    /let (?<retryRequest>[\w_$]+)=\(\)=>Promise\.resolve\(\);function/,
                ).groups.retryRequest;
                for (let k in module) {
                    const v = module[k];
                    if (v === 50035)
                        mappings[k] = 'INVALID_FORM_BODY_ERROR_CODE';
                    if (v?.get && v?.put && v?.patch && v?.del)
                        mappings[k] = 'HTTP';
                    if (v?.toString()?.includes('HTTPResponseError'))
                        mappings[k] = 'HTTPResponseError';
                    if (
                        v
                            ?.toString?.()
                            ?.includes?.('+window.GLOBAL_ENV.API_ENDPOIN')
                    )
                        mappings[k] = 'getAPIBaseURL';
                    if (
                        v
                            ?.toString?.()
                            ?.includes?.('getAnyErrorMessageAndField')
                    )
                        mappings[k] = 'V8APIError';
                    if (v?.toString?.()?.includes?.('getFieldMessage'))
                        mappings[k] = 'V6OrEarlierAPIError';
                    if (v?.toString()?.includes?.('Array.isArray('))
                        mappings[k] = 'convertSkemaError';
                    if (v?.toString().includes(retryRequest + '='))
                        mappings[k] = 'setRetryHandler';
                    if (v.toString().includes(requestHandler + '='))
                        mappings[k] = 'setRequestHandlers';
                }
                return mappings;
            };
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
            output.push({
                id: httpUtils[0],
                path: '../discord_common/js/packages/http-utils/HTTPUtils.tsx',
                mappings: decodeHttpUtils(httpUtils[1]),
            });
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
