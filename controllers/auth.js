

const {response} = require('express');
//const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs')
const {generarJWT} = require('../helpers/jwt')

const crearUsuario = async (req, res = response)=>{
    //console.log( req.body);
   const {email, name, password} = req.body;
   //console.log(email, name, password); 
   try {
      //Verificar el email

      const usuario =  await Usuario.findOne({email});
      if (usuario){
        return res.status(400).json({
            ok: false,
            msg: 'El usuario ya exite con ese email'
        });
      }

    //Crear el usuario con el modelo
    const dbUser = new Usuario(req.body);

   //Encriptar la contraseña
   const salt = bcrypt.genSaltSync();
   dbUser.password = bcrypt.hashSync(password, salt);   


   //Generar el JWT
   const token = await generarJWT(dbUser.id, name);

   //Crear usuario en DB
    await dbUser.save();
 

   //Generar respuesta exitosa
   return res.status(201).json({
     ok: true,
     uid: dbUser.id,
     name,
     token
   });

   } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor comuniquese con el administrador'
        });
   }
 

    
}

 const loginUsuario = async (req, res = response)=>{

    const {email, password} = req.body;
    console.log(email, password);
    
    try {

        const dbUser = await Usuario.findOne({email});

        if (!dbUser){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales invalidas'
            });
        }

        //Confirmar si el password hace macth
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword){
            return res.status(400).json({
                ok: false,
                //mensaje de la contraseña invalida
                msg: 'Credenciales invalidas'
            });
        }

        //Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        //respuesta del servicio
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
          });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Comunicate con el administrador del sistema'
        })
        
    }

    
}

const revalidar = async (req, res = response)=>{

    const {uid, name} = req;
    const token = await generarJWT(uid, name);
    return res.json({
        ok: true,
        uid,
        name,
        token
    });
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidar
}