import './SpotDetail.css';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getSpotById, getReviewsForSpotsById, selectSpots } from '../../store/spots';
import { getAllReviews, selectAllReviews, getReviewById } from '../../store/reviews';

function SpotDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector(selectSpots)[spotId];
    const reviews = useSelector(selectAllReviews)
    const sessionUser = useSelector(state => state.session.user);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
        dispatch(getSpotById(spotId))
            .then(() => {
                dispatch(getReviewsForSpotsById(spotId))
                    .then(() => setIsLoaded(true));
            });
    }, [dispatch, spotId]);

    if (!spot || !isLoaded) return null;

    const onClick = () => {
        alert('Feature coming soon');
    }

    const displayRating = () => {
        if (spot.avgStarRating !== 0) {
            return <p className='rating'>{spot.avgStarRating.toFixed(1)} {checkNumReviews()}</p>
        } else {
            return <p className='rating new'>NEW</p>
        }
    }

    const displayStar = () => {
        if (spot.avgStarRating > 4.6) {
            return <img className='star-details' src='../../../public/stars/4.6above.png' />
        } else if (spot.avgStarRating < 4.5 && spot.avgStarRating > 3.6) {
            return <img className='star-details' src='../../../public/stars/4.5below.png' />
        } else if (spot.avgStarRating < 3.5 && spot.avgStarRating > 2.6) {
            return <img className='star-details' src='../../../public/stars/3.5below.png' />
        } else if (spot.avgStarRating < 2.5 && spot.avgStarRating > 1.6) {
            return <img className='star-details' src='../../../public/stars/2.5below.png' />
        } else if (spot.avgStarRating > 0) {
            return <img className='star-details' src='../../../public/stars/1.5below.png' />
        }
    }

    const checkNumReviews = () => {
        if (spot.numReviews < 1) {
            return '';
        } else if (spot.numReviews === 1) {
            return '* 1 review';
        } else {
            return `${spot.numReviews} reviews`;
        }
    }

    return (
        <div className='spot-details'>
            <div className='title-container'>
                <div className='spot-name'>{spot.name}</div>
                <div className='spot-location'>{spot.city}, {spot.state}, {spot.country}</div>
            </div>

            <div className='images-container'>
                <div className='main-image-container'>
                    <img className='main-image' src={spot.SpotImages[0]?.url} alt={`Preview of ${spot.name}`} />
                </div>
                <div className='side-images-container'>
                    <div className='top-left-container'>
                        <img className='top-left-image' src={spot.SpotImages[1]?.url} alt='Top left image' />
                    </div>
                    <div className='top-right-container'>
                        <img className='top-right-image' src={spot.SpotImages[2]?.url} alt='Top right image' />
                    </div>
                    <div className='bottom-left-container'>
                        <img className='bottom-left-image' src={spot.SpotImages[3]?.url} alt='Bottom left image' />
                    </div>
                    <div className='bottom-right-container'>
                        <img className='bottom-right-image' src={spot.SpotImages[4]?.url} alt='Bottom right image' />
                    </div>
                </div>
            </div>

            <div className='description-container'>
                <div className='host-name'>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
                <div className='description'>{spot.description}</div>
                <div className='button-container'>
                    <p className='price'>{spot.price} vbucks per night</p>
                    <div className='rating-and-star'>
                        {displayStar()}
                        <div className='rating'>{displayRating()}</div>
                    </div>
                    <button onClick={onClick}>Reserve</button>
                </div>
            </div>

            <div className='reviews-container'>
                <div className='rating-reviews'>
                    {displayStar()}
                    <div className='rating-review'>{displayRating()}</div>
                </div>
                {sessionUser && (
                    <button className='post-button'>Post Your Review</button>
                )}
                <div className='user-reviews'>
                {reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(review => (
                            <div key={review.id} className='review'>
                                <h4>{review.User.firstName}</h4>
                                <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                                <p>{review.review}</p>
                            </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default SpotDetail;
