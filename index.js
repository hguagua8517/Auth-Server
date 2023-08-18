
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

//console.log(process.env);



//Crear el servidor/aplicación de express
const app = express();

//Conexión de Bases de datos 
dbConnection();


//Directorio Publico
app.use(express.static('public')); 

//Cors
app.use(cors());


//Lectura y parseo del body
app.use(express.json());


 //Rutas
 app.use('/api/auth', require('./routes/auth'));
//GET
//app.get('/', (req, res)=>{
//console.log('petición en el /');

    //res.json({
      //  ok: true,
      //  msg: 'Todo salio bien',
        //uid: 1234
    //})
//});









//Callback



app.listen( process.env.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
})