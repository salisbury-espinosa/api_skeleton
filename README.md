# btcapi

Btc api

## Install It
```
npm install && flow-typed install
```

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Run in *production* mode:

```
npm run compile
npm start
```

### Try It
* Point you're browser to [http://localhost:5000](http://localhost:5000)
* Invoke the example REST endpoint
  1. `curl http://localhost:5000/api/v1/ping/test`
  2. `curl http://localhost:5000/api/v1/tx/42f9df54a39026ccb54362141c41713968f19e1f14949ab6609b03ffa4b7f120`


### Tree of server
```
tree server/
server/
├── api.js
├── controllers
│   ├── controller.js
│   ├── index.js
│   ├── ping.js
│   └── tx.js
├── data
│   └── bitcoin_tx_list.js
├── flow-typed
│   └── bitcoin.js
├── index.js
├── lib
│   ├── logger.js
│   └── utils.js
├── middleware
│   ├── HttpServer.js
│   └── Routes.js
└── services
    └── bitcoin.js
```
