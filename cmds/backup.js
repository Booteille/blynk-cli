'use strict'

const chalk = require('chalk')

const expl = chalk.cyan
const desc = chalk.yellow

exports.command = 'backup <command>'
exports.aliases = 'b'
exports.desc = 'Manage Backups'

exports.builder = function (yargs) {
  return yargs
    .commandDir('backup')
    .example(expl('blynkcli backup create first'), desc('Create backup named "first"'))
    .example(expl('blynkcli backup remove first'), desc('Remove backup named "first" if it is the only one with that name'))
    .example(expl('blynkcli backup remove /0f25'), desc('Remove backup with uuid starting with "0f25"'))
    .example(expl('blynkcli backup remove first/0f25'), desc('Remove backup named "first" and with uuid starting with "0f25"'))
    .example(expl('blynkcli backup restore first'), desc('Restore from backup named "first"'))
}

exports.handler = function (argv) {}
