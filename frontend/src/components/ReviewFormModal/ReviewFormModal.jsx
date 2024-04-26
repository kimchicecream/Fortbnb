import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { addReview } from '../../store/reviews';
import { getReviewsForSpotsById } from '../../store/spots';
import './ReviewFormModal.css';

function ReviewFormModal({ spotId }) {
    const dispatch = useDispatch();

    const [reviewText, setReviewText] = useState('');
    const [stars, setStars] = useState(0);
    const [error, setError] = useState('');

    const { closeModal } = useModal();

    const updateStars = (newRating) => {
        setStars(newRating);
    }

    const canSubmit = reviewText.length >= 10;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canSubmit) {
            try {
                const response = await dispatch(addReview(spotId, { review: reviewText, stars }))
                    .then(() => {
                        dispatch(getReviewsForSpotsById(spotId))})
                    .then(closeModal)
                    window.location.reload();
                if (props.addReviewToState) {
                    props.addReviewToState(response.data);
                }
            } catch (err) {
                setError(err.message);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className='review-form-container'>
            <div className='review-form-title-container'>
                <h1>How was your stay?</h1>
            </div>
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder='Leave your review here...'
            />
            <div className='star-rating-container'>
                {[1, 2, 3, 4, 5].map((num) => (
                    <span key={num} onClick={() => updateStars(num)} style={{ color: num <= stars ? 'gold' : 'gray' }}>
                        *
                    </span>
                ))}
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={!canSubmit}>Submit Your Review</button>
        </form>
    )
}

export default ReviewFormModal;
