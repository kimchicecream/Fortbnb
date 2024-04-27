import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';
import { getSpotById } from './spots';

const headers = {
    'Content-Type': 'application/json'
}

// action types
const ADD_REVIEWS = 'reviews/addReviews';
const REMOVE_REVIEW = 'reviews/removeReview';
const GET_REVIEW_FOR_SPOT = 'reviews/getReviewForSpot';

// action creators
const addReviews = reviews => ({
    type: ADD_REVIEWS,
    reviews
});

const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
});

const getReviewForSpot = (reviews) => ({
    type: GET_REVIEW_FOR_SPOT,
    reviews
});

// thunk actions
export const getAllReviews = () => async dispatch => {
    try {
        const response = await csrfFetch('/api/reviews');
        const { reviews } = await response.json();
        dispatch(addReviews(reviews));
        return reviews;
    } catch (e) {
        return e;
    }
}

export const getReviewById = reviewId => async dispatch => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`);
        const data = await response.json();
        dispatch(addReviews([data]));
        return data;
    } catch (e) {
        return e;
    }
}

export const addReview = (spotId, review) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers,
            body: JSON.stringify(review)
        });
        const newReview = await response.json();
        dispatch(addReviews([newReview]));

        dispatch(getSpotById(spotId));

        return newReview;
    } catch (e) {
        return e;
    }
}

export const getReviewsForSpotsById = (spotId) => async dispatch => {
    try {
        console.log("=>", spotId);
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        const { Reviews: reviews } = await response.json();
        dispatch(getReviewForSpot(reviews));
    } catch (e) {
        return e;
    }
}

export const addReviewImage = (reviewId, image) => async () => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
            method: 'POST',
            headers,
            body: JSON.stringify(image)
        });
        const newImage = await response.json();
        return newImage;
    } catch (e) {
        return e;
    }
}

export const deleteReview = reviewId => async dispatch => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });
        dispatch(removeReview(reviewId));

        dispatch(getSpotById(spotId));

        return response;
    } catch (e) {
        return e;
    }
}

// reducers
const initialState = {};

function reviewsReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_REVIEWS: {
            const newReviews = {};
            action.reviews.forEach(review => { newReviews[review.id] = review });
            return {
                ...state,
                reviewsById: { ...state.reviewsById, ...newReviews }
            }
        }
        case REMOVE_REVIEW: {
            const updatedReviews = { ...state.reviewsById };
            delete updatedReviews[action.reviewId];
            return {
                ...state,
                reviewsById: updatedReviews
            }
        }
        case GET_REVIEW_FOR_SPOT: {
            return {
                ...state,
                reviewsById: {
                    ...action.reviews.reduce((acc, review) => {
                        acc[review.id] = review;
                        return acc;
                    }, {})
                }
            };
        }
        default:
            return state;
    }
}

// selectors
export const selectReviews = state => state.reviews;
export const selectAllReviews = createSelector([selectReviews], reviews => Object.values(reviews || {}));

export default reviewsReducer;
