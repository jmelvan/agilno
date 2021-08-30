import React from 'react';
import { getTeams, addTeam, deleteTeam } from '../../features/teams/teamsSlice';
import { connect } from 'react-redux';

class AdminQuotas extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      popup: false,
      name: '',
      country: '',
      selectedSport: "undefined",
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

  delete(id) {
    const { deleteTeam, getTeams } = this.props;
    deleteTeam(id).then(() => getTeams());
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNew() {
    const { addTeam, getTeams } = this.props;
    const { selectedType, name, country, selectedSport } = this.state;
    
    // check conditions
    if(name == '' || country == '' || selectedSport == "undefined") return alert('Please fill in all fields.');

    var types = {
      1: 'club',
      2: 'national'
    }
    // dispatch add team
    addTeam(name, types[selectedType], selectedSport, country).then(() => {
      this.setState({ name: '', country: '', selectedSport: "undefined", selectedType: 1 }); // return defaults
      this.startClosing(); // close popup
      getTeams(); // refresh teams
    })
  }

  render() {
    const { teams, sports } = this.props;
    const { popup, closing, country, name, selectedSport, selectedType } = this.state;

    return(
      <React.Fragment>
        <div className="slider-wrapper">
          <div className="slider-title">Teams <div className="add-new hover--opacity" onClick={() => this.setState({ popup: true })}>Add new</div></div>
          <div className="slider">
            {
              teams && teams.length ? 
                teams.map((team, i) => {
                  return <div key={i} className="admin-item admin-sport">
                    <div className="admin-item__name">{ team.name }</div>
                    <div className="admin-item__config">
                      <div>Sport:</div>
                      <div>{ team.sport_name }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Type:</div>
                      <div>{ team.type }</div>
                    </div>
                    {
                      team.type ? 
                        <div className="admin-item__config">
                          <div>Country:</div>
                          <div>{ team.country }</div>
                        </div> 
                      : ""
                    }
                    <div className="admin-item__delete hover--opacity" onClick={() => this.delete(team.id)}>Delete</div>
                  </div>
                }) 
              : <div className="slider__empty">No teams</div>
            }
          </div>
          <div className={"popup-wrapper" + (popup ? " opened" : "") + (closing ? " closing" : "")}>
            <div className="close-popup" onClick={() => this.startClosing()}></div>
            <div className="admin-popup">
              <div className="admin-popup__title">Add Team</div>
              <div className="admin-popup__row">
                <input className="admin-popup__input" type="text" name="name" placeholder="Team name" value={name} onChange={this.handleInput} />
              </div>
              <div className="admin-popup__row">
                <select name="selectedSport" onChange={this.handleInput} value={selectedSport}>
                  <option value="undefined" default disabled>Select Sport</option>
                  {
                    sports && sports.map((sport, i ) => {
                      return <option key={i} value={sport.name}>{ sport.name }</option>
                    })
                  }
                </select>
              </div>
              <div className="admin-popup__row">
                <div className="admin-popup__select">
                  <div className={"admin-popup__select-option" + (selectedType == 1 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 1 })}>Club</div>
                  <div className={"admin-popup__select-option" + (selectedType == 2 ? " selected" : "")}
                    onClick={() => this.setState({ selectedType: 2 })}>National</div>
                </div>
              </div>
              <div className="admin-popup__row">
                <input className="admin-popup__input" type="text" name="country" placeholder="Country" value={country} onChange={this.handleInput} />
              </div>
              <div className="popup__cta admin-popup__cta hover--opacity" onClick={() => this.addNew()}>Add Team</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { teams: { teams }, sports: { sports } } = state;
  
  return { 
    teams,
    sports
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTeams: () => dispatch(getTeams()),
    deleteTeam: (id) => dispatch(deleteTeam({ id: id })),
    addTeam: (name, type, sport_name, country) => dispatch(addTeam({ name: name, type: type, sport_name: sport_name, country: country }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuotas);
