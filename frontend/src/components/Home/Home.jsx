import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots, selectAllSpots } from '../../store/spots.js';
import SpotItem from '../SpotItem/SpotItem.jsx';

import './Home.css';

function Home() {
    // const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllSpots()).then(() => {
            setIsLoaded(true);
        });
    }, [dispatch])

    if (!isLoaded) return null;

    return (
        <div className='home-container'>
            <div className='title-container'>
                <h1>Test title</h1>
                <h2>Secure Your Spot in the Safe Zone</h2>
            </div>
            <div className='spots-container'>
                {spots.map(spot => (
                    <SpotItem key={spot.id} spot={spot} />
                ))}
            </div>
        </div>

    )
}

export default Home;
