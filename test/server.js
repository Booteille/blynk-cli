'use strict'

const should = require('should')
const sinon = require('sinon')
const server = require('../libs/server')
const checkOutput = require('./helpers/utils').checkOutput
const msg = require('./helpers/utils').msg
const chalk = require('chalk')

describe('server', function () {
  describe.skip('#start()', function () {
    it('should start server if server is not running', function () {

    })
  })
  describe('#status()', function () {
    it('should log server status', function () {
      var r = checkOutput(function () {
        server.status()
      })

      r.infos[0].should.be.oneOf([msg.info('Blynk server is ' + chalk.green('online')), msg.info('Blynk server is ' + chalk.red('offline'))])
    })
  })

  describe.skip('#version()', function () {
    it('should log server version', function () {
      var r = checkOutput(function () {
        server.version()
      })

      r.logs[0].should.match('v0.24.5')
    })
  })
})
