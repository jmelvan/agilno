import React from 'react';
import { deleteSport, getSports, addSport } from '../../features/sports/sportsSlice';
import { connect } from 'react-redux';

class AdminSports extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      popup: false,
      selectedResults: 1,
      selectedType: 1
    }
    this.handleInput = this.handleInput.bind(this);
  }

  startClosing() {
    this.setState({ closing: true }, () => this.close());
  }

  close() {
    setTimeout(() => {
      this.setState({ closing: false, popup: false });
    }, 350)
  }

  delete(name) {
    const { deleteSport, getSports } = this.props;
    deleteSport(name).then(() => getSports());
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNew() {
    const { addSport, getSports } = this.props;
    const { name, selectedResults, selectedType } = this.state;

    if(name == '') return;

    var results = {
      1: ["1", "2", "x"],
      2: ["1", "2"]
    }
    var type = {
      1: "team",
      2: "individual"
    }
    // dispatch add sport
    addSport(name, type[selectedType], results[selectedResults]).then(() => {
      this.setState({ name: '', selectedType: 1, selectedResults: 1 }); // return defaults
      this.startClosing(); // close popup
      getSports(); // refresh sport list
    })
  }

  render() {
    const { sports } = this.props;
    const { popup, closing, selectedResults, selectedType, name } = this.state;

    return(
      <React.Fragment>
        <div className="slider-wrapper">
          <div className="slider-title">Sports <div className="add-new hover--opacity" onClick={() => this.setState({ popup: true })}>Add new</div></div>
          <div className="slider">
            {
              sports && sports.length ? 
                sports.map((sport, i) => {
                  return <div key={i} className="admin-item admin-sport">
                    <div className="admin-item__name">{ sport.name }</div>
                    <div className="admin-item__config">
                      <div>Possible results:</div>
                      <div>{ sport.result.join(', ') }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Type:</div>
                      <div>{ sport.type }</div>
                    </div>
                    <div className="admin-item__delete hover--opacity" onClick={() => this.delete(sport.name)}>Delete</div>
                  </div>
                }) 
              : <div className="slider__empty">No sports</div>
            }
          </div>
          <div className={"popup-wrapper" + (popup ? " opened" : "") + (closing ? " closing" : "")}>
            <div className="close-popup" onClick={() => this.startClosing()}></div>
            <div className="admin-popup">
              <div className="admin-popup__title">Add Sport</div>
              <div className="admin-popup__row">
                <input className="admin-popup__input" type="text" name="name" placeholder="Name" value={name} onChange={this.handleInput} />
              </div>
              <div className="admin-popup__row">
                <div className="admin-popup__select">
                  <div className={"admin-popup__select-option" + (selectedResults == 1 ? " selected" : "")} 
                    onClick={() => this.setState({ selectedResults: 1 })}>1, 2, x</div>
                  <div className={"admin-popup__select-option" + (selectedResults == 2 ? " selected" : "")} 
                    onClick={() => this.setState({ selectedResults: 2 })}>1, 2</div>
                </div>
              </div>
              <div className="admin-popup__row">
                <div className="admin-popup__select">
                  <div className={"admin-popup__select-option" + (selectedType == 1 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 1 })}>Team</div>
                  <div className={"admin-popup__select-option" + (selectedType == 2 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 2 })}>Individual</div>
                </div>
              </div>
              <div className="popup__cta admin-popup__cta hover--opacity" onClick={() => this.addNew()}>Add Sport</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { sports: { sports } } = state;
  
  return { 
    sports
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSports: () => dispatch(getSports()),
    deleteSport: (name) => dispatch(deleteSport({ name: name })),
    addSport: (name, type, result) => dispatch(addSport({ name: name, type: type, result: result }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSports);
