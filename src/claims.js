'use strict';

const chalk = require('chalk');
const program = require('commander');
const envinfo = require('envinfo');
const initializeApp = require('./utils/initializeApp');
const packageJson = require('../package.json');
const setClaims = require('./setClaims');

program.version(packageJson.version);

program
  .command('claim [serviceAccountConfig]')
  .description('Set or update a custom claim on a user account')
  .option(
    '-e, --email <email>',
    `provide a specific email address to perform the account claim update against.`,
  )
  .option(
    '-c, --claims <claims>',
    `provide the custom claims to be set or updated on a user.`,
  )
  .action((serviceAccountConfig, options) => {
    initializeApp(serviceAccountConfig, options);

    const { email = null, claims = null } = options;
    const mergedOptions = Object.assign({ verbose: program.verbose }, options);

    if (email && claims) {
      setClaims(email, claims, mergedOptions);
    } else {
      console.log(
        chalk.red(
          `Error:
        Either email or claims parameters were not provided.
        Please check that you've supplied an email using

        ${chalk.cyan('-e or --email')}

        and a claim to set or update via

        ${chalk.cyan('-c or --claims')}`,
        ),
      );
      process.exit(1);
    }
  });

program
  .option('--verbose', 'print additional logs')
  .option('--info', 'print environment debug info')
  .on('--help', () => {
    console.log();
    console.log(
      `    Only ${chalk.green(
        '[serviceAccountConfig]',
      )} is required if not set as an environmental variable.`,
    );
    console.log();
    console.log(
      `    ${chalk.green(
        '[serviceAccountConfig]',
      )} is the path to the admin sdk service account configuration.
         Or it is alternatively set via the environmental variable ${chalk.green(
           '$GOOGLE_APPLICATION_CREDENTIALS',
         )}
         See [Authentication Getting Started](${chalk.cyan(
           'https://cloud.google.com/docs/authentication/getting-started',
         )})
      `,
    );
    console.log();
    console.log(
      `    For more information on how to obtain this config see:
    [Admin SDK setup](${chalk.cyan(
      'https://firebase.google.com/docs/admin/setup',
    )})`,
    );
    console.log();
    console.log(
      `    If a document is given then a collection is also required.`,
    );
    console.log();
    console.log(
      `    Usage:
           ${chalk.magenta('claim|c [serviceAccountConfig] [options]')}`,
    );
    console.log(
      `    If you have any problems, do not hesitate to file an issue:`,
    );
    console.log(
      `    ${chalk.cyan(
        'https://github.com/fanai-inc/firestore-utils/issues',
      )}`,
    );
    console.log();
  });

if (program.info) {
  console.log(chalk.bold.cyan('\nEnvironment Info:'));
  envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmPackages: ['react', 'react-dom', 'react-scripts'],
      },
      {
        clipboard: false,
        duplicates: true,
        showNotFound: true,
      },
    )
    .then(console.log);
}

program.parse(process.argv);
