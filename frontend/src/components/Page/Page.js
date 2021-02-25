import React, {useState, useEffect} from 'react';
import styles from './Page.module.scss';
const Page = () => {
    const initialState = {
        orders: {
            upcoming: [],
            past: [],
        },
        page: 1,
        per: 4,
        pageView: 'loading',
        orderView: 'loading',
    }
    const [state, setState] = useState(initialState);
    // console.log(state);

    useEffect(() => {
        console.log(state);
    }, [state])

    const nextPage = () => {
        setState({
            ...state,
            page: state.page + 1,
        })
    }
    const prevPage = () => {
        setState({
            ...state,
            page: state.page > 1 ? state.page - 1 : state.page,
        })
    }


    return (
        <div className={styles.page}>
            <h2>All Deliveries</h2>
            <button onClick={() => nextPage()}>
                Plus plus
            </button>
            <button onClick={() => prevPage()}>
                Minus minus
            </button>
        </div>
    )
}

export default Page;