import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots, selectAllSpots } from '../../store/spots.js';
import SpotItem from '../SpotItem/SpotItem.jsx';

import './Home.css';

function Home() {
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllSpots()).then(() => {
            const idSet = new Set(spots.map(spot => spot.id));
            setIsLoaded(true);
        });
    }, [dispatch])

    if (!isLoaded) return null;

    return (
        <>
            {isLoaded && (
                <div className='home-container'>
                    <div className='hero-container'>
                        <h1>Secure Your Spot in the Safe Zone</h1>
                    </div>
                    <div className='spots-container'>
                        {spots.map((spot) => (
                            <SpotItem key={spot.id} spot={spot} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Home;
