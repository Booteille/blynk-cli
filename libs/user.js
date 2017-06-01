'use strict'

const u = require('./utils.js')
const fs = require('fs-extra')
const validator = require('validator')
const enquirer = require('enquirer')()
const readdir = require('readdir-enhanced')
const chalk = require('chalk')
const server = require('./server')

module.exports = {
  add: argv => {
    enquirer.question('email', 'Email: ', {
      transform: function (input) {
        return input.toLowerCase()
      },
      validate: function (input) {
        if (!input || !validator.isEmail(input)) {
          return 'Invalid email'
        }

        return true
      }
    })
    enquirer.register('password', require('prompt-password'))
    enquirer.register('confirm', require('prompt-confirm'))
    enquirer.question('password', 'Password: ', {
      type: 'password',
      mask: require('prompt-password-strength'),
      validate: function (input) {
        if (!input || input < 4) {
          return 'Password too short. 4 characters required'
        }

        return true
      }
    })
    enquirer.question('passwordConfirm', 'Confirm your password: ', {
      type: 'password',
      mask: require('prompt-password-strength'),
      validate: function (input) {
        if (!input || input < 4) {
          return 'Password too short. 4 characters required'
        }

        return true
      }
    })
    enquirer.question('isSuperAdmin', 'Is super admin? ', {type: 'confirm'})

    enquirer
      .ask(['email', 'password', 'passwordConfirm', 'isSuperAdmin'])
      .then(answers => {
        if (answers.password !== answers.passwordConfirm) {
          u.error('Passwords do not match')
        }

        if (_userExists(answers.email)) {
          u.error(`User ${answers.email} already exists`)
        }

        var user = {
          name: answers.email,
          email: answers.email,
          appName: 'Blynk',
          region: 'local',
          pass: u.hashPassword(answers.email, answers.password),
          lastModifiedTs: +new Date(),
          lastLoggedAt: 0,
          profile: {},
          isFacebookUser: false,
          isSuperAdmin: answers.isSuperAdmin,
          energy: 100000,
          id: answers.email + '-Blynk'
        }

        fs.outputJson(u.config.server.data + '/' + user.email + '.Blynk.user', user)
        .then(() => {
          u.success(`User ${user.email} added`)
        })
        .catch(err => {
          u.error(err)
        })
      })
      .catch(function (err) {
        u.error(err)
      })
  },
  cloneProjects: argv => {
    let source = _user(argv.emailSource)
    let target = _user(argv.emailTarget)

    if (!source) {
      u.error(`User ${source.email} does not exist`)
    }

    if (!target) {
      u.error(`User ${target.email} does not exist`)
    }

    server.backup({name: 'auto-cloneProfile'})

    target.profile = source.profile

    fs.writeJsonSync(_userPath(target.email), target)

    u.success(`${target.email} profile has been cloned from ${source.email}`)
    u.warning('You must restart the server to apply the effect')
  },
  get: argv => {
    let user = _user(argv.email)

    if (user) {
      if (user.hasOwnProperty(argv.key)) {
        console.log(`${argv.key}: ${user[argv.key]}`)
      } else {
        u.error(`Property not found`)
      }
    } else {
      u.error(`User ${argv.email} does not exist`)
    }
  },
  list: () => {
    if (fs.existsSync(u.config.server.data)) {
      var files = readdir.sync(u.config.server.data, {filter: '*.user'})

      files.forEach((e) => {
        console.log(e.slice(0, -'.Blynk.user'.length))
      })
    } else {
      u.error('No user found')
    }
  },
  password: argv => {
    if (argv.email) {
      _askPassword(argv.email)
    } else {
      enquirer.question('email', 'Enter email: ')

      enquirer
        .ask('email')
        .then(answers => {
          _askPassword(answers.email)
        })
    }
  },
  remove: argv => {
    if (argv.email) {
      _remove(argv.email)
    } else {
      enquirer.question('email', 'Enter email: ')

      enquirer
        .ask('email')
        .then(answers => {
          _remove(answers.email)
        })
    }
  },
  set: argv => {
    let user = _user(argv.email)

    if (user) {
      if (user.hasOwnProperty(argv.key)) {
        if (typeof user[argv.key] === typeof argv.value) {
          if (typeof user[argv.key] === 'number' && Number.isInteger(user[argv.key]) !== Number.isInteger(argv.value)) {
            u.error('Property must respect the numeric type (Float or Integer)')
          }

          if (argv.key === 'email') {
            if (!validator.isEmail(argv.value)) {
              u.error('You must provide a valid email')
            }

            if (_userExists(argv.value)) {
              u.error(`An user with the email ${argv.value} already exists`)
            }

            fs.moveSync(_userPath(argv.email), _userPath(argv.value))

            user[argv.key] = argv.value

            _updateUser(argv.value, user)
          } else if (argv.key === 'pass') {
            user.password = u.hashPassword(user.email, argv.value)

            _updateUser(argv.email, user)
          } else {
            user[argv.key] = argv.value

            _updateUser(argv.email, user)
          }

          u.success(`Property ${argv.key} set to ${argv.value}`)

          if (require('./server').isStarted()) {
            u.warning('You must restart the server to apply the effect')
          }
        } else {
          u.error(`Invalid property type. You must provide a property of type ${typeof user[argv.key]}`)
        }
      } else {
        u.error(`Property ${argv.key} not found`)
      }
    } else {
      u.error(`User ${argv.email} does not exist`)
    }
  },
  show: argv => {
    if (argv.email) {
      _show(argv.email)
    } else {
      enquirer.question('email', 'Enter email')

      enquirer
        .ask('email')
        .then(answers => {
          _show(answers.email)
        })
    }
  }
}

