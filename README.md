[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Project Code For Google Mobile Web Nano Degree
Part 1

🐠🌊

Make sure you have python 2.x installed, and serve the site locally with  
`$ python -m SimpleHTTPServer 10000`  
and open in chrome at:  http://localhost:10000/  

Or just use the npm script which does the same thing  
`npm run serve`

Storing the google maps api key in an env var.  
  Checking your env  
  `$ printenv `

  Setting an env var
  `$ export NEW_VAR="something awesome"`

  Accessing your new env var in the code.
  `process.env(NEW_VAR)`

This project has a separate JSON server, to simulate fetching data from an external API.  
It is a SailsJS server.  
To start the SailsJS server, do the following...  

In a new terminal  
`$ cd jsonServer`  
`$ npm install`  
`$ npm run start`  to start the server.  

Verify it is running by navigating to **http://localhost:1337/restaurants** in your browser, and geting the restaurants JSON.  
Further information about the jsonServer is available in the README.md inside the folder.  



