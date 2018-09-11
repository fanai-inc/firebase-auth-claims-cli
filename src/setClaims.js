'use strict';

const chalk = require('chalk');
const admin = require('firebase-admin');
const jq = require('node-jq');
const inquirer = require('inquirer');
const to = require('await-to-js').default;

const setClaims = async (email, claims, options) => {
  // fetch user account information by email address

  if (options.verbose) {
    console.log(chalk.magenta(`Getting user account information...`));
  }

  const [userRetrievalError, user] = await to(
    admin.auth().getUserByEmail(email),
  );

  if (userRetrievalError || !user) {
    console.log(
      chalk.red(
        `Error:
      User not found, unable to set custom claims.
      `,
      ),
    );
    process.exit(1);
  }

  if (user.customClaims) {
    const [existingClaimsError, existingClaims] = await to(
      jq.run('.', user.customClaims, { input: 'json', output: 'pretty' }),
    );
    if (!existingClaimsError) {
      console.log(chalk.magenta(`Current custom claims: ${existingClaims}`));
    }
  }

  const [parsedClaimsError, parsedClaims] = await to(
    jq.run('.', claims, { input: 'string', output: 'json' }),
  );

  if (parsedClaimsError) {
    console.log(
      chalk.red(
        `Error:
      ${e}
      `,
      ),
    );
    process.exit(1);
  }

  let addCustomClaims = true;

  if (!options.force) {
    const prompt = inquirer.createPromptModule();
    const [confirmationError, confirmation] = await to(
      prompt({
        type: 'confirm',
        name: 'choice',
        message: 'Are you sure you want to add the claims to this user?',
      }),
    );

    if (confirmationError) {
      console.log(chalk.red(`Error receiving confirmation of setting claims.`));
      process.exit(1);
    }

    addCustomClaims = confirmation.choice;
  }

  if (addCustomClaims) {
    if (options.verbose) {
      console.log(chalk.magenta(`Setting custom claims...`));
    }

    // Add custom claims for additional privileges.
    // This will be picked up by the user on token refresh or next sign in on new device.
    const [customClaimError] = await to(
      admin.auth().setCustomUserClaims(user.uid, parsedClaims),
    );

    if (customClaimError) {
      console.log(
        chalk.red(
          `Error:
        Unable to set custom claim:

        ${customClaimError}
        `,
        ),
      );
      process.exit(1);
    }

    console.log(chalk.green(`Success!!`));
  } else {
    console.log(chalk.magenta(`Aborting custom claims update`));
  }

  process.exit(0);
};

module.exports = setClaims;
