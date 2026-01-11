- main file: `result.json`

> result.json:

```ts
interface Chunk {
    /**
     * Chunk ID
     **/
    id: string;
    /**
     * Chunk Path
     * Empty if unknown
     * Taken from mobile app
     * @example ../discord_common/js/shared/Constants.tsx
     **/
    path: string;
    /**
     * Mappings of each export
     * The mappings are most of the time official or match the naming style of discord
     * @example { J9 -> convertSkemaError, Jt -> setRetryHandler, K0 -> getAPIBaseURL, Pd -> HTTPResponseError, f$ -> INVALID_FORM_BODY_ERROR_CODE, lg -> setRequestHandlers, sX -> V8APIError, tn -> HTTP, yZ -> V6OrEarlierAPIError }
     **/
    mappings: Record<string, string>;
}
type Result = Chunk[];
```
