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
      <Link className='logo' to='/'>Fortbnb</Link>
      { isLoaded && (sessionUser ? (
        <div className='logged-in'>
          <Link to='/spots'>Create a New Spot</Link>
          <ProfileButton user={sessionUser} />
        </div>
      ) : (
        <div>
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
