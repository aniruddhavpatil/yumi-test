const { Router } = require('express');
const { getOrders } = require('./search');
const handleErrors = require('./middleware/handleErrors');


const v1Router = Router();
const apiRouter = Router();


v1Router.get('/orders', getOrders)

v1Router.use(handleErrors);

apiRouter.use('/v1', v1Router);

module.exports = {
    apiRouter,
};