import './SpotDetail.css';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpotById, getReviewsForSpotsById, selectSpots } from '../../store/spots';

function SpotDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector(selectSpots)[spotId];
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getSpotById(spotId))
            .then(() => dispatch(getReviewsForSpotsById(spotId)));
    }, [dispatch, spotId]);

    if (!spot) return null;

    return (
        <div className='spot-details'>
            <div className='title-container'>
                <div className='spot-name'>{spot.name}</div>
                <div className='spot-location'>{spot.city}, {spot.state}, {spot.country}</div>
            </div>
        </div>
    )
}

export default SpotDetail;
