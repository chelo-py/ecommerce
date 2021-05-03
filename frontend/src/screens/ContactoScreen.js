import React from 'react'
import { faFacebookF, faInstagram } from '../../node_modules/@fortawesome/free-brands-svg-icons/index'
import { FontAwesomeIcon } from '../../node_modules/@fortawesome/react-fontawesome/index'

export default function ContactoScreen() {
    return (
        <main className="contenedor">
            <h1 className="titulo-contacto">Atención al Cliente</h1>
            <div className="grid-formulario">
                <form className="formulario">
                    <fieldset>
                        <legend>Hable con nosotros por medio del formulario abajo o
                        alguno de los medios de comunicación al lado:</legend>
                        <div className="flex-campos">
                            <div className="grid-campo">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese su nombre."
                                />
                            </div>
                            <div className="grid-campo">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="Ingrese su Correo Electrónico."
                                />
                            </div>
                            <div className="grid-campo">
                                <label>Ciudad</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese su Ciudad."
                                />
                            </div>
                            <div className="grid-campo">
                                <label>Teléfono</label>
                                <input
                                    type="tel"
                                    placeholder="Ingrese su número de teléfono."
                                />
                            </div>
                            <div className="grid-campo">
                                <label>Asunto</label>
                                <input
                                    type="text"
                                    placeholder="Ingrese el asunto de su consulta."
                                />
                            </div>
                            <div className="grid-campo margen-textArea">
                                <label>Mensaje</label>
                                <textarea className="text-area"></textarea>
                            </div>
                            <div className="check">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked
                                        onClick="unchecked"
                                    />
                                Me gustaría recibir ofertas y promociones en mi email.
                            </label>
                            </div>

                        </div>
                        <div className="flex-input-submit">
                            <input
                                className="input-submit"
                                type="submit"
                                value="Enviar"
                            />
                        </div>
                    </fieldset>
                </form>
                <section className="tiendas-subtitulos">
                    <h2>Tiendas</h2>
                    <div className="tiendas">
                        <p className="negrita">Apolo - Ciudad del Este </p>
                        <p>Ruta PY 02, KM 13, - Lado Monday</p>
                        <p>Ciudad Del Este, Paraguay</p>
                        <p>Tel: +595 61 580 250 </p>
                        <p>Email: <a href="mailto:sac@apolo.com.py"> sac@apolo.com.py</a> </p>
                    </div>
                    <div className="tiendas">
                        <p className="negrita"> Apolo - Encarnación </p>
                        <p>Horacio Gonzalez 1429</p>
                        <p>Encarnación, Paraguay</p>
                        <p>Tel: </p>
                        <p>Email: <a href="mailto:sac@apolo.com.py"> sac@apolo.com.py</a> </p>
                    </div>
                    <div className="tiendas">
                        <p className="negrita"> Apolo - Villa Elisa </p>
                        <p>Río Salado 316 y Río Montelindo.</p>
                        <p>Villa Elisa, Paraguay</p>
                        <p>Tel: +595 21 514 864</p>
                        <p>Email: <a href="mailto:sac@apolo.com.py"> sac@apolo.com.py</a> </p>
                    </div>
                    <div>
                        <h2>Redes Sociales</h2>
                        <a
                            className="icono"
                            href="https://www.facebook.com/ApoloImportSA/"
                            target="_blank"
                            rel="noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a
                            className="icono"
                            href="https://www.instagram.com/apoloimport.py/"
                            target="_blank"
                            rel="noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </div>
                </section>
            </div>
        </main>
    )
}
