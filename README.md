# Discord Mappings

Automatically generated discord mappings for rspack minified exports names

## How to use

1. Mappings are located at ./mappings/result.json
2. Either inject them to the chunks export using the [snippet](#snippet) below (soon) or make custom findByProps

## How to run

1. Install modules

```sh
npm i
```

2. run the scripts

```sh
node cleanData.js
node makeMappings.js
```

## ♥️ How to contribute

1. Contributions are welcome and appreciated
2. You can contribute by adding more data to ./data/data.json
3. Fork this repo to begin
4. Make changes to ./data/data.json (you can add more named exports with finders)
5. There is already existing unfinshed ones on ./data/undone.json or you can just use the latest client exports.

## Injection snippet (unminifer)

```js
// coming soon
// i still need to make it
```
