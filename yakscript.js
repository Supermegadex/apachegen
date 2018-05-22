#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

program
  .version('0.1.0')
  .usage('<domain> <recipient>')
  .option('-o --output [file]', 'absolute path to save the generated config', '/etc/apache2/sites-available/generated.conf')
  .parse(process.argv);

const domain = program.args[0],
  recipient = program.args[1];
if (domain && recipient) {
  const template = 
`<VirtualHost *:80>
  ServerName ${domain}
  ProxyPreserveHost On
  ProxyPass / http://${recipient}
  ProxyPassReverse / http://${recipient}
</VirtualHost>
`

  rl.question(`
${chalk.blue("Here is your config file:")}

${chalk.green(template)}
${chalk.blue(`Do you want to save it to ${program.output}?`)} [Y/n]`, (answer) => {
    if (answer.toLowerCase() !== 'n') {
      fs.writeFile(program.output, template, function (err) {
        if (err) {
          return console.log("Oh, oh: ", err);
        }

        console.log("The file was saved!");
      });
    }
    else {
      console.log('Ok, not saving.');
    }
    rl.close();
  });
}
else {
  console.log("Please enter a domain and recipient.");
}  