/** Private functions **/

function _askPassword (email) {
  let user = _user(email)

  if (user) {
    enquirer.register('password', require('prompt-password'))
    enquirer.question('password', 'Password: ', {
      type: 'password',
      mask: require('prompt-password-strength'),
      validate: function (input) {
        if (!input || input < 4) {
          return 'Password too short. 4 characters required'
        }

        return true
      }
    })
    enquirer.question('passwordConfirm', 'Confirm your password: ', {
      type: 'password',
      mask: require('prompt-password-strength'),
      validate: function (input) {
        if (!input || input < 4) {
          return 'Password too short. 4 characters required'
        }

        return true
      }
    })

    enquirer
      .ask(['password', 'passwordConfirm'])
      .then(answers => {
        if (answers.password === answers.passwordConfirm) {
          _changePassword(user, answers.password)
        } else {
          u.error('Passwords do not match')
        }
      })
      .catch(err => {
        u.error(err)
      })
  } else {
    u.error(`User ${email} not found`)
  }
}

function _changePassword (user, password) {
  user.pass = u.hashPassword(user.email, password)

  _updateUser(user.email, user)
}

function _remove (email) {
  enquirer.register('confirm', require('prompt-confirm'))
  enquirer.question('confirm', `Are you sure you want to delete user ${email}? `, {
    type: 'confirm'
  })

  if (_userExists(email)) {
    enquirer
      .ask('confirm')
      .then(answers => {
        if (answers.confirm) {
          fs.removeSync(_userPath(email))
          u.success(`User ${email} deleted`)
        }
      })
  } else {
    u.error('No user exists with this email')
  }
}

function _show (email) {
  let user = _user(email)

  if (user) {
    let label = chalk.bold
    let value = chalk.green

    console.log()
    console.log(label('Email: ') + value(user.email))
    console.log(label('Energy: ') + value(user.energy))
    console.log(label('Is Super Admin: ') + value(user.isSuperAdmin))
    console.log(label('Last Logged At: ') + value(new Date(user.lastLoggedAt).toString()))
    console.log()
  } else {
    u.error(`${email} user does not exist`)
  }
}

function _user (email) {
  if (_userExists(email)) {
    return fs.readJsonSync(_userPath(email))
  }

  return false
}

function _userExists (email) {
  if (fs.existsSync(_userPath(email))) {
    return true
  }

  return false
}

function _userPath (email) {
  if (!Object.prototype.toString.call(email) === '[object String]' || !validator.isEmail(email)) {
    u.error(`${email} is not a valid email`)
  }
  email = email.toLowerCase()
  return `${u.config.server.data}/${email}.Blynk.user`
}

function _updateUser (email, user) {
  if (_userExists(email)) {
    fs.writeJsonSync(_userPath(email), user)

    return true
  }

  return false
}
