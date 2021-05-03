import jwt from 'jsonwebtoken'; //Importar jason web token
import mg from 'mailgun-js'; // Importar mailgun-js

export const generateToken = (user) => { // Exportar la constante generateToken, tendrá el parámetro user
    return jwt.sign( // Retornará jason web token sign
        { // Este objeto contiene los siguientes datos
            id: user.cod_usuario,
            nombre: user.nombre,
            email: user.email,
            is_admin: user.is_admin,
        },
        process.env.JWT_SECRET || 'somethingsecret',
        {
            expiresIn: '30d',
        }
    );
};

// Constante si es que el usuario está autorizado
export const isAuth = (req, res, next) => { // exportamos isAuth, como parámetros definimos req, res y next
    const authorization = req.headers.authorization;
    if (authorization) { // Si existe autorización
        const token = authorization.slice(7, authorization.length); //bearer xxxxxx
        jwt.verify( // Jason Web Token verifica
            token, // Token
            process.env.JWT_SECRET || 'somethingsecret', // La variable de entorno process JWT_SECRET O si esta no existe 'sometingsecret'
            (err, decode) => { // err y decode como parámetros de la función flecha
                if (err) { // Si existe error
                    res.status(401).send({ message: ' Token no válido ' }); // tendrá el mensaje de 'token no válido'
                } else { // sino
                    req.user = decode; // request.usuario igual a decode
                    next(); // Continua con las demás ejecuciones 
                }
            }
        );
    } else { // Si no existe una autorización para el usuario
        res.status(401).send({ message: 'No token ' }); // Devuelve este mensaje
    }
};

// Si es administrador
export const isAdmin = (req, res, next) => { // Exportamos la constante isAdmin, usamos los parámetros req, res y next
    if (req.user && req.user.is_admin) { // Si existe usuario y administrador en el req
        next(); // Procede con lo demás
    } else { //Si no
        res.status(401).send({ message: 'token de administrador inválido' }) // Devuelve el mensaje
    }
};

// Separador de miles
function formatoPy(number) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return number.toString().replace(exp, rep)
};

// Exportamos un objeto que contiene la key y el dominio de nuestro mailgun
export const mailgun = () =>
    mg({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    });
// Formato de email que recibirán los clientes
export const payOrderEmailTemplate = (pedido, detalle) => {
    return `<h1> Gracias por comprar con nosotros </h1>
    <p> Hola, ${pedido.nombre_completo}. </p>
    <p> Hemos terminado de procesar tu pedido </p>
    <h2> [Pedido Nro. ${pedido.nro_pedido}] (${pedido.fecha_pago.toString().substring(0, 10)}) </h2>
    <table>
    <thead>
    <tr>
    <td><strong>Artículo</strong></td>
    <td><strong>Cantidad</strong></td>
    <td><strong align="right">Precio</strong></td>
    </thead>
    <tbody>
    ${detalle
            .map(
                (item) => `
                    <tr>
                        <td>${item.nombre}</td>
                        <td align="center">${item.cantidad}</td>
                        <td align="right">gs.${formatoPy(item.precio_articulo)}</td>
                    </tr>
                    `
            )
            .join('\n')}
        </tbody>
        <tfoot>
        <tr>
        <td colspan="2">Precio articulos:</td>
        <td align="right">gs.${formatoPy(pedido.precio_productos)}</td>
        </tr>
        <tr>
        <td colspan="2">Precio Iva:</td>
        <td align="right">gs.${formatoPy(pedido.precio_iva)}</td>
        </tr>
        <tr>
        <td colspan="2">Precio envío:</td>
        <td align="right">gs.${formatoPy(pedido.precio_envio)}</td>
        </tr>
        <tr>
        <td colspan="2"><strong>Precio Total:</strong></td>
        <td align="right"><strong>gs.${formatoPy(pedido.precio_total)}</strong></td>
        </tr>
        <tr>
        <td colspan="2">Método de Pago:</td>
        <td align="right">${pedido.metodo_pago}</td>
        </tr>
        </table>
        <h2> Dirección de envío </h2>
        <p>
        ${pedido.nombre_completo}, <br/>
        ${pedido.direccion}, <br/>
        ${pedido.barrio}, <br/>
        ${pedido.ciudad}, <br/>
        </p>
        <hr/>
        <p>
        Gracias por comprar con nosotros.
        </p>
    `;
};