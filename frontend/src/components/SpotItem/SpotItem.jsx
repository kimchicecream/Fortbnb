import { useNavigate } from 'react-router-dom';
import './SpotItem.css';

function SpotItem({ spot }) {
    const navigate = useNavigate();

    const onClick = spotId => {
        navigate(`/spots/${spotId}`);
    };

    return (
        <div className='spotitem-container'>
            <div className='image-container' onClick={() => onClick(spot.id)}>
                {spot.previewImage}
            </div>
            <div className='info-container' onClick={() => onClick(spot.id)}>
                <h3 className='city-state'>{spot.city}, {spot.state}</h3>
                <p className='price'>{spot.price} per night</p>
                <div className='stars-container'>
                    <p className='avg-stars'>{spot.avgRating}</p>
                </div>

            </div>
        </div>
    )
}

export default SpotItem;
