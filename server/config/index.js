const error = {
  fields: "All fields required.",
  email_exists: "The email has already been used.",
  validate_password: "The email or password are incorrect.",
  user_not_found: "The user doesn't exists.",
  user_not_validated: "Please, confirm your email address. Validation email has been sent."
}

const secrets = {
  jwt: "JDgK1MklGd4spCrsUgCmO9ngqSQauDxY"
}

module.exports = { error, secrets };