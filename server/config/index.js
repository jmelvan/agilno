const error = {
  fields: "All fields required.",
  email_exists: "The email has already been used.",
  validate_password: "The email or password are incorrect.",
  user_not_found: "The user doesn't exists.",
  user_not_validated: "Please, confirm your email address. Validation email has been sent.",
  user_not_admin: "You have no privilages to enter this site.",
  sport_exists: "That sport already exists.",
  team_exists: "That team already exists.",
  player_exists: "Player with the same name, surname and country playing that sport already exists.",
  competition_exists: "Competition with the same name and in same sport already exists.",
  action_not_specified: "Something's wrong with your request. Please try again."
}

const secrets = {
  jwt: "JDgK1MklGd4spCrsUgCmO9ngqSQauDxY"
}

const fields = {
  required: {
    "user/signup": ["email", "password"],
    "user/login": ["email", "password"],
    "user/deposit": ["email", "amount"],
    "sport/add": ["email", "name", "type"],
    "sport/remove": ["email", "name"],
    "teams/add": ["email", "name", "type"],
    "teams/remove": ["email", "name"],
    "teams/asign-player": ["email", "id", "player_id"],
    "player/add": ["email", "name", "surname", "sport_name", "country"],
    "player/remove": ["email", "id"],
    "player/asign-to-team": ["email", "id", "team_id"],
    "competition/add": ["email", "name", "type", "sport_name"],
    "competition/remove": ["email", "id"],
    "event/add": ["email", "host_id", "guest_id", "competition_id"],
    "event/remove": ["email", "id"],
    "event/finish-all": ["email"]
  }
}

const long_queries = {
  events: {
    get_query: 'SELECT host.name as host, host.img as host_img, guest.name as guest, guest.img as guest_img, start_time, competition.name as competition_name, competition.type as competition_type  FROM event LEFT JOIN competition ON competition_id=competition.id JOIN team as host ON host_id=host.id JOIN team as guest ON guest_id=guest.id WHERE end_time IS NULL'
  }
}

module.exports = { error, secrets, fields, long_queries };