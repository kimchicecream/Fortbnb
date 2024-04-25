import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const headers = {
    'Content-Type': 'application/json'
}

// action types
const ADD_REVIEWS = 'reviews/addReviews';
const REMOVE_REVIEW = 'reviews/removeReview';

const addReviews = reviews => ({
    type: ADD_REVIEWS,
    reviews
});

// action creators
const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
});

// thunk actions
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

export const getReviewById = reviewId => async dispatch => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`);
        const review = await response.json();
        dispatch(addReviews([review]));
        return review;
    } catch (e) {
        return e;
    }
}

export const addReview = (spotId, review) => async dispatch => {
    try {
        console.log(review);
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
        dispatch(removeReview([+reviewId]));
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
            const newState = { ...state };
            action.reviews.forEach(review => newState[review.id] = review);
            return newState;
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

// selectors
export const selectReviews = state => state.reviews;
export const selectAllReviews = createSelector([selectReviews], reviews => Object.values(reviews || {}));

export default reviewsReducer;
