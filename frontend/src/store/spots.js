import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

const headers = {
    'Content-Type': 'application/json'
}

// action types
const LOAD_SPOTS = 'spots/loadSpots';
const REMOVE_SPOT = 'spots/removeSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const LOAD_SPOT_BY_ID = 'spots/loadSpotById';

// action creators
const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
});

const removeSpot = spotId => ({
    type: REMOVE_SPOT,
    spotId
});

const loadSpotById = spots => ({
    type: LOAD_SPOT_BY_ID,
    spots
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
        const response = await fetch(`/api/spots/${spotId}`);
        const spot = await response.json();
        dispatch(loadSpotById(spot));
        return spot;
    } catch (e) {
        return e;
    }
}

export const addSpot = (spotData) => async dispatch => {
    try {
        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            headers,
            body: JSON.stringify(spotData)
        });

        if (response.ok) {
            const newSpot = await response.json();
            dispatch({ type: 'ADD_SPOT', payload: newSpot });
            return newSpot;
        }
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

export const updateSpot = (spotId, spotData) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(spotData)
        });
        const updatedSpot = await response.json();
        dispatch({
            type: 'UPDATE_SPOT',
            payload: updatedSpot
        })
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
            const newSpots = {};
            action.spots.forEach(spot => newSpots[spot.id] = spot)
            return newSpots;
        }
        case REMOVE_SPOT: {
            const updatedState = { ...state };
            delete updatedState[action.spotId];
            return updatedState;
        }
        case UPDATE_SPOT:
            const updatedSpot = action.payload;
            const currentSpot = state[updatedSpot.id] || {};
            updatedSpot.numReviews = updatedSpot.reviews.length;
            updatedSpot.avgStarRating = updatedSpot.reviews.reduce((acc, review) => acc + review.stars, 0) / updatedSpot.reviews.length;
            return {
                ...state,
                [updatedSpot.id]: {
                    ...currentSpot,
                    ...updatedSpot
                }
            };
        case LOAD_SPOT_BY_ID:
        return {
            ...state,
            ["spotById"]: action.spots
        };
        default:
                return state;
    }
}

// selectors
export const selectSpots = state => state.spots;
export const selectAllSpots = createSelector([selectSpots], spots => Object.values(spots || {}));

export default spotsReducer;
