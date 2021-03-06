import 'zone.js/dist/zone-node';
import * as express from 'express';
import { ngExpressEngine } from '@nguniversal/express-engine'
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'

const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist-server/main');

const app = express();

const distFolder = __dirname + '/dist'

app.engine('html', ngExpressEngine({
   bootstrap: AppServerModuleNgFactory,
   providers: [provideModuleMap(LAZY_MODULE_MAP)]
}))

app.set('view engine', 'html')
app.set('views', distFolder)

app.get('*.*', express.static(distFolder, {maxAge: '1y'}))

app.get('*', (req, res) => {
   res.render('index', { req })
})

app.listen(9000, () => {
    console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});





