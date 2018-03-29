'use strict'

const u = require('./utils')
const os = require('os')
const fs = require('fs-extra')
const request = require('request')
const chalk = require('chalk')

const MESSAGE_JAVA_MISSING = 'Please, install java first or make sure your PATH is valid.'

var isJava8 = null


fs.ensureDirSync(u.config.server.data)

module.exports = {
  install: () => {
    if (_isInstalled()) {
      u.error('Blynk server already installed')
    }

    if (!_hasJava()) {
    	u.error(MESSAGE_JAVA_MISSING)
    }
		
    fs.ensureDirSync(u.config.server.folder)

    let downloadURL = `https://github.com/blynkkk/blynk-server/releases/download/${u.config.server.version}`

    if(_isJava8()) {
    	downloadURL += `/${_filenameJava8()}`;
    } else {
    	downloadURL += `/${_filename()}`
    }

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
        fs.writeFileSync(_path(), data, {
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

          fs.removeSync(u.config.server.folder)

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
      	let asset = _isJava8() ? 1 : 0
        let newVersion = data.tag_name
        let newDownloadURL = data.assets[asset].browser_download_url
        let newFilename = data.assets[asset].name

        if (newVersion === u.config.server.version && fs.existsSync(_path(newFilename))) {
          u.info('Your Blynk server is already up to date.')
          return
        }

        u.info(`Update ${newVersion} available. Downloading...`)
        request.get({
          url: newDownloadURL,
          encoding: null
        }, (err, res, data) => {
          if (err) {
            u.error(err)
          } else if (res.statusCode !== 200) {
            u.error(res.statusCode)
          } else {
            let isStarted = _isStarted()
            if (isStarted) {
              _stop()
            }
            require('./backup').create({name: 'auto-update'})

            fs.writeFile(_path(newFilename), data, {
              encoding: null,
              mode: 0o755
            }, (err) => {
              if (err) {
                u.error(err)
              } else {
                // Remove old server
                fs.unlink(_path(), (err) => {
                  if (err) {
                    u.error(err)
                  }
                })

                // Update config file
                u.config.server.version = newVersion

                fs.writeJson(u.configPath, u.config, {spaces: 2}, (err) => {
                  if (err) {
                    u.error(err)
                  }
                })

                u.success('Update complete')

                if (isStarted) {
                  _start()
                }
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

function _filename () {
  return `server-${u.config.server.version.substr(1)}.jar`
}

function _filenameJava8() {
  return `server-${u.config.server.version.substr(1)}-java8.jar`
}

function _isInstalled (displayError) {
  if (!fs.existsSync(_path())) {
    if (displayError) {
      u.error('You must install Blynk server first')
    } else {
      return false
    }
  }

  return true
}

function _hasJava() {
	var spawn = require('child_process').spawnSync('java', ['-version'])

	if (spawn.error) {
		return false
	}

	return true
}

function _isJava8() {
	if (null === isJava8) {

		if(!_hasJava()) {
			u.error(MESSAGE_JAVA_MISSING)
		}
		
		var version = require('child_process').execSync('java -version 2>&1 | head -n 1', {'stdio': 'pipe'}).toString()

		if ("1.8" === version.split(' ')[2].substr(1, 3)) {
			isJava8 = true
		} else {					
			isJava8 = false
		}
	}
	
	return isJava8
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

function _path (filename = null) {
	if (null === filename) {
 		var name = _isJava8() ? _filenameJava8() : _filename()
	}
	
  return `${u.config.server.folder}/${name}`
}

function _start () {
  var spawn = require('child_process').spawn

  if (!_isStarted()) {
  	
    var java = spawn('java', [
      '-jar', _path(),
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
