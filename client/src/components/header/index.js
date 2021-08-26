import React from 'react';
import { connect } from 'react-redux';
import LoginButton from '../loginButton';
import UserAccount from '../userAccount';
import { openPopup } from '../../features/login/loginSlice';
import './style.scss';

class Header extends React.Component {
  constructor(props){
    super(props);
    
  }

  render() {
    const { openPopup, isLoggedIn } = this.props;
    
    return(
      <header className="container">
        <div className="header__left">
          <div className="logo">Agilno</div>
          <nav>
            <ul>
              <li className="hover--opacity">Sports</li>
              <li className="hover--opacity">Live sports</li>
            </ul>
          </nav>
        </div>
        <div className="header__right">
          {
            isLoggedIn ? <UserAccount /> : <LoginButton onClick={() => openPopup()} />
          }
        </div>
      </header>
    )
  }
}

function mapStateToProps(state) {
  const { user: { isLoggedIn } } = state;
  
  return { 
    isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openPopup: () => dispatch(openPopup()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
