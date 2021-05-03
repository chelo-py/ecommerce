import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import crearMarca from '../actions/marcaActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function CrearMarcaScreen() {

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [logo, setLogo] = useState('');
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const marcaCreate = useSelector((state) => state.marcaCreate);
    const { loading, success, error } = marcaCreate;

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(crearMarca(nombre, descripcion, logo))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await Axios.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                },
            });
            setLogo(data);
            setLoadingUpload(false)
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false)
        }
    }

    return (
        <div className="margen contenedor">
            <h1 className="margen-iz-2">Crear Marcas</h1>
            {success && (
                <MessageBox
                    variant="success">Marca creada con éxito
                </MessageBox>
            )}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <form className="form" onSubmit={submitHandler}>
                        <div>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                placeholder="Ingrese el nombre"
                                id="nombre"
                                required
                                onChange={(e) => setNombre(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="descripcion">Descripción</label>
                            <input
                                type="text"
                                placeholder="Ingrese una descripcion"
                                id="descripcion"
                                required
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="logo">Logo</label>
                            <input
                                type="text"
                                placeholder="Ingrese el logo"
                                id="logo"
                                required
                                value={logo}
                                onChange={(e) => setLogo(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="imageFile">Image File</label>
                            <input
                                type="file"
                                id="imageFile"
                                label="Seleccionar Imagen"
                                onChange={uploadFileHandler}
                            ></input>
                            {loadingUpload && <LoadingBox></LoadingBox>}
                            {errorUpload && (
                                <MessageBox variant="danger">{errorUpload}</MessageBox>
                            )}
                        </div>
                        <div>
                            <label />
                            <button type="submit" className="primary">
                                Crear
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}
