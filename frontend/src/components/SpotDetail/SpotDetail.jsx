import './SpotDetail.css';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getSpotById, getReviewsForSpotsById, selectSpots } from '../../store/spots';
import OpenModalButton from '../OpenModalButton';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
// import { getAllReviews, selectAllReviews, getReviewById } from '../../store/reviews';

function SpotDetail() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector(selectSpots)[spotId];
    const reviews = spot ? spot.Reviews : [];
    const sessionUser = useSelector(state => state.session.user);

    const [review, setReviews] = useState(spot ? spot.Reviews : []);

    const addReviewToState = (newReview) => {
        setReviews(prevReviews => [...prevReviews, newReview]);
    }

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
        if (spot.avgStarRating === 5) {
            return <img className='star-details' src='../../../stars/4.6above.png' />
        } else if (spot.avgStarRating < 5 && spot.avgStarRating >= 4) {
            return <img className='star-details' src='../../../stars/4.5below.png' />
        } else if (spot.avgStarRating < 4 && spot.avgStarRating >= 3) {
            return <img className='star-details' src='../../../stars/3.5below.png' />
        } else if (spot.avgStarRating < 3 && spot.avgStarRating >= 2) {
            return <img className='star-details' src='../../../stars/2.5below.png' />
        } else if (spot.avgStarRating > 0) {
            return <img className='star-details' src='../../../stars/1.5below.png' />
        }
    }

    const checkNumReviews = () => {
        if (spot.numReviews < 1) {
            return '';
        } else if (spot.numReviews === 1) {
            return '* 1 review';
        } else {
            return `* ${spot.numReviews} reviews`;
        }
    }

    const userIsNotOwner = sessionUser && sessionUser.id !== spot.Owner.id;

    const hasReviews = reviews && Array.isArray(reviews) && reviews.length > 0;

    const userHasReviewed = reviews.some(review => review.userId === sessionUser?.id);

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
                {isLoaded && hasReviews ? (
                    <>
                        <div className='rating-reviews'>
                            {displayStar()}
                            <div className='rating-review'>{displayRating()}</div>
                        </div>
                        {isLoaded && !userHasReviewed && sessionUser && userIsNotOwner && (
                            <OpenModalButton
                                buttonText='Post Your Review'
                                modalComponent={<ReviewFormModal addReviewToState={addReviewToState} user={sessionUser} spotId={spot.id}/>}
                            />
                        )}
                        <div className='user-reviews'>
                        {reviews && reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(review => (
                                <div key={review.id} className='review'>
                                    <div className='review-owner'>{review.User.firstName}</div>
                                    <div className='review-createdAt'>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                                    <div className='review-text'>{review.review}</div>
                                    <div className='star-rating'>{review.stars} stars</div>
                                </div>
                            ))
                        }
                        </div>
                    </>
                ) : (
                    <>
                        <div className='rating-reviews'>
                            {displayStar()}
                        <div className='rating-review'>{displayRating()}</div>
                        </div>
                        {userIsNotOwner && (
                            <div className='no-reviews'>Be the first to post a review!</div>
                        )}
                        {isLoaded && !userHasReviewed && sessionUser && userIsNotOwner && (
                            <OpenModalButton
                                buttonText='Post Your Review'
                                modalComponent={<ReviewFormModal addReviewToState={addReviewToState} user={sessionUser} spotId={spot.id}/>}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default SpotDetail;
