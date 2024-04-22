import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots, selectAllSpots } from '../../store/spots.js';
// import { getAllReviews, selectAllReviews } from '../../store/reviews.js';

import './Home.css';

function Home({ prop }) {
    // const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots);

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch])

    return (
        <div className='home-container'>
            <div className='title-container'>
                <h1>Test title</h1>
                <h2>Secure Your Spot in the Safe Zone</h2>
            </div>
            <div className='spots-container'>
                {spots.map(spot => (
                    <li key={spot.id}>
                        <h3>{spot.name}</h3>
                        {/* <p>{spot.price}</p> */}
                    </li>
                ))}
            </div>
        </div>

    )
}

export default Home;
