import React from 'react';
import { connect } from 'react-redux';
import { toggleProfile, editProfile } from '../../features/user/userSlice';
import helpers from '../../helpers';
import './style.scss';

class Profile extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      name: '',
      surname: '',
      saveAvailable: false
    }
  }

  componentDidUpdate() {
    const { isProfileOpened, name, surname } = this.props;
    
    isProfileOpened && name != this.state.name && surname != this.state.surname && this.setState({ name: name, surname: surname });
  }

  startClosing() {
    this.setState({ closing: true }, () => this.close());
  }

  close() {
    setTimeout(() => {
      this.setState({ closing: false });
      this.props.toggleProfile();
    }, 350)
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { name, surname } = this.state;
      
      if((name != '' && this.props.name != name) || (surname != '' && this.props.surname != surname))
        this.setState({ saveAvailable: true });
      else
        this.setState({ saveAvailable: false });
    })
  }

  render() {
    const { isProfileOpened, editProfileErrorMsg, editProfileSuccessMsg, editProfile } = this.props;
    const { saveAvailable, closing } = this.state;
    
    return(
      <div className={"popup-wrapper" + (isProfileOpened ? " opened" : "") + (closing ? " closing" : "")}>
        <div className="close-popup" onClick={() => this.startClosing()}></div>
        <div className="profile">
          <div className="close-icon hover--opacity" onClick={() => this.startClosing()}><div></div></div>
          <h2 className="popup__h2">Profile</h2>
          {editProfileErrorMsg && helpers.popupMsg('error', editProfileErrorMsg)}
          {editProfileSuccessMsg && helpers.popupMsg('success', editProfileSuccessMsg)}
          <div className="grid">
            <input className="popup__input" name="name" type="text" placeholder="Name" 
              value={this.state.name}
              onChange={e => this.handleChange(e)} />
            <input className="popup__input" name="surname" type="text" placeholder="Surname" 
              value={this.state.surname}
              onChange={e => this.handleChange(e)} />
            <div className={"popup__cta profile__save-changes" + (saveAvailable ? "" : " disabled")}
              onClick={() => editProfile(this.state.name, this.state.surname)}>Save changes</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user: { name, surname, isProfileOpened, editProfileErrorMsg, editProfileSuccessMsg } } = state;
  
  return { 
    name,
    surname,
    isProfileOpened,
    editProfileErrorMsg,
    editProfileSuccessMsg
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleProfile: () => dispatch(toggleProfile()),
    editProfile: (name, surname) => dispatch(editProfile({ name: name, surname: surname }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
