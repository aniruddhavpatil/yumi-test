import React, { useState, useEffect } from 'react';
import dotenv from 'dotenv';
import classNames from 'classnames';
import styles from './Page.module.scss';

import Orders from '../Orders';

dotenv.config();

const Page = () => {
  const getInitialState = () => (
    {
      userId: 1,
      orders: {
        upcoming: [],
        past: [],
      },
      page: 1,
      per: 4,
      pageView: 'loading',
      orderView: 'loading',
      sort: 'delivery_date',
      direction: 'asc',
    }
  );

  const initialState = getInitialState();

  const [state, setState] = useState(initialState);

  state.showUpcoming = () => {
    setState({
      ...state,
      orderView: 'upcoming',
    });
  };

  state.showPast = () => {
    setState({
      ...state,
      orderView: 'past',
    });
  };

  const showUser = (userId) => {
    setState({
      ...state,
      userId,
    });
  };

  const fetchData = async () => {
    setState({
      ...state,
      orderView: 'loading',
    });
    const data = await getOrders(state.userId);
    setState({
      ...state,
      pageView: 'loaded',
      orderView: 'upcoming',
      orders: {
        ...state.orders,
        upcoming: data.orders,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [state.userId, state.direction, state.page, state.per]);

  const createRequest = (params) => {
    let request = `${process.env.REACT_APP_API_URL}/api` + '/v1' + '/orders';

    if (params) {
      request += '?';
      params.forEach(
        (param, i) => {
          if (param.value) {
            if (i > 0) request += '&';
            request += `${param.field}=${param.value.toString()}`;
          }
        },
      );
    }

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    return [request, requestOptions];
  };

  const makeRequest = (request, requestOptions) => {
    const result = fetch(request, requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log('error', error));
    return result;
  };

  const getParams = (userId) => ([
    {
      field: 'user_id',
      value: userId,
    },
    {
      field: 'per',
      value: state.per,
    },
    {
      field: 'sort',
      value: state.sort,
    },
    {
      field: 'direction',
      value: state.direction,
    },
    {
      field: 'page',
      value: state.page,
    },
  ]);

  const getOrders = (userId) => {
    const params = getParams(userId);
    const [request, requestOptions] = createRequest(params);
    const result = makeRequest(request, requestOptions);
    return result;
  };

  const checkPage = () => {
    if (
      state.orders.upcoming.length >= state.per
      || state.orders.past.length >= state.per) return true;
    return false;
  };

  const nextPage = () => {
    setState({
      ...state,
      page: checkPage() ? state.page + 1 : state.page,
    });
  };

  const prevPage = () => {
    setState({
      ...state,
      page: state.page > 1 ? state.page - 1 : state.page,
    });
  };

  const getClassName = (name) => {
    const className = classNames(styles.item, {
      [styles.active]: state.orderView === name,
    });
    return className;
  };

  const sortAsc = () => {
    setState({
      ...state,
      direction: 'asc',
    });
  };

  const sortDesc = () => {
    setState({
      ...state,
      direction: 'desc',
    });
  };

  const setPagination = (per) => {
    setState({
      ...state,
      per,
    });
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>All Deliveries</h2>
      <div>
        <button className={styles.button} onClick={() => showUser(1)}>
          User 1
        </button>
        <button className={styles.button} onClick={() => showUser(2)}>
          User 2
        </button>
        <button className={styles.button} onClick={() => sortAsc()}>
          Date Ascending
        </button>
        <button className={styles.button} onClick={() => sortDesc()}>
          Date Descending
        </button>
        <button className={styles.button} onClick={() => setPagination(2)}>
          Pagination = 2
        </button>
        <button className={styles.button} onClick={() => setPagination(4)}>
          Pagination = 4
        </button>
      </div>
      <div className={styles.navpanel}>
        <span className={getClassName('upcoming')} onClick={() => state.showUpcoming()}>
          Upcoming Orders
        </span>
        <span className={getClassName('past')} onClick={() => state.showPast()}>
          Past Orders
        </span>
      </div>
      <Orders {...state} />
      <button onClick={() => prevPage()}>
        Previous Page
      </button>
      <button onClick={() => nextPage()}>
        Next Page
      </button>
    </div>
  );
};

export default Page;
