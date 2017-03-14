var request = require('request'),
    clear   = require('clear'),
    figlet  = require('figlet'),
    inquirer    = require('inquirer'),
    chalk       = require('chalk'),
    Spinner     = require('clui').Spinner;
clear();
console.log(
  chalk.green(
    figlet.textSync('Hello!', { horizontalLayout: 'full' })
  )
);

function getLocation() {

    inquirer.prompt([ {

            type: 'input',

            name: 'location',

            message: 'What location are you searching for?  '

        },

        ]).then(function (answer) {

            var location    = answer.location.split(/\s+/).join('+');

            if (location === '+') {

                console.log('No argument was provided\n');

                exitApp();

            };

            var link = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&sensor=false';

            console.log(link);

            var status = new Spinner('Getting requested information, please wait...');

            status.start();

            request(link, function (err, res, data){

                if (err) return console.log(err);

                data = JSON.parse(data);

                status.stop();

                console.log(chalk.green('\n Result: \n'));

                //Exit if nothing was found

                if (data.results.length === 0) {

                    console.log('Nothing found \n')

                    return exitApp();

                };

                //Display location details

                console.log(chalk.yellow('Address: ') + data.results[0].formatted_address);

                console.log(chalk.yellow('Latitude: ') + data.results[0].geometry.location.lat);

                console.log(chalk.yellow('Longitude: ') + data.results[0].geometry.location.lng + '\n');

                exitApp();

            });

        }); 

}

function startApp() {

    inquirer.prompt([ {

    type: 'list',

    name: 'option',

    message: 'Press enter',

    choices: [
          'Search for a location (e.g: Lagos University)',

    ]

  } ]).then(function (answer) {

        if(answer.option === 'Search for a location (e.g: Lagos University)'){
            getLocation();
        }
    });

}

function exitApp() {

    inquirer.prompt([ {

    type: 'list',

    name: 'option',

    message: 'Exit?',

    choices: [

      'Yes',

      'No',

    ]

  } ]).then(function (answer) {

      

        if(answer.option === 'No') return startApp();

        if(answer.option === 'Yes') return console.log(chalk.yellow('=============Thanks for using this app!============='));

    });

}

startApp();