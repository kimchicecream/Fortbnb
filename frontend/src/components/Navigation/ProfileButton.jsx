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
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
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
    navigate('/'); // navigate to home after logout
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className='icon-container'>
        <button onClick={toggleMenu}>
            <i className="fas fa-user-circle" />
        </button>
      </div>
      <div className={ulClassName} ref={ulRef}>
        <div className='divider'>
          <h4>Hello, {user.firstName}</h4>
          <p>{user.email}</p>
        </div>
        <div className='divider'>
          <Link to='/spots' onClick={() => setShowMenu(false)}>Manage Spots</Link>
        </div>
        <div className='divider'>
          <Link to='/reviews' onClick={() => setShowMenu(false)}>Manage Reviews</Link>
        </div>
        <div className='divider'>
          <div className='logout-button'>
            <button onClick={logout}>Log Out</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileButton;
