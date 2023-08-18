

const {Router} = require('express');
const { crearUsuario, loginUsuario, revalidar } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validate-fields');
const { validarJWT } = require('../middlewares/validare-jwt');


const router = Router();

//Crear nuevo usuario
router.post('/new', [
    check('name','El nombre es obligatorio').not().isEmpty().isAlphanumeric(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 6}),
    validarCampos
],crearUsuario);


//Login de usuario
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 6}),
    validarCampos
],loginUsuario);

//Validar y revalidar token
router.get('/renew', validarJWT, revalidar);








module.exports = router;