const config = require('config');
// const dotenv = require('dotenv');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const express = require('express');
const emps = require('./routes/emps');
const discipline = require('./routes/discipline');
const designation = require('./routes/designation');
const department = require('./routes/department');
const cities = require('./routes/cities');
const clients = require('./routes/clients');
const clientsShort = require('./routes/clientsShort');

const jobs = require('./routes/jobs');
const ExStages = require('./routes/ExStages');
const WorkPlans = require('./routes/WorkPlans');
const empBookHead = require('./routes/book');
const bookHeads = require('./routes/bookHeads');
const bookDates = require('./routes/bookDates');
const booking = require('./routes/booking');

// dotenv.config({ path: './config/config.env' });

const cors = require('cors');

//PS C:\uproj-three\node> $env:cjisPass="theApiUser"

const app = express();

app.use(logger);

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// or by using app.get('env)
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}
// app.use(logger);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// const PORT = process.env.PORT || 5000;
const PORT = config.get('thePort');

app.get('/', (req, res) => {
  // res.send('Hi from Express !');
  //res.sendStatus(400);
  //res.status(400).send('Error')
  res.status(400).json({ err: true });
});

app.use('/api/emps', emps);
app.use('/api/discipline', discipline);
app.use('/api/designation', designation);
app.use('/api/designation/short', designation);
app.use('/api/department', department);
app.use('/api/cities', cities);
app.use('/api/clients', clients);
app.use('/api/clientsShort', clientsShort);
app.use('/api/jobs', jobs);
app.use('/api/ExStages', ExStages);
app.use('/api/WorkPlans', WorkPlans);
app.use('/api/empBookHead', empBookHead);
app.use('/api/bookHeads', bookHeads);
app.use('/api/bookDates', bookDates);
app.use('/api/booking', booking);

app.listen(PORT, () =>
  console.log(
    `[${config.get('thePass')}]the server running [${config.get(
      'appName'
    )}]  on port: ${PORT}`.yellow.bold
  )
);
