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
      <img className='logo-png' src='../../../public/navigation-logo.png' />
      </Link>
      { isLoaded && (sessionUser ? (
        <div className='logged-in'>
          <Link to='/spots/new'>Create a New Spot</Link>
          <ProfileButton user={sessionUser} />
        </div>
      ) : (
        <div className='signup-login-container'>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      ))}
    </nav>
  );
}

export default Navigation;
