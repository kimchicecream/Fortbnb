import './ConfirmDeleteModal.css';
import { deleteSpot } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

function ConfirmDeleteModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        await dispatch(deleteSpot(spotId))
            .then(closeModal);
    }

    return (
        <div className='confirm-delete-container'>
            <h2>Confirm Delete</h2>
            {/* <div className='divider'></div> */}
            <div className='confirm-text'>
                <p>Are you sure you want to remove this spot from the listings?</p>
            </div>
            <div className='confirm-or-not-buttons'>
                <button onClick={handleDelete} className='delete-button'>Yes, delete my spot</button>
                <button onClick={closeModal} className='cancel-delete-button'>No, keep my spot</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal;
