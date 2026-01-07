import React ,{useEffect} from "react";
import axios from "axios";
import {ip} from "./ip";

import Saidbar from "./components/saidbar/Saidbar";

import {ThemeProvider} from 'styled-components';
import {lightTheme, darkTheme, GlobalStyles} from './themes/theme';

import {getMeAction, LOGIN_REQUEST, LoginFailure, loginResponse} from "./redux/action/action";
import {api, storage} from "./services";
import {Navigate, Route, Routes, BrowserRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import DoorControlGeneralNew from "./components/doorControlGeneralNew/DoorControlGeneralNew";
import LoginPageNew from "./components/loginPage/loginNew/LoginPageNew";
import Loader from "./components/loading/Loader";
import './App.css';

function App() {

    const dispatch = useDispatch();
    const {isAuthenticated, isFetched} = useSelector(store => store.auth);
    const token = storage.local.get("token");


    useEffect(() => {
        const loadFetch = async () => {
            dispatch(LOGIN_REQUEST());
            try {
                const {data} = await api.get(`${ip}/api/me`,
                    {headers: {'x-access-token': token}}
                    );
                console.log(data)
                const user = data?.user;
                if (user) {
                    dispatch(getMeAction(data?.user));
                } else {
                    dispatch(LoginFailure());
                }
            } catch (error) {
                dispatch(LoginFailure());
            } finally {
                dispatch(loginResponse());
            }
        };
        if (token) {
            loadFetch();
        }
    }, []);

    if (!isFetched) {
        return <Loader/>
    }
    return (
        <React.Fragment>
            {isAuthenticated ?
                <Saidbar/>
                :
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<DoorControlGeneralNew/>}/>
                        <Route path='/login' element={<LoginPageNew/>}/>
                        <Route path='*' element={<Navigate to="/"/>}/>
                    </Routes>
                </BrowserRouter>
            }
        </React.Fragment>
    );
}

export default App;


