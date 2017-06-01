'use strict'

exports.command = 'install'
exports.desc = 'Install Blynk server from latest github release'

exports.builder = {}

exports.handler = function (argv) {
  require('../../libs/server').install()
}
