'use strict'

const chalk = require('chalk')

const expl = chalk.cyan
const desc = chalk.yellow

exports.command = 'user <command>'
exports.desc = 'Manage Blynk server users'
exports.aliases = 'u'

exports.builder = function (yargs) {
  return yargs
    .commandDir('user')
    .example(expl('blynkcli user clone-profile user1@blynk.cc user2@blynk.cc'), desc('Copy profile (every projects) of user1@blynk.cc to user2@blynk.cc'))
    .example(expl('blynkcli user get admin@blynk.cc energy'), desc('Display energy ammount of admin@blynk.cc'))
    .example(expl('blynkcli user set admin@blynk.cc energy 100'), desc('Change energy ammount of admin@blynk.cc to 100'))
}

exports.handler = function (argv) {}
