import * as functions from 'firebase-functions';
// import * as angularUniversal from 'angular-universal-express-firebase'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const ssrApp = angularUniversal.trigger({
//     index: __dirname + '/index-server.html',
//     main: __dirname + '/main',
//     enableProdMode: true,
//     cdnCacheExpiry: 600,
//     browserCacheExpiry: 300,
//     staleWhileRevalidate: 120
//   });

import 'zone.js/dist/zone-node';
import * as express from 'express';
import { enableProdMode } from  '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine'
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'

const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./main');

//Faster server renders
enableProdMode()


// Express server
const app = express();

const distFolder = __dirname
console.log('distFolder:', distFolder)

app.engine('html', ngExpressEngine({
   bootstrap: AppServerModuleNgFactory,
   providers: [provideModuleMap(LAZY_MODULE_MAP)] 
}) as any) 

app.set('view engine', 'html')
app.set('views', distFolder)

app.get('*.*', express.static(distFolder, {maxAge: '1y'}))

app.get('*', (req, res) => {
   res.render('index-server.html', { req })
})

app.listen(9000, () => {
    console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});

export const ssrApp = functions.https.onRequest(app);
