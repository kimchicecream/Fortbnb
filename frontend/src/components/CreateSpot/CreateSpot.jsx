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
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageURLs, setImageURLs] = useState(['', '', '', '']);
    const [previewImageURL, setPreviewImageURL] = useState(['']);
    const [errors, setErrors] = useState([]);

    const validateForm = () => {
        const newErrors = {};

        if (!country) newErrors.country = "Country is required";
        if (!address) newErrors.address = "Street Address is required";
        if (!city) newErrors.city = "City is required";
        if (!state) newErrors.state = "State is required";
        if (!description) newErrors.description = "Description is required";
        if (description.length < 30) newErrors.description = "Description needs 30 or more characters";
        if (!name) newErrors.name = "Spot title is required";
        if (!price) newErrors.price = "Price per night is required";
        if (!previewImageURL) newErrors.previewImageURL = "Preview Image URL is required";

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    const handleImageUrlChange = (index, value) => {
        const newImageURLs = [...imageURLs];
        newImageURLs[index] = value;
        setImageURLs(newImageURLs);
    };

    async function onSubmit(e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const spot = {
            country, address, city, state, description, name, price
        }

        const newSpot = await dispatch(addSpot(spot));
        if (!newSpot.id) {
            const { errors } = await newSpot.json();
            setErrors(errors);
            return;
        }

        if (previewImageURL) {
            await dispatch(addSpotImage(newSpot.id, { url: previewImageURL, preview: true }));
        }

        const imagePromises = imageURLs.filter(url => url !== '').map(url => {
            return dispatch(addSpotImage(newSpot.id, { url, preview: false }));
        });

        await Promise.all(imagePromises);

        navigate(`/spots/${newSpot.id}`);
    }

    return (
        <form className="create-spot-form" onSubmit={onSubmit} noValidate>
            <div className='form-title-container'>
                <h1>Create a new spot</h1>
            </div>
            <section className='location-section'>
                <h3>Where&apos;s your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <div className='input-area'>
                    <div className='country-form'>
                        <p>Country {errors.country && <span className="error">{errors.country}</span>}</p>
                        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
                    </div>
                    <div className='address-form'>
                        <p>Street Address {errors.address && <span className="error">{errors.address}</span>}</p>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street Address" />
                    </div>
                    <div className='city-form'>
                        <p>City {errors.city && <span className="error">{errors.city}</span>}</p>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                    </div>
                    <div className='state-form'>
                        <p>State {errors.state && <span className="error">{errors.state}</span>}</p>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                    </div>
                </div>
            </section>

            <section className='description-section'>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
                <div className='input-area'>
                    <div className='description-form'>
                        <p>Describe your place</p>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please write at least 30 characters" />
                        {errors.description && <span className="error">{errors.description}</span>}
                    </div>
                </div>
            </section>

            <section className='title-section'>
                <h3>Create a title for your spot</h3>
                <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                <div className='input-area'>
                    <div>
                        <p>Spot Title {errors.name && <span className="error">{errors.name}</span>}</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name of your spot" />
                    </div>
                </div>
            </section>

            <section className='price-section'>
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <div className='input-area'>
                    <div>
                        <p>Price per night (USD) {errors.price && <span className="error">{errors.price}</span>}</p>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
                    </div>
                </div>
            </section>

            <section className='photos-section'>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <div className='input-area'>
                    <input type="text" placeholder="Preview Image URL" value={previewImageURL} onChange={(e) => setPreviewImageURL(e.target.value)} />
                    {errors.imageURLs && <p className="error">{errors.imageURLs}</p>}
                    {imageURLs.map((url, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Image URL ${index + 1}`}
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        />
                    ))}
                </div>
            </section>

            <section className='button-section'>
                <button className='create-spot-button' type="submit">Create Spot</button>
            </section>
        </form>
    );
}


export default CreateSpot;
