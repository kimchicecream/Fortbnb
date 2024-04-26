import './ManageSpots.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SpotItem from '../SpotItem';
import { getAllSpots, selectAllSpots } from '../../store/spots.js';

function ManageSpots() {
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots);
    const userId = useSelector(state => state.session.user.id);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllSpots())
            .then(() => {setIsLoaded(true)})
    }, [dispatch])

    const ownedSpots = spots.filter(spot => spot.ownerId === userId);

    if (!isLoaded) return null;

    return (
        <div className='manage-spots-container'>
            <h1>Manage Your Spots</h1>
            <Link to='/spots/new'>Create a New Spot</Link>
            <div className='spots-owned'>
                {ownedSpots.length > 0 ? (
                    ownedSpots.map(spot => <SpotItem key={spot.id} spot={spot} />)
                ) : (
                    <div>You have no spots listed. <Link to='/spots/new'>Create a new spot.</Link></div>
                )}
            </div>
        </div>
    )
}

export default ManageSpots;
