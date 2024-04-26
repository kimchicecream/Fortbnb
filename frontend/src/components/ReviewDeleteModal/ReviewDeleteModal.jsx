import './ReviewDeleteModal.css';
import { deleteReview } from '../../store/reviews';
import { getReviewsForSpotsById } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function ReviewDeleteModal({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(deleteReview(reviewId))
            // .then(async () => {
            //     await dispatch(getReviewsForSpotsById(spotId))
            // })
            .then(closeModal)
            // window.location.reload();
    }

    return (
        <div className='confirm-delete-container'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className='confirm-or-not-buttons'>
                <button onClick={handleDelete} className='delete-button'>Yes, delete my review</button>
                <button onClick={closeModal} className='cancel-delete-button'>No, keep my review</button>
            </div>
        </div>
    )
}

export default ReviewDeleteModal;
