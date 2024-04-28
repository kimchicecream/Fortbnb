import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  useEffect(() => {
    setDisableButton(!email || !firstName || !lastName || !confirmPassword ||
      username.length < 4 || password.length < 6)
  }, [email, username, firstName, lastName, password, confirmPassword]);

  return (
    <div className='signup-modal-container'>
      <h1>Sign Up</h1>
      <div className='top-divider'>
        <span></span>
      </div>
      <form onSubmit={handleSubmit}>
        <label className='input-container'>
          <p> {errors.email && <p className='errors'>{errors.email}</p>}</p>
          <input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className='input-container'>
          <p> {errors.username && <p className='errors'>{errors.username}</p>}</p>
          <input
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className='input-container'>
          <p> {errors.firstName && <p className='errors'>{errors.firstName}</p>}</p>
          <input
            type="text"
            placeholder='First name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className='input-container'>
          <p> {errors.lastName && <p className='errors'>{errors.lastName}</p>}</p>
          <input
            type="text"
            placeholder='Last name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label className='input-container'>
          <p> {errors.password && <p className='errors'>{errors.password}</p>}</p>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className='input-container'>
          <p> {errors.confirmPassword && <p className='errors'>{errors.confirmPassword}</p>}</p>
          <input
            type="password"
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className='signup-button' disabled={disableButton}>
          <h4>Join Fortbnb!</h4>
        </button>
      </form>
      <div className='bottom-divider'>
        <span></span>
        <p>or</p>
        <span></span>
      </div>
      <div className='bottom-buttons'>
        <button className='continue-with-button'>
          <img src='../../../logos/google.png' />
          <h4>Continue with Google</h4>
        </button>
        <button className='continue-with-button'>
          <img src='../../../logos/steam.png' />
          <h4>Continue with Steam</h4>
        </button>
        <button className='continue-with-button'>
          <img src='../../../logos/epic.png' />
          <h4>Continue with Epic Games</h4>
        </button>
        <div className='already-have-account'>
            <p>
                Already have an account? <OpenModalButton className='login-letters' buttonText=' Click here to login' modalComponent={<LoginFormModal />} />.
            </p>
        </div>
      </div>
    </div>
  );
}

export default SignupFormModal;
