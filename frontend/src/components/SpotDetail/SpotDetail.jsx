import './SpotDetail.css';

import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { getSpotById } from '../../store/spots';
import { getReviewsForSpotsById } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import ReviewDeleteModal from '../ReviewDeleteModal/ReviewDeleteModal';

function SpotDetail() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector(state => state.spots.spotById);
    const reviews = useSelector(state => state.reviews.reviewsById);
    const sessionUser = useSelector(state => state.session.user);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getSpotById(spotId))
            .then(() => setIsLoaded(true))
            dispatch(getReviewsForSpotsById(spotId))
    }, [dispatch, spotId]);

    const noFeature = () => {
        alert('Feature coming soon!');
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
            return '• 1 review';
        } else {
            return `• ${spot.numReviews} reviews`;
        }
    }

    const checkNumStars = (stars) => {
        if (stars < 1) {
            return '';
        } else if (stars === 1) {
            return '1 star •';
        } else {
            return `${stars} stars •`;
        }
    }

    const userIsNotOwner = sessionUser && sessionUser.id !== spot?.Owner?.id
    const hasReviews = reviews && Object.keys(reviews).length > 0;
    const userHasReviewed = reviews && Object.values(reviews).some(review => review.userId === sessionUser?.id)

    return (
        <>
            {isLoaded && reviews && spot && (
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
                            <div className='image-boxes' id='top-left-container'>
                                {spot.SpotImages[1]?.url && <img className='top-left-image' src={spot.SpotImages[1]?.url} />}
                            </div>
                            <div className='image-boxes' id='top-right-container'>
                                {spot.SpotImages[2]?.url && <img className='top-right-image' src={spot.SpotImages[2]?.url} />}
                            </div>
                            <div className='image-boxes' id='bottom-left-container'>
                                {spot.SpotImages[3]?.url && <img className='bottom-left-image' src={spot.SpotImages[3]?.url} />}
                            </div>
                            <div className='image-boxes' id='bottom-right-container'>
                                {spot.SpotImages[4]?.url && <img className='bottom-right-image' src={spot.SpotImages[4]?.url} />}
                            </div>
                        </div>
                    </div>

                    <div className='description-container'>
                        <div className='name-and-description'>
                            <div className='host-name'>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</div>
                            <div className='desc-divider'></div>
                            <div className='description'>{spot.description}</div>
                        </div>
                        <div className='reserve-container'>
                            <div className='price-review'>
                                <div className='price-container'>
                                    <div className='vbuck-i'>
                                        <img id='vbucks' src='../../../vbucks.png' />
                                    </div>
                                    <p className='v-price'>{spot.price.toLocaleString()}</p>
                                    <p className='per-night'>per night</p>
                                </div>
                                <div className='rating-and-star'>
                                    {displayStar()}
                                    <div className='rating'>{displayRating()}</div>
                                </div>
                            </div>
                            <div className='desc-divider'></div>
                            <button onClick={noFeature}>Reserve</button>
                        </div>
                    </div>

                    <div className='desc-dividerr'></div>

                    <div className='reviews-container'>
                        {isLoaded && reviews ? (
                            <>
                                <div className='rating-reviews'>
                                    {displayStar()}
                                    <div className='rating-review'>{displayRating()}</div>
                                </div>
                                {/* if there is a sessionUser and user is not the owner and user has not already reviewed */}
                                {isLoaded  && sessionUser && userIsNotOwner && !userHasReviewed && (
                                    <OpenModalButton
                                        buttonText='Post Your Review'
                                        className='postreview-button'
                                        modalComponent={<ReviewFormModal spotId={spot.id} />}
                                    />
                                )}
                                {/* if there are no reviews */}
                                {!hasReviews && (
                                    <div className='no-reviews'>Be the first to post a review!</div>
                                )}
                                <div className='user-reviews'>
                                    {reviews && Object.values(reviews).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map(review => (
                                            <div key={review.id} className='review'>
                                                <div className='review-owner'>{review.User?.firstName}</div>
                                                <div className='stars-date'>
                                                    <div className='star-rating'>{checkNumStars(review.stars)}</div>
                                                    <div className='review-createdAt'>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                                                </div>
                                                <div className='review-text'>{review.review}</div>
                                                {sessionUser && sessionUser.id === review.userId && (
                                                    <OpenModalButton
                                                        buttonText='Delete'
                                                        className='delete-review-button'
                                                        modalComponent={<ReviewDeleteModal reviewId={review.id} spotId={spot.id} />}
                                                    />
                                                )}
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
                                {/* if a session user is logged in and isn't the owner of the spot and hasnt already reviewed */}
                                {sessionUser && userIsNotOwner && !userHasReviewed && (
                                    <OpenModalButton
                                        buttonText='Post Your Review'
                                        className='postreview-button'
                                        modalComponent={<ReviewFormModal spotId={spot.id} />}
                                    />
                                )}

                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default SpotDetail;
