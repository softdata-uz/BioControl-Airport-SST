import React, {useEffect} from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import './style.css'

const NotFound = () => {

    const navigate = useNavigate()
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const isDarkMode = useSelector(state => state.theme.theme_data)

    const handleClick = () => {
        navigate('/')
    }

    useEffect(() => {
        // if(!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={`not-found ${isDarkMode && 'darkModeLayautBg'}`} >
            <h1 className={isDarkMode ? 'darkModeColor' : ''}>Page not found</h1>
            <button onClick={handleClick}>Back home</button>
        </div>
    )
}

export default NotFound
