// import { useNavigate } from 'react-router-dom';
import './SpotItem.css';

function SpotItem({ spot }) {
    // const navigate = useNavigate();

    // const onClick = spotId => {
    //     navigate(`/spots/${spotId}`);
    // };

    return (
        <div className='spotitem-container'>
            <img></img>
            <div className='info-container'>
                <h3 className='city-state'>{spot.city}, {spot.state}</h3>
                <div className='price-container'>
                    <p className='price'>{spot.price}</p>
                    <p className='night-word'>night</p>
                </div>
                <div className='stars-container'>
                    <img></img>
                    <p className='avg-stars'>{spot.avgStars}</p>
                </div>

            </div>
        </div>
    )
}

export default SpotItem;
