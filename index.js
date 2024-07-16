'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
        .then(() => {
            console.log("Conexion a la base de datos establecida con satisfactoriamente...")

            //Creacion del servidor -- se hace por medio de la dependencia de expres
            app.listen(port, () => {
                console.log('Servidor corriendo correctamente en la url: localhost:3700')
            });
        })
        .catch(err => console.log(err))

//Nota: para activar la coneccion se debe de ejecutar col comando "npm install" en la carpeta donde estan los archivos de jSON (En este caso backend)

