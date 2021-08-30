import React from 'react';
import { deleteCompetition, getCompetitions, addCompetition } from '../../features/competitions/competitionsSlice';
import { connect } from 'react-redux';

class AdminCompetitions extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      popup: false,
      selectedSport: "undefined",
      selectedType: 1,
      name: ''
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

  delete(id) {
    const { deleteCompetition, getCompetitions } = this.props;
    deleteCompetition(id).then(() => getCompetitions());
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNew() {
    const { addCompetition, getCompetitions } = this.props;
    const { selectedSport, selectedType, name } = this.state;

    if(name == '' || selectedSport == "undefined") return alert('Please fill in all fields.');
    var types = {
      1: 'national',
      2: 'club',
      3: 'individual',
    }
    addCompetition(name, types[selectedType], selectedSport).then(() => {
      this.setState({ name: '', selectedType: 1, selectedSport: "undefined" }); // return defaults
      this.startClosing(); // close popup
      getCompetitions(); // refresh competitions list
    })
  }

  render() {
    const { competitions, sports } = this.props;
    const { popup, closing, selectedSport, selectedType, name } = this.state;

    return(
      <React.Fragment>
        <div className="slider-wrapper">
          <div className="slider-title">Competitions <div className="add-new hover--opacity" onClick={() => this.setState({ popup: true })}>Add new</div></div>
          <div className="slider">
            {
              competitions && competitions.length ? 
                competitions.map((competition, i) => {
                  return <div key={i} className="admin-item admin-sport">
                    <div className="admin-item__name">{ competition.name }</div>
                    <div className="admin-item__config">
                      <div>Type:</div>
                      <div>{ competition.type }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Sport:</div>
                      <div>{ competition.sport_name }</div>
                    </div>
                    <div className="admin-item__delete hover--opacity" onClick={() => this.delete(competition.id)}>Delete</div>
                  </div>
                })
              : <div className="slider__empty">No competitions</div>
            }
          </div>
          <div className={"popup-wrapper" + (popup ? " opened" : "") + (closing ? " closing" : "")}>
            <div className="close-popup" onClick={() => this.startClosing()}></div>
            <div className="admin-popup">
              <div className="admin-popup__title">Add Competition</div>
              <div className="admin-popup__row">
                <input className="admin-popup__input" type="text" name="name" placeholder="Name" value={name} onChange={this.handleInput} />
              </div>
              <div className="admin-popup__row">
                <div className="admin-popup__select">
                  <div className={"admin-popup__select-option" + (selectedType == 1 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 1 })}>National</div>
                  <div className={"admin-popup__select-option" + (selectedType == 2 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 2 })}>Club</div>
                  <div className={"admin-popup__select-option" + (selectedType == 3 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 3 })}>Individual</div>
                </div>
              </div>
              <div className="admin-popup__row">
                <select name="selectedSport" onChange={this.handleInput} value={selectedSport}>
                  <option value="undefined" default disabled>Select sport</option>
                  {
                    sports && sports.map((sport, i ) => {
                      return <option key={i} value={sport.name}>{ sport.name }</option>
                    })
                  }
                </select>
              </div>
              <div className="popup__cta admin-popup__cta hover--opacity" onClick={() => this.addNew()}>Add Competition</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { sports: { sports }, competitions: { competitions } } = state;
  
  return { 
    competitions,
    sports
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCompetitions: () => dispatch(getCompetitions()),
    deleteCompetition: (id) => dispatch(deleteCompetition({ id: id })),
    addCompetition: (name, type, sport_name) => dispatch(addCompetition({ name: name, type: type, sport_name: sport_name }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCompetitions);
