import React from 'react'

export default function listaMarcasScreen(props) {
    const { marca } = props;
    return (
        <ul>
            <li key={marca.cod_marca} className="margen-cero-marcas">
                <a href={`/marca/${marca.cod_marca}`}>
                    <img className="marca"
                        src={marca.logo}
                        alt={marca.nombre}
                    />
                </a>
            </li>
        </ul>
    )
}
