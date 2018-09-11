#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const packageJson = require('../package.json');

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 6) {
  console.error(
    chalk`
    You are currently running Node \n
      ${chalk.bold.red(currentNodeVersion)}
      \n
      This utility requires node versions ${chalk.bold.green(
        packageJson.engines.node
      )}. \n
      Please update your version of Node.
    `
  );
  process.exit(1);
}

require('./claims');
