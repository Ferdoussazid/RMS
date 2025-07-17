class AppError extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const { statusCode = 400, message, response = {} } = err
  // console.log(`api response error`, err, err.response)

  const { data = {} } = response
  res.status(statusCode).json({ message, ...data })
}

module.exports = {
  AppError,
  handleError,
}
