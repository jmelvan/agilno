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
  event_exists: "Event with the same host and guest at the same time already exists.",
  quota_exists: "Quota with the same type for the same event already exists.",
  action_not_specified: "Something's wrong with your request. Please try again.",
  invalid_bet: "Something's wrong with your request. Please try again.",
  cashout_not_available: "Unfortunatelly, that betslip is not wining and not valid for cashout.",
  cashout_error: "Unfortunatelly, there has been problem with your cashout, please try again latter.",
  already_cashedout: "You have already cashed out this betslip.",
  credit_card: "We couldn't proccess the payment. Please use valid credit card."
}

const successMsg = {
  register: "Your account has been created. Please confirm you email address before login.",
  editProfile: "You have successfully changed your personal info.",
  deposit: "You have successfully transfered money to your account.",
  placeBet: "You have successfully placed bet."
}

const secrets = {
  jwt: "JDgK1MklGd4spCrsUgCmO9ngqSQauDxY"
}

const fields = {
  required: {
    "user/signup": ["email", "password"],
    "user/login": ["email", "password"],
    "user/deposit": ["amount"],
    "user/place-bet": ["quotas", "type"],
    "user/cashout": ["betslip_id"],
    "sport/add": ["name", "type", "result"],
    "sport/remove": ["name"],
    "teams/add": ["name", "type"],
    "teams/remove": ["name"],
    "teams/asign-player": ["id", "player_id"],
    "player/add": ["name", "surname", "sport_name", "country"],
    "player/remove": ["id"],
    "player/asign-to-team": ["id", "team_id"],
    "competition/add": ["name", "type", "sport_name"],
    "competition/remove": ["id"],
    "event/add": ["host_id", "guest_id", "competition_id", "start_time"],
    "event/remove": ["id"],
    "event/finish": ["id"],
    "event/finish-all": [],
    "quotas/add": ["type", "value"],
    "quotas/remove": ["id"]
  }
}

const long_queries = {
  events: {
    get_query: 'SELECT event.id as event_id, host.name as host, host.img as host_img, guest.name as guest, guest.img as guest_img, start_time, competition.name as competition_name, competition.type as competition_type, sport.name as sport_name, sport.result as quota_types FROM event LEFT JOIN competition ON competition_id=competition.id JOIN team as host ON host_id=host.id JOIN team as guest ON guest_id=guest.id JOIN sport ON competition.sport_name=sport.name WHERE end_time IS NULL',
    finish_all: 'SELECT event.id, sport.result as result FROM event JOIN competition ON competition_id=competition.id JOIN sport ON competition.sport_name=sport.name WHERE end_time IS NULL'
  },
  betslip: {
    wins_in_multiple: "SELECT betslip.id, (SELECT count(*) FROM betslip_bet JOIN betslip as b2 ON b2.id=betslip_id WHERE betslip_id=betslip.id) as total_bets, (SELECT count(*) FROM betslip_bet LEFT JOIN quota as q2 ON betslip_bet.quota_id=q2.id LEFT JOIN event as e2 ON q2.event_id=e2.id WHERE betslip_id=betslip.id AND e2.win=q2.type) as total_wins FROM betslip WHERE betslip.status='unprocessed' AND betslip.type='multiple'",
    wins_in_single: "SELECT betslip.id as betslip_id, user_email, quota.id as quota_id FROM betslip LEFT JOIN betslip_bet ON betslip_bet.betslip_id=betslip.id LEFT JOIN quota ON betslip_bet.quota_id=quota.id LEFT JOIN event ON quota.event_id=event.id WHERE betslip.status='unprocessed' AND betslip.type='single' AND event.win=quota.type",
    get_cashout_multiple: "SELECT betslip.id as betslip_id, user_email, mul_real(quota.value)*betslip.stake as cashout FROM betslip RIGHT JOIN betslip_bet ON betslip_bet.betslip_id=betslip.id JOIN quota ON betslip_bet.quota_id=quota.id WHERE betslip.type='multiple' AND betslip.id=$1 AND user_email=$2 GROUP BY betslip.id, user_email",
    get_cashout_single: "SELECT betslip.id as betslip_id, betslip.user_email, sum(quota.value*betslip_bet.stake) as cashout FROM betslip LEFT JOIN betslip_bet ON betslip_bet.betslip_id=betslip.id LEFT JOIN quota ON betslip_bet.quota_id=quota.id WHERE betslip.id=$1 AND user_email=$2 AND betslip.type='single' AND betslip_bet.status='win' GROUP BY betslip.id, betslip.user_email"
  },
  user: {
    get_bets: "SELECT betslip_id, betslip_bet.stake as quota_stake, quota.type as quota_type, quota.value as quota_value, betslip_bet.status as bet_status, betslip.stake as total_stake, betslip.type as betslip_type, betslip.status as betslip_status, host.name as host_name, guest.name as guest_name, start_time FROM betslip_bet JOIN betslip ON betslip_bet.betslip_id=betslip.id JOIN quota ON betslip_bet.quota_id=quota.id JOIN event ON quota.event_id=event.id JOIN team AS host ON event.host_id=host.id JOIN team AS guest ON event.guest_id=guest.id WHERE betslip.user_email=$1"
  }
}

module.exports = { error, secrets, fields, long_queries, successMsg };