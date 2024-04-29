import './ManageSpots.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SpotItem from '../SpotItem';
import { getAllSpots, selectAllSpots } from '../../store/spots.js';
import OpenModalButton from '../OpenModalButton/OpenModalButton.jsx';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal.jsx';

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
        <>
            <div className='manage-spots-container'>
                <h1>Manage Your Spots</h1>
                <div className='create-spot-button'>
                    <Link to='/spots/new'>Create a New Spot</Link>
                </div>
                <div className='spots-owned-container'>
                    <div className='display-spots'>
                        {ownedSpots.length > 0 ? (
                            ownedSpots.map(spot =>
                                <SpotItem key={spot.id} spot={spot}>
                                    <div className='edit-and-delete-buttons'>
                                        <Link to={`/spots/${spot.id}/edit`}>Edit</Link>
                                        <OpenModalButton
                                            buttonText='Delete'
                                            className='delete-spot-button'
                                            modalComponent={<ConfirmDeleteModal spotId={spot.id} />}
                                        />
                                    </div>
                                </SpotItem>
                            )
                        ) : (
                            <div className='no-spots'>
                                You have no spots listed.
                                <Link to='/spots/new'>Create a new spot.</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageSpots;
