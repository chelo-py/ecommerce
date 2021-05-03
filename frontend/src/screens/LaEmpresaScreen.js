import React from 'react'

export default function LaEmpresaScreen() {
    return (
        <div>
            <main className="margen contenedor">
                <h1 className="titulo__empresa">Apolo</h1>
                <div className="contenido-empresa">
                    <img className="img-la-empresa" src="../images/apolo.png" alt="imagen apolo" />
                    <div className="texto-empresa">
                        <h2>ACERCA DE NOSOTROS</h2>
                        <p>Brindamos una atención diferenciada a nuestros
                        clientes, ofreciendo productos de calidad a un precio
                        justo. Presentes en todo el país!
                    </p>
                        <h2>NUESTRA EMPRESA</h2>
                        <p>Somos una empresa con larga trayectoria en el
                        mercado paraguayo, estamos ubicados en los
                        principales lugares estratégicos del país, para ofrecer
                        servicio y rapidez a nuestros clientes. Estamos entre
                        las 100 mayores empresas del Paraguay en
                        facturación, la 3 mayor empresa en distribución de
                        productos de consumo masivo.
                    </p>
                        <h2>CENTROS DE DISTRIBUCIÓN</h2>
                        <p>Asunción, Ciudad del Este, Encarnación, Pedro Juan
                        Caballero
                    </p>
                        <h2>MISIÓN</h2>
                        <p>Generar valor agregado a nuestros clientes</p>
                        <h2>VISIÓN</h2>
                        <p>Ser la empresa referente en todos los negocios en los
                        que actúa.
                    </p>
                        <h2>VALORES</h2>
                        <div className="interlineado">
                            <p>-Ofrecer un servivio diferenciado al cliente.</p>
                            <p>-Contar con un equipo capacitado y comprometido.</p>
                            <p>-Tener el foco en los resultados.</p>
                            <p>-Trabajar con transparencia.</p>
                            <p>-Mantener la sustentabilidad Económica, Social y
                                Ambiental.</p>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}
