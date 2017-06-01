#!/usr/bin/env node
'use strict'

var y = require('yargs')

y
  .commandDir('cmds')
  .help()
  .argv
