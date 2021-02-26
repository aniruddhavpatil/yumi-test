const connection = require('./db');
const knex = require('./knex');
const { promisify } = require('util');
const { BadRequest, GeneralError } = require('./utils/errors');

// Common query execution pattern abstracted to this function
const executeQuery = async (query) => {
    try {
        const dbConnection = promisify(connection.query).bind(connection);
        const queryString = query.toString();
        const result = await dbConnection(queryString);
        if(!result) throw new BadRequest('Query returned no result');
        return result;
    }
    catch (error){
        next(error)
    }
}

// Create a query on a table using given filters
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

const getOrdersFromDb = async (filters) => {
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

// Create appropriate filters based on the request
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
    return filters;
}

const assembleMeals = async (order, mealIds) => {
    return Promise.all(
        mealIds.map(
            async (mealId, m) => {
                order.meal_count += mealId.quantity;
                const meal = await getMeal(mealId.meal_id);
                if(!meal){
                    throw new GeneralError('Unexpected error when retrieving meal information');
                }
                meal[0].quantity = mealId.quantity;
                order.meals.push(meal[0]);
            }
        )
    )
}

const assembleOrders = async (orders) => {
    await Promise.all(
        orders.map(
        async (order, o) => {
            const mealIds = await getMealIds(order.id);
            order.meals = [];
            order.meal_count = 0;
            order.delivery_date = getDate(order.delivery_date);
            await assembleMeals(order, mealIds);
        }
    ));
    return orders;
}

const getOrders = async (req, res, next) => {
    try{
        const filters = createFilters(req);
        const result = {
            'orders': [],
        }
        const orders = await getOrdersFromDb(filters);
        if(!orders){
            throw new BadRequest('No orders retrieved from the database');
        }
        result.orders = await assembleOrders(orders);
        res.send(result);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    getOrders,
}