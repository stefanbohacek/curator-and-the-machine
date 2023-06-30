import express  from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';

import indexRoute from './routes/index.js';
import appRoute from './routes/app.js';
import artRoute from './routes/art.js';

const app = express();

app.use(compression());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({limit: '50mb'}));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/', indexRoute)
app.use('/app', appRoute)
app.use('/art', artRoute)

export default app;
