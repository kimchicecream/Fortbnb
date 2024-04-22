import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  // const sessionLinks = sessionUser ?
  //   (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   ) : (
  //     <>
  //       <li>
  //         <OpenModalButton
  //           buttonText="Log In"
  //           modalComponent={<LoginFormModal />}
  //         />
  //         {/* <NavLink to="/login">Log In</NavLink> */}
  //       </li>
  //       <li>
  //         <OpenModalButton
  //           buttonText="Sign Up"
  //           modalComponent={<SignupFormModal />}
  //         />
  //         {/* <NavLink to="/signup">Sign Up</NavLink> */}
  //       </li>
  //     </>
  //   );

  return (
    // <nav className='navigation-bar'>
    //   <div className='logo'>
    //     <NavLink to='/'>Home</NavLink>
    //   </div>
    //   <ul className='session-links'>
    //     {isLoaded && sessionLinks}
    //   </ul>
    // </nav>
    <nav>
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
    // <ul>
    //   <li>
    //     <NavLink to="/">Home</NavLink>
    //   </li>
    //   {isLoaded && sessionLinks}
    // </ul>
  );
}

export default Navigation;
