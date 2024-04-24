import './CreateSpot.css';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSpot, addSpotImage } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

function CreateSpot() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [imageURLs, setImageURLs] = useState(['', '', '', '', '']);
    const [errors, setErrors] = useState([]);

    const validateForm = () => {
        const newErrors = {};

        if (!country) newErrors.country = "Country is required";
        if (!address) newErrors.address = "Street Address is required";
        if (!city) newErrors.city = "City is required";
        if (!state) newErrors.state = "State is required";
        if (!description) newErrors.description = "Description is required";
        if (description.length < 30) newErrors.description = "Description needs 30 or more characters";
        if (!title) newErrors.title = "Spot title is required";
        if (!price) newErrors.price = "Price per night is required";
        if (!imageURLs[0]) newErrors.imageURLs = "Preview Image URL is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const spotData = {
                country, address, city, state, description, title, price,
                images: imageURLs.filter(url => url !== '') // Filter out empty URLs
            };
            dispatch(addSpot(spotData))
                .then(newSpot => {
                    if (newSpot) {
                        navigate(`/spots/${newSpot.id}`);
                    }
                });
        }
    };

    return (
        <form className="create-spot-form" onSubmit={handleSubmit} noValidate>
            <div>
                <label>
                    Country {errors.country && <span className="error">{errors.country}</span>}
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
                </label>
            </div>
            <div>
                <label>
                    Street Address {errors.address && <span className="error">{errors.address}</span>}
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" />
                </label>
            </div>
            <div>
                <label>
                    City {errors.city && <span className="error">{errors.city}</span>}
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                </label>
            </div>
            <div>
                <label>
                    State {errors.state && <span className="error">{errors.state}</span>}
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                </label>
            </div>
            <div>
                <label>
                    Describe your place {errors.description && <span className="error">{errors.description}</span>}
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please write at least 30 characters" />
                </label>
            </div>
            <div>
                <label>
                    Spot Title {errors.title && <span className="error">{errors.title}</span>}
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name of your spot" />
                </label>
            </div>
            <div>
                <label>
                    Price per Night (USD) {errors.price && <span className="error">{errors.price}</span>}
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
                </label>
            </div>
            <div>
                <label>
                    Preview Image URL {errors.imageURLs && <span className="error">{errors.imageURLs}</span>}
                    <input type="text" value={imageURLs[0]} onChange={(e) => {
                        const newImageURLs = [...imageURLs];
                        newImageURLs[0] = e.target.value;
                        setImageURLs(newImageURLs);
                    }} placeholder="Preview Image URL" />
                </label>
            </div>
            <button type="submit">Create Spot</button>
        </form>
    );
}


export default CreateSpot;
