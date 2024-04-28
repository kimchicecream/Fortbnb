import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/');
  };

  const noFeature = (e) => {
    e.preventDefault();
    alert('Feature coming soon!');
}

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='profile-button'>
      <div className='icon-container'>
        <button onClick={toggleMenu} className='profile-button-shape'>
            <div className='lines'>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <i className="fas fa-user-circle" />
        </button>
      </div>
      <div className={ulClassName} ref={ulRef}>
        <div className='name-and-email'>
          <h4>Hello, {user.firstName}</h4>
          <p>{user.email}</p>
          <h5>{user.username}</h5>
        </div>

        <div className='divider'></div>

        <div className='account-messages'>
          <Link to='/account' onClick={(e) => noFeature(e)}>
            <p>Account</p>
          </Link>
          <Link to='/messages' onClick={(e) => noFeature(e)}>
            <p>Messages</p>
          </Link>
        </div>

        <div className='divider'></div>

        <div className='manage'>
          <Link className='manage-spots' to='/spots' onClick={() => setShowMenu(false)}>
            <p>Manage Spots</p>
          </Link>
          <Link className='manage-reviews' to='/reviews' onClick={(e) => noFeature(e)}>
            <p>Manage Reviews</p>
          </Link>
        </div>

        <div className='divider'></div>

        <div className='footer-section'>
          <Link to='/help' onClick={(e) => noFeature(e)}>
            <p>Help</p>
          </Link>
          <button onClick={logout}>
            <p>Log Out</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;
