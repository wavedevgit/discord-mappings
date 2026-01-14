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
    const constants = JSON.parse(
        await fs.readFile('./data/constants.json', 'utf-8'),
    );
    const data = JSON.parse(await fs.readFile('./data/data.json', 'utf-8'));
    process.on('unhandledRejection', (err) => {
        console.error('UNHANDLED PROMISE:', err);
    });

    process.on('uncaughtException', (err) => {
        console.error('UNCAUGHT EXCEPTION:', err);
    });

    await page.exposeFunction('addNeedToDo', async (item, id) => {
        const line = JSON.stringify(item);

        await fs.writeFile(
            './mappings/need_to_do/' + id + '.json',
            line,
            'utf-8',
        );
    });

    const result = await page.evaluate(
        (data, constants) => {
            //# sourceURL=getMappings.eval.js
            let _mods = Object.values(r.c);
            const chunks = Object.entries(r.m);
            const findChunkByCode = (...codes) => {
                for (let i = 0; i < chunks.length; i++) {
                    const [id, func] = chunks[i];
                    const chunkCode = func?.toString?.();

                    if (codes?.every?.((code) => chunkCode.includes(code)))
                        return [id, r(id)];
                }
            };
            const httpUtils = findChunkByCode('HTTPUtils');
            const codeH = r.m[httpUtils[0]]?.toString?.();
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
            const getMappings = (exports, id) => {
                const mappings = {};
                if (typeof exports !== 'object') return {};
                const current = [];
                for (let prop in exports) {
                    if (exports === window) continue;
                    try {
                        const bound = Reflect.get(exports, prop, exports);

                        if (typeof bound !== 'function') continue;
                        const value = bound?.toString?.();
                        for (let test of tests) {
                            if (
                                test.find_with?.every?.((find) =>
                                    value?.includes?.(find),
                                )
                            )
                                mappings[prop] = test.name;
                        }
                        if (!mappings[prop]) current.push({ code: value });
                    } catch (err) {
                        console.log(exports, err);
                    }
                }
                if (current.length > 0) addNeedToDo(current, id);
                return mappings;
            };
            window.addNeedToDo = addNeedToDo;
            const output = [];
            for (let mod of _mods) {
                if (
                    typeof mod.exports !== 'object' &&
                    !mod.exports &&
                    Object.prototype.toString.call(mod.exports) !==
                        '[object Object]'
                )
                    continue;
                try {
                    const result = {
                        id: mod.id,
                        path: '', // empty if unknown, only official paths frorm mobile app are allowed here
                        // TODO: add path thingy
                        mappings: getMappings(mod.exports, mod.id),
                    };
                    if (Object.keys(result.mappings).length !== 0)
                        output.push(result);
                } catch (err) {
                    console.log(err);
                }
            }
            output.push({
                id: httpUtils[0],
                path: '../discord_common/js/packages/http-utils/HTTPUtils.tsx',
                mappings: decodeHttpUtils(httpUtils[1]),
            });
            const constantsModule = findChunkByCode(
                '"/users/@me/relationships/".concat',
            );
            const testAll = (val, finders) => {
                for (let finder of finders) {
                    if (finder.type === 'toStringIncludes')
                        if (val.toString?.()?.includes?.(finder.value))
                            return finder;
                    if (finder.type === 'ByProps')
                        if (finder.value?.every?.((prop) => val?.[prop]))
                            return finder;
                    if (finder.type === 'eq' && finder.value === val)
                        return finder;
                    if (
                        finder.type === 'includes' &&
                        finder.value?.includes?.(val)
                    )
                        return finder;
                }
            };
            const map = (exports, finders) => {
                const mappings = {};
                for (let key in exports) {
                    const val = exports[key];
                    const match = testAll(val, finders);
                    if (match) mappings[key] = match.name;
                }
                return mappings;
            };
            output.push({
                id: constantsModule[0],
                path: '../discord_common/js/shared/Constants.tsx',
                mappings: map(constantsModule[1], constants),
            });

            return [output];
        },
        data,
        constants,
    );
    await fs.writeFile(
        './mappings/result.json',
        JSON.stringify(result[0], null, 4),
        'utf-8',
    );

    console.log('saved to result.json');
    page.removeAllListeners();
    browser.removeAllListeners();
    await browser.close();
    process.exit(0);
})();
