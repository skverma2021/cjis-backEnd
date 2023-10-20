const config = require('config');
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
const jobs = require('./routes/jobs');
const WorkPlans = require('./routes/WorkPlans');
const booking = require('./routes/booking');

const cors = require('cors');

// PS C:\uproj-three\node> $env:cjisPass="theApiUser"
// PS C:\uproj-three\node> $env:cjisJwtPvtKey="xxxyyyzzz"

const app = express();

app.use(logger);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// const PORT = process.env.PORT || 5000;
const PORT = config.get('thePort');

app.get('/', (req, res) => {
  res.status(400).json({ err: true });
});

app.use('/api/emps', emps);
app.use('/api/discipline', discipline);
app.use('/api/designation', designation);
app.use('/api/department', department);
app.use('/api/cities', cities);
app.use('/api/clients', clients);
app.use('/api/jobs', jobs);
app.use('/api/WorkPlans', WorkPlans);
app.use('/api/booking', booking);

app.listen(PORT, () =>
  console.log(
    `The server stsrted running [${config.get('appName')}]  on port: ${PORT}`
      .yellow.bold
  )
);
