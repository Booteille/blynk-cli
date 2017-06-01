'use strict'

const u = require('./utils')
const os = require('os')
const fs = require('fs-extra')
const request = require('request')
const chalk = require('chalk')

module.exports = {
  install: () => {
    if (_isInstalled()) {
      u.error('Blynk server already installed')
    }

    // Check if Java exists
    var spawn = require('child_process').spawnSync('java', ['-version'])

    if (spawn.error) {
      u.error('Please, install java first or make sure your PATH is valid.')
    }

    fs.ensureDirSync(u.serverFolder)

    var downloadURL = 'https://github.com/blynkkk/blynk-server/releases/download/' + u.config.server.version + '/' + u.config.server.filename

    u.info(`Downloading Blynk server ${u.config.server.version}`)

    request.get({
      url: downloadURL,
      encoding: null
    }, (err, res, data) => {
      if (err) {
        u.error(err)
      } else if (res.statusCode !== 200) {
        u.error(res.statusCode)
      } else {
        // Write downloaded file to server path
        fs.writeFileSync(u.config.server.path, data, {
          encoding: null,
          mode: 0o755
        })

        u.info('Creating default configuration')

        fs.writeFileSync(u.config.server.properties, 'admin.email=admin@blynk.cc\nadmin.pass=fablab\nlogs.folder=' + u.config.server.logs, {
          mode: 0o644
        })

        u.success('Installation complete')
      }
    })
  },
  isInstalled: displayError => {
    return _isInstalled(displayError)
  },
  isStarted: () => {
    return _isStarted()
  },
  restart: () => {
    _isInstalled(true)
    _stop()
    _start()
  },
  start: () => {
    _isInstalled(true)
    _start()
  },
  status: () => {
    _isInstalled(true)

    if (_isStarted()) {
      u.info('Blynk server is ' + chalk.green('online'))
    } else {
      u.info('Blynk server is ' + chalk.red('offline'))
    }
  },
  stop: () => {
    _isInstalled(true)
    _stop()
  },
  uninstall: () => {
    _isInstalled(true)

    const enquirer = require('enquirer')()

    enquirer.register('confirm', require('prompt-confirm'))
    enquirer.question('confirm', 'Are you sure you want to uninstall Blynk server? ', {
      type: 'confirm'
    })

    enquirer
      .ask('confirm')
      .then(answers => {
        if (answers.confirm) {
          _stop()

          fs.removeSync(u.serverFolder)

          u.success('Uninstall complete')
        } else {
          u.info('Aborting...')
        }
      })
  },
  update: () => {
    _isInstalled(true)

    var lastAPIURL = 'https://api.github.com/repos/blynkkk/blynk-server/releases/latest'

    request.get({
      url: lastAPIURL,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        u.error(err)
      } else if (res.statusCode !== 200) {
        u.error('Status: ' + res.statusCode)
      } else {
        let lastVersion = data.tag_name
        let lastDownloadURL = data.assets[0].browser_download_url
        let lastFilename = data.assets[0].name

        if (lastVersion === u.config.server.version && fs.existsSync(u.serverFolder + '/' + lastFilename)) {
          u.info('Your Blynk server is already up to date.')
          return
        }

        u.info('Update ' + lastVersion + ' available. Downloading...')
        request.get({
          url: lastDownloadURL,
          encoding: null
        }, (err, res, data) => {
          if (err) {
            u.error(err)
          } else if (res.statusCode !== 200) {
            u.error(res.statusCode)
          } else {
            _stop()
            require('./backup')._create('auto-update')

            // Update config file
            var oldServer = u.config.server.path
            u.config.server.version = lastVersion
            u.config.server.path = u.serverFolder + '/' + lastFilename
            u.config.server.filename = lastFilename

            fs.writeFile(u.config.server.path, data, {
              encoding: null,
              mode: 0o755
            }, (err) => {
              if (err) {
                u.error(err)
              } else {
                // Remove old server
                fs.unlink(oldServer, (err) => {
                  if (err) {
                    u.error(err)
                  }
                })

                fs.writeJson(u.configPath, u.config, {spaces: 2}, (err) => {
                  if (err) {
                    u.error(err)
                  }
                })

                u.success('Update complete')

                _start()
              }
            })
          }
        })
      }
    })
  },
  version: () => {
    _isInstalled(true)

    console.log(u.config.server.version)
  }
}

function _isInstalled (displayError) {
  if (!fs.existsSync(u.config.server.path)) {
    if (displayError) {
      u.error('You must install Blynk server first')
    } else {
      return false
    }
  }

  return true
}

function _isStarted () {
  if (fs.existsSync(u.PIDFile)) {
    let pid = fs.readFileSync(u.PIDFile, 'utf-8')

    if (!isNaN(pid)) {
      try {
        process.kill(pid, 0)
        return pid
      } catch (err) {}
    }
  }

  return false
}

function _start () {
  var spawn = require('child_process').spawn

  if (!_isStarted()) {
    var java = spawn('java', [
      '-jar', u.config.server.path,
      '-dataFolder', u.config.server.data,
      '-serverConfig', u.config.server.properties
    ], {
      stdio: [
        'ignore',
        fs.openSync(os.tmpdir() + '/blynk.log', 'a'),
        fs.openSync(os.tmpdir() + '/blynk.log', 'a')
      ],
      detached: true
    })
    fs.writeFileSync(u.PIDFile, java.pid)

    java.unref()

    u.success('Blynk server started')
  } else {
    u.info('Server already started')
  }
}

function _stop () {
  var pid = _isStarted()
  if (pid) {
    try {
      process.kill(pid, 'SIGTERM')

      // Remove PID file
      fs.removeSync(u.PIDFile)

      u.success('Blynk server stopped')
    } catch (err) {
      u.error(err)
    }
  } else {
    u.info('Blynk server already stopped.')
  }
}
