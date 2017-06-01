#!/usr/bin/env node
'use strict'

var y = require('yargs')

y
  .commandDir('cmds')
  .command({
    command: '*',
    handler: argv => {
      y.showHelp()
    }
  })
  .help()
  .argv
