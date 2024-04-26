import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ message: data.message === 'Invalid credentials' ?
            'The provided credentials were invalid' : data.message });
        }
      });
  };

  const demoClick = () => {
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
      .then(closeModal);
  }

  return (
    <div className='login-modal-container'>
      <h1>Log In</h1>
      <div className='top-divider'>
        <span></span>
      </div>
      <form onSubmit={handleSubmit}>
      <label className='input-container'>
          <p>Username or Email</p>
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='input-container'>
          <p>Password</p>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className='error-message'>
          {errors.message && <p className='error'>{errors.message}</p>}
        </div>
        <button type="submit" className='login-button' disabled={credential.length < 4 || password.length < 6}>
          <h4>Log In</h4>
        </button>
      </form>
      <div className='bottom-divider'>
        <span></span>
        <p>or</p>
        <span></span>
      </div>
      <div className='bottom-buttons'>
        <button className='google-button'>
          <img src='../../../public/logos/google.png' />
          <h4>Continue with Google</h4>
        </button>
        <button className='demo' onClick={demoClick}>
          <h4>Continue with a demo user</h4>
        </button>
        <div className='dont-have-account'>
          <p>
            Don&apos;t have an account?
            <OpenModalButton
              buttonText="Sign up here"
              modalComponent={<SignupFormModal />}
              className='signup-letters'
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginFormModal;
