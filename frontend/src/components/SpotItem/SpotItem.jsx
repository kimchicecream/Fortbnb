import { useNavigate } from 'react-router-dom';
import './SpotItem.css';

function SpotItem({ spot, children }) {
    const navigate = useNavigate();

    // const [isLoaded, setIsLoaded] = useState(false);

    const onClick = spotId => {
        navigate(`/spots/${spotId}`);
    };

    const displayRating = () => {
        if (spot.avgRating !== null) {
            return <p className='avg-rating'>{spot.avgRating.toFixed(1)}</p>
        } else {
            return <p className='avg-rating new'>NEW</p>
        }
    }

    const imageUrl = spot.SpotImages && spot.SpotImages.length > 0 ? spot.SpotImages[0].url : spot.previewImage;

    const displayStar = () => {
        if (spot.avgRating === 5) {
            return <img className='star-details' src='../../../stars/4.6above.png' />
        } else if (spot.avgRating < 5 && spot.avgRating >= 4) {
            return <img className='star-details' src='../../../stars/4.5below.png' />
        } else if (spot.avgRating < 4 && spot.avgRating >= 3) {
            return <img className='star-details' src='../../../stars/3.5below.png' />
        } else if (spot.avgRating < 3 && spot.avgRating >= 2) {
            return <img className='star-details' src='../../../stars/2.5below.png' />
        } else if (spot.avgRating > 0) {
            return <img className='star-details' src='../../../stars/1.5below.png' />
        }
    }

    return (
                <div className='spotitem-container' title={`${spot.name}`}>
                <div className='image-container' onClick={() => onClick(spot.id)}>
                    <img className='image' src={imageUrl} alt={`Preview of ${spot.name}`} />
                    <div className='rating-overlay'>
                        {displayStar()}
                        <div className='rating'>{spot.avgRating ? <p className='avg-rating'>{spot.avgRating.toFixed(1)}</p> : <p className='avg-rating new'>NEW</p>}</div>
                    </div>
                </div>
                <div className='info-container' onClick={() => onClick(spot.id)}>
                    <p className='city-state'>{spot.city}, {spot.state}</p>
                    <p className='price'>{spot.price} vbucks per night</p>
                </div>
                {children}
            </div>

    )
}

export default SpotItem;
