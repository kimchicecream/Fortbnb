import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { addReview } from '../../store/reviews';
import { getReviewsForSpotsById } from '../../store/reviews';
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

    const canSubmit = reviewText.length >= 10 && stars > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (canSubmit) {
            try {
                const newReview = { review: reviewText, stars };
                await dispatch(addReview(spotId, newReview))
                    .then(() => dispatch(getReviewsForSpotsById(spotId)))
                    .then(closeModal);
            } catch (err) {
                setError(err.message);
            }
        }
    }

    return (
        <div className='review-form-container'>
            <div className='review-form-title-container'>
                    <h1>How was your stay?</h1>
            </div>

            <div className='divider'></div>

            <form className='review-form' onSubmit={(e) => handleSubmit(e)}>
                <div className='star-rating-container'>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <img
                            key={num}
                            className='gray-full-stars'
                            src={num <= stars ? '../../../stars/4.6above.png' : '../../../stars/graystar.png'}
                            onClick={() => updateStars(num)}
                            alt={`${num} Star`}
                        />
                    ))}<p>stars</p>
                </div>
                <div className='review-form-bottom'>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder='Leave your review here...'
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={!canSubmit}>Submit Your Review</button>
                </div>
            </form>
        </div>
    )
}

export default ReviewFormModal;
