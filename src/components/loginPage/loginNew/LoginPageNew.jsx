import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import './loginPageNew.css';
import axios from "axios";
import {ip} from "../../../ip";
import logo from './Group 55882.svg';
import {UserOutlined} from '@ant-design/icons';
import {LockOutlined} from '@ant-design/icons';
import {useTranslation} from "react-i18next";

import {getMeAction, LoginSuccess} from "../../../redux/action/action";
import {useDispatch} from "react-redux";
import {IoIosArrowBack} from "react-icons/io";
import {Link} from "react-router-dom";

const LoginPageNew = () => {
    const {t, i18n} = useTranslation();

    // const [token, setToken] = useState(null)
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const initialValues = {
        login: '',
        password: ''
    }

    const onFinish = (values) => {
        setLoading(true)
        axios.post(`${ip}/api/sign-in`, {
            login: values.login,
            password: values.password
        })
            .then(res => {

                localStorage.setItem('soft-ais-token', res.data.accessToken);
                localStorage.setItem('keys', JSON.stringify(['sub1']));
                localStorage.setItem('selected-id', JSON.stringify(['3']));

                dispatch(LoginSuccess(res?.data));

                setLoading(false)
            })
            .catch(err => {
                // console.log(err)
                message.error(err?.response?.data.msg);
                setLoading(false)
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="login_page_new">
            <div className="login_page_new_top">
                <Link to="/">
                    <div className="login_page_new_top_back">
                        <IoIosArrowBack />
                        <p>Ortga</p>
                    </div>
                </Link>
                <div className="login_page_new_login">
                    <div className="login_page_new_login_logo">
                        <img src={logo}/>
                    </div>
                    <div className="login_page_new_login_body">
                        <div className="login_page_new_login_body_inner">
                            <h2>Tizimga kirish</h2>
                            <p>Iltimos login va parolni kiriting!</p>
                            <div className="login_page_new_login_body_inner_form">
                                <Form
                                    name="basic"
                                    initialValues={initialValues}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        name="login"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Loginni kiriting!',
                                            },
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined/>}/>
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Parolni kiriting!',
                                            },
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined/>}/>
                                    </Form.Item>

                                    {/*<Form.Item*/}
                                    {/*    name="remember"*/}
                                    {/*    valuePropName="checked"*/}
                                    {/*    wrapperCol={{*/}
                                    {/*        offset: 8,*/}
                                    {/*        span: 16,*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    <Checkbox>Remember me</Checkbox>*/}
                                    {/*</Form.Item>*/}

                                    <div>
                                        <button type="submit">{t('Tizimga kirish')}</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>


                </div>

            </div>



            <div className="login_page_new_bottom"></div>
        </div>
    );
};

export default LoginPageNew;