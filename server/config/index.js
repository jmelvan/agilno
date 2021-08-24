const error = {
  fields: "All fields required.",
  email_exists: "The email has already been used.",
  validate_password: "The email or password are incorrect.",
  user_not_found: "The user doesn't exists.",
  user_not_validated: "Please, confirm your email address. Validation email has been sent.",
  user_not_admin: "You have no privilages to enter this site.",
  sport_exists: "That sport already exists."
}

const secrets = {
  jwt: "JDgK1MklGd4spCrsUgCmO9ngqSQauDxY"
}

module.exports = { error, secrets };