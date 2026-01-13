(async () => {
    // TODO: add result.json url here
    const mappings = await (await fetch('')).json();
    for (let chunk of mappings) {
        const cachedChunk = wreq.c[chunk.id];
        for (let [k, v] of Object.entries(chunk.mappings)) {
            Object.defineProperty(cachedChunk.exports, v, {
                enumerable: true,
                configurable: true,
                set: undefined,
                get: Object.getOwnPropertyDescriptor(cachedChunk.exports, k)
                    .get,
            });
        }
    }
})();
