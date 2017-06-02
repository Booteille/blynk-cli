'use strict'

const u = require('./utils')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

const backupsLock = u.config.server.backup + '/backups.lock'

module.exports = {
  create: argv => {
    require('./server').isInstalled(true)
    _create(argv.name)
  },
  list: () => {
    const backups = fs.readJsonSync(backupsLock)

    backups.forEach((e) => {
      _display(e)
    })
  },
  remove: argv => {
    let backup = _backup(argv.name)
    let backupPath = _backupPath(backup)

    const enquirer = require('enquirer')()

    enquirer.register('confirm', require('prompt-confirm'))
    enquirer.question('confirm', `Are you sure you want to delete backup '${backupPath}'? `, {
      type: 'confirm'
    })

    enquirer
      .ask('confirm')
      .then(function (answers) {
        if (answers.confirm) {
          let lock = fs.readJsonSync(backupsLock)

          lock.splice(lock.findIndex(function (e) {
            return e.uuid === backup.uuid
          }), 1)

          fs.removeSync(backupPath)

          fs.outputJsonSync(backupsLock, lock)

          u.success(`Backup '${backupPath}' removed`)
        } else {
          u.info('Aborting...')
        }
      })
  },
  restore: argv => {
    const server = require('./server')

    server.isInstalled(true)

    let backup = _backup(argv.name)

    if (backup.server_version <= u.config.server.version) {
      let isStarted = server.isStarted()
      if (isStarted) {
        server.stop()
      }

      fs.copySync(_backupPath(backup), u.config.server.data)

      u.success('Restored from backup ' + _backupPath(backup))

      if (isStarted) {
        server.start()
      }
    } else {
      u.error(`You can't restore backup from version newer than the installed Blynk server (Backup version: ${backup.server_version})`)
    }
  }
}

function _backup (path) {
  const splitPath = path.split('/', 2)
  const name = splitPath[0]
  const uuid = splitPath[1]

  const lock = fs.readJsonSync(backupsLock)

  let matchedBackups = []

  lock.forEach(e => {
    if (uuid) {
      if (name) {
        if (e.name.startsWith(name) && e.uuid.startsWith(uuid)) {
          matchedBackups.push(e)
        }
      } else {
        if (e.uuid.startsWith(uuid)) {
          matchedBackups.push(e)
        }
      }
    } else {
      if (e.name.startsWith(name)) {
        matchedBackups.push(e)
      }
    }
  })

  if (matchedBackups.length) {
    if (matchedBackups.length > 1) {
      u.warning(`There are ${matchedBackups.length} backup found with corresponding name:`)

      matchedBackups.forEach(e => {
        _display(e)
      })

      u.error('Please, retry with one of these backups')
    } else {
      return matchedBackups[0]
    }
  } else {
    u.error(`There is no backup matching the name '${name}/${uuid}'`)
  }
}

function _backupPath (backup) {
  return u.config.server.backup + '/' + backup.name + '/' + backup.uuid
}

function _create (name) {
  const uuid = require('uuid').v4()
  const backupNamePath = `${u.config.server.backup}/${path.normalize(name)}`
  const backupPath = `${backupNamePath}/${uuid}`

  let lock = []

  if (fs.existsSync(backupsLock)) {
    lock = fs.readJsonSync(backupsLock)
  }

  lock.unshift({
    name: name,
    uuid: uuid,
    date: new Date().toString(),
    server_version: u.config.server.version
  })

  fs.ensureDirSync(backupNamePath)
  fs.outputJsonSync(backupsLock, lock, {
    spaces: 2
  })

  fs.copy(u.config.server.data, backupPath, err => {
    if (err) {
      u.error(err)
    }

    u.success('Backup done! You can find it in ' + backupPath)
  })
}

function _display (backup) {
  console.log(chalk.cyan(chalk.bold(`${backup.name}`) + `/${backup.uuid}`) + ' ' + chalk.gray(backup.date))
}
