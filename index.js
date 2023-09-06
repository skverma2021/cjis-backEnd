// const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
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

const cors = require('cors');
const app = express();
app.use(cors());

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [new winston.transports.Console()],
// });
// if (!config.get('jwtPrivateKey')) {
//   console.error('FATAL ERROR: jwtPrivateKey not defined');
//   process.exit(1);
// }

// console.log(`Environment info provided by Node: ${process.env.NODE_ENV}`);
// console.log(`Environment info provided by Express: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

// if (app.get('env') == 'development') app.use(morgan('tiny'));

const port = process.env.PORT || 3000;

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

// Access-Control-Allow-Origin: http://localhost:3001
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
// Access-Control-Allow-Origin and Access-Control-Allow-Methods.

app.get('/', (req, res) => {
  res.send('Hi');
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

// app.use('/api/WorkPlans/jobId', WorkPlans);

app.listen(port, () =>
  console.log(`the server started listening at port: ${port}`)
);
