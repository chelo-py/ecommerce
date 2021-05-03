import React from 'react'
import { useDispatch } from 'react-redux'
import { listarPrecios } from '../actions/listaPrecioActions';

export default function ListaPrecioScreen() {

    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(listarPrecios({}));
    // }, [dispatch])

    const listHandler = () => {
        dispatch(listarPrecios({}))
    }

    return (
        <div>
            <button onClick={() => listHandler()}>
                Enviar
            </button>
        </div>
    )
}
