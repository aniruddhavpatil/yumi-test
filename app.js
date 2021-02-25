const express = require('express');
const mysql = require('mysql')
const connection = require('./db');
const knex = require('./knex');
const handleErrors = require('./middleware/handleErrors');
const { BadRequest } = require('./utils/errors');

const app = express();
const port = 3000;
const { promisify } = require('util');



app.get('/', (req, res) => {
  res.send('Hello World!')
})

// connection.connect();

const executeQuery = async (query) => {
    try {
        const dbConnection = promisify(connection.query).bind(connection);
        const queryString = query.toString();
        // console.log(queryString);
        const result = await dbConnection(queryString);
        if(!result) throw new BadRequest('Query returned no result');
        return result;
    }
    catch (error){
        next(error)
    }
}

const queryConstructor = (table, filters) => {
    const query = knex(table);
    if(filters.selectors){
        filters.selectors.forEach((selector) => {
            query.where(selector.field, selector.value);
        })
    }
    if(filters.sort){
        query.orderBy(filters.sort, filters.direction);
    }
    if(filters.page){
        query.limit(filters.per).offset((filters.page - 1) * filters.per);
    }
    return query;
}

const getOrders = async (filters) => {
    // const query = knex('orders');
    // query.where('user_id', userId);
    const query = queryConstructor('orders', filters);
    return await executeQuery(query);
}

const getMealIds = async (orderId) => {
    const query = knex('order_attributes');
    query.where('order_id', orderId);
    return await executeQuery(query);
}

const getMeal = async (mealId) => {
    const query = knex('meals');
    query.where('id', mealId);
    return await executeQuery(query);
}

const getDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
}

const convertDate = (date) => {
    return getDate(new Date(date));
}

const createFilters = (req) => {
    const userId = req.query['user_id'];
    const deliveryDate = req.query['delivery_date'];
    if(!userId){
        throw new BadRequest('User Id is Required')
    }
    const sort = req.query['sort'];
    const direction = req.query['direction'] ? req.query['direction'] : 'asc';
    const page = req.query['page'] ? parseInt(req.query['page']) : 1;
    const per = req.query['per'] ? parseInt(req.query['per']) : 4;
    const selectors = [];

    if(userId){
        selectors.push({field: 'user_id', value: userId});
    }
    if(deliveryDate){
        selectors.push({field: 'delivery_date', value: convertDate(deliveryDate)});
    }


    const filters = {
        selectors,
        sort,
        direction,
        page,
        per
    }
    console.log(filters);
    return filters;
}


app.get('/api/v1/orders', async (req, res, next) => {

    try{
        // const temp = knex.select().from('orders').toString();
        // console.log(temp);
        // res.send(temp);

        const filters = createFilters(req);
        const result = {
            'orders': [],
        }
        
        const orders = await getOrders(filters);
        if(!orders){
            throw new BadRequest('No orders retrieved from the database');
        }
        result.orders = orders;
        
        await Promise.all(
            result.orders.map(
            async (order, o) => {
                const mealIds = await getMealIds(order.id);
                // console.log(i, mealIds);
                order.meals = [];
                order.meal_count = 0;
                order.delivery_date = getDate(order.delivery_date);
                await Promise.all(
                    mealIds.map(
                        async (mealId, m) => {
                            order.meal_count += mealId.quantity;
                            // console.log('mealId', mealId.meal_id);
                            const meal = await getMeal(mealId.meal_id);
                            // console.log('meal', meal);
                            meal[0].quantity = mealId.quantity;
                            order.meals.push(meal[0]);
                        }
                    )
                )
            }
        ));
        res.send(result);
    }
    catch (err) {
        next(err);
    }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(handleErrors);
