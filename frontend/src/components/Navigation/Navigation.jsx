import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className='navigation-container'>
      <Link className='logo' to='/'>
      <img className='logo-png' src='../../../logo-purple.png' />
      </Link>
      { isLoaded && (sessionUser ? (
        <div className='logged-in'>
          <Link className='create-spot-button' to='/spots/new'>
            <h4>Create a New Spot</h4>
          </Link>
          <ProfileButton user={sessionUser} />
        </div>
      ) : (
        <div className='signup-login-container'>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            className='login-button'
          />
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            className='signup-button'
          />
        </div>
      ))}
    </nav>
  );
}

export default Navigation;
