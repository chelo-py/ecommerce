//constantes de precios, nos ayudará a filtrar nuestros productos según sus precios
export const prices = [
    {
        name: 'Todo',
        min: 0,
        max: 0,
    },
    {
        name: 'Gs 5.000 a Gs 10.000',
        min: 5000,
        max: 10000,
    }, {
        name: 'Gs 10.000 a Gs 50.000',
        min: 10000,
        max: 50000,
    }, {
        name: 'Gs 50.000 a Gs 100.000',
        min: 50000,
        max: 100000,
    },
];

//constante de puntuaciones, con opciones de 1 estrella o más, hasta 4 estrellas o más
export const ratings = [
    {
        name: '4stars & más',
        rating: 4,
    },
    {
        name: '3stars & más',
        rating: 3,
    },
    {
        name: '2stars & más',
        rating: 2,
    },
    {
        name: '1stars & más',
        rating: 1,
    },
];

//Función para agregar separador de miles a los precios
export default function formatoPy(number) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return number.toString().replace(exp, rep)
};