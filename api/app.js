const express = require('express')
const cors = require('cors')
const app = express()

// const database = require('./provider/MongoDB')
// database.connect(() => {
//   console.log(`DB connection established`)
// })

const { handleError } = require('./util/Exception')

app.use(cors())

// const AuthenticationController = require('./controller/AuthenticationController')
// const ConfigurationController = require('./controller/ConfigurationController')
// const TemperatureController = require('./controller/TemperatureController')
// const GeneratorController = require('./controller/GeneratorController')
// const DashboardController = require('./controller/DashboardController')
// const AnalyticsController = require('./controller/AnalyticsController')
// const MainsController = require('./controller/MainsController')
// const BatteryController = require('./controller/BatteryController')
// const DoorController = require('./controller/DoorController')
// const SiteController = require('./controller/SiteController')
// const AuthController = require('./controller/AuthController')
// const UserController = require('./controller/UserController')
// const ACSController = require('./controller/ACSController')
// const CustomerController = require('./controller/CustomerController')

// app.use('/auth', new AuthController().register())
// app.use('/config', new ConfigurationController().register())
// app.use('/generator', new GeneratorController().register())
// app.use('/temperature', new TemperatureController().register())
// app.use('/dashboard', new DashboardController().register())
// app.use('/analytics', new AnalyticsController().register())
// app.use('/mains', new MainsController().register())
// app.use('/battery', new BatteryController().register())
// app.use('/door', new DoorController().register())
// app.use('/site', new SiteController().register())
// app.use('/user', new UserController().register())
// app.use('/acs', new ACSController().register())
// app.use('/customer', new CustomerController().register())

app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = {
  // path: '/api',
  handler: app,
}
