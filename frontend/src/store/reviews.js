import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const headers = {
    'Content-Type': 'application/json'
}

const ADD_REVIEWS = 'reviews/addReviews';
const REMOVE_REVIEW = 'reviews/removeReview';

const addReviews = reviews => ({
    type: ADD_REVIEWS,
    reviews
});

const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
});

export const getAllReviews = () => async dispatch => {
    try {
        const response = await csrfFetch('/api/reviews');
        const { Reviews: reviews } = await response.json();
        dispatch(addReviews([reviews]));
        return reviews;
    } catch (e) {
        return e;
    }
}

export const getReviewById = () => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        const review = await response.json();
        dispatch(addReviews([review]));
        return review;
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
        return newReview;
    } catch (e) {
        return e;
    }
}

export const addReviewImage = (reviewId, image) => async dispatch => {
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
        dispatch(removeReview([+reviewId]));
        return response;
    } catch (e) {
        return e;
    }
}

export const selectReviews = state => state.reviews;

export const selectAllReviews = createSelector(selectReviews, reviews => {
    return Object.values(reviews);
});

const initialState = {};

function reviewsReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_REVIEWS: {
            const newState = { ...state };
            action.reviews.forEach(review => newState[review.id] = review);
            return newReview;
        }
        case REMOVE_REVIEW: {
            if (state[action.reviewId] === undefined) return state;
            const newState = { ...state };
            delete newState[action.reviewId];
            return newState;
        }
        default:
            return state;
    }
}

export default reviewsReducer;
