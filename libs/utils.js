'use strict'

const os = require('os')
const chalk = require('chalk')
const crypto = require('crypto-js')
const fs = require('fs-extra')

const appUserPath = os.homedir() + '/' + '.blynkcli'
const configPath = appUserPath + '/blynkcli.json'
const serverFolder = appUserPath + '/server'
const PIDFile = appUserPath + '/blynk.pid'
const tmpPath = appUserPath + '/tmp'
const defaultVersion = 'v0.33.5'

let utils = {
  appUserPath,
  configPath,
  PIDFile,
  tmpPath,

  error: (message) => {
    console.error(chalk.red.bold('[ERR] '), message)
    process.exit(1)
  },
  info: (message) => {
    console.info(chalk.bold('[INFO] ') + message)
  },
  success: (message) => {
    console.log(chalk.green.bold('[OK] ') + message)
  },
  warning: (message) => {
    console.warn(chalk.yellow.bold('[WARN] ') + message)
  },

  ensureBlynkCLIFiles: () => {
    fs.ensureDirSync(appUserPath)

    if (!fs.existsSync(configPath)) {
      let config = {
        'server': {
          'version': defaultVersion,
          'folder': serverFolder,
          'data': serverFolder + '/data',
          'properties': serverFolder + '/server.properties',
          'logs': serverFolder + '/logs',
          'backup': appUserPath + '/backup'
        }
      }

      fs.outputJsonSync(configPath, config, {
        spaces: 2
      })
    }
  },

  hashPassword: (email, password) => {
    var algo = crypto.algo.SHA256.create()
    algo.update(password, 'utf-8')
    algo.update(crypto.SHA256(email.toLowerCase()), 'utf-8')
    var hash = algo.finalize()

    return hash.toString(crypto.enc.Base64)
  },

  exec: (cmd, args, callback) => {
  	var spawn = require('child_process').spawn
  	var child = spawn(cmd, args)
  	var resp = ""

  	child.stdout.on('data', function(buffer) {
  		resp += buffer.toString()
  	})

		child.stdout.on('end', function() {
			callback(resp)
		})
  }
}

utils.ensureBlynkCLIFiles()
utils.config = fs.readJsonSync(configPath)

module.exports = utils
