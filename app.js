const express = require('express');
const cors = require('cors');
const {apiRouter} = require('./backend/api');

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());

app.use('/api', apiRouter);

app.use('/', express.static('./frontend/build'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})

