import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const headers = {
    'Content-Type': 'application/json'
}

// action types
const LOAD_SPOTS = 'spots/loadSpots';
const REMOVE_SPOT = 'spots/removeSpot';
const ADD_REVIEW_TO_SPOT = 'spots/addReviewToSpot';

// action creators
const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
});

const removeSpot = spotId => ({
    type: REMOVE_SPOT,
    spotId
});

const addReviewToSpot = (spotId, reviews) => ({
    type: ADD_REVIEW_TO_SPOT,
    spotId,
    reviews
});

// thunk actions
export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');
    if (response.ok) {
        const data = await response.json();
        const spots = data.Spots;
        dispatch(loadSpots(spots));
    } else {
        return await response.json();
    }
}

export const getSpotById = spotId => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        const spot = await response.json();
        dispatch(loadSpots([spot]));
        return spot;
    } catch (e) {
        return e;
    }
}

export const getReviewsForSpotsById = spotId => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        const { Reviews:reviews } = await response.json();
        dispatch(addReviewToSpot(+spotId, reviews));
        return reviews;
    } catch (e) {
        return e;
    }
}

export const addSpot = spot => async dispatch => {
    try {
        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            headers,
            body: JSON.stringify(spot)
        });
        const newSpot = await response.json();
        dispatch(loadSpots([newSpot]));
        return newSpot;
    } catch (e) {
        return e;
    }
}

export const addSpotImage = (spotId, image) => async () => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/images`, {
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

export const updateSpot = (spotId, spot) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(spot)
        });
        const updatedSpot = await response.json();
        dispatch(loadSpots([updatedSpot]));
        return updatedSpot;
    } catch (e) {
        return e;
    }
}

export const deleteSpot = (spotId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE'
        });
        dispatch(removeSpot(+spotId));
        return response;
    } catch (e) {
        return e;
    }
}

// reducers
const initialState = {};

function spotsReducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_SPOTS: {
            const newState = { ...state };
            action.spots.forEach(spot => newState[spot.id] = spot)
            return newState;
        }
        case REMOVE_SPOT: {
            const updatedState = { ...state };
            delete updatedState[action.spotId];
            return updatedState;
        }
        case ADD_REVIEW_TO_SPOT: {
            if (!state[action.spotId]) return state;
            const newStateWithReview = { ...state };
            const existingReviews = newStateWithReview[action.spotId].Reviews || [];
            newStateWithReview[action.spotId].Reviews = [...existingReviews, ...action.reviews.filter(r => !existingReviews.find(er => er.id === r.id))];
            return newStateWithReview;
        }
        default:
            return state;
    }
}

// selectors
export const selectSpots = state => state.spots;
export const selectAllSpots = createSelector([selectSpots], spots => Object.values(spots || {}));

export default spotsReducer;
