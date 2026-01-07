import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Form, Input, message, Select} from "antd";
import {useTranslation} from "react-i18next";
import {ip} from "../../../../ip";
import Modal from "react-modal";
import axios from "axios";

import './addTerminal.css';


import styled from "styled-components";
    import moment from "moment/moment";

export const SelectStyles = styled(Select)`
  .ant-select-selector {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }

  .ant-select-selection-item {
    color: ${({theme}) => theme.text} !important;
  }
`;
export const InputStyles = styled(Input)`
  .ant-input {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }

  .ant-input-affix-wrapper > input.ant-input {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;


const AddTerminalModal = (props) => {
    const {
        isOpenAddTerminal,
        setIsOpenAddTerminal,
        terminalTableIntialValues,
        setTerminalTableIntialValues,
        getTerminalData,
        terminalPaginationCurrent,
        languageGroup
    } = props

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data)




    const cancel = () => {
        setIsOpenAddTerminal(!isOpenAddTerminal)
        setTerminalTableIntialValues({
            door_name: '', direction: '', auth_type: '', api: '', group_id: '', ip_address: '', type: '', username: '', password: '',
        })
    }


    const onFinish = (values) => {
        if (terminalTableIntialValues.edit) {
            axios.put(`${ip}/access-control-service/api/terminals/${terminalTableIntialValues.id}`, {
                ...values
            }, {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then(response => {
                    cancel()
                    getTerminalData(terminalPaginationCurrent)
                })
                .catch(err => {
                    message.error(err?.response?.data.msg)
                })
        } else {
            axios.post(`${ip}/access-control-service/api/terminals`,
                values,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then(response => {
                    cancel()
                    getTerminalData(terminalPaginationCurrent)
                })
                .catch(err => {
                    message.error(err?.response?.data.msg)
                })
        }
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    return (<Modal
        isOpen={isOpenAddTerminal}
        onRequestClose={() => setIsOpenAddTerminal(cancel)}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={300}
    >
        <Form
            name="basic"
            layout="vertical"
            initialValues={terminalTableIntialValues}
            requiredMark='optional'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div className={`access_control_add_terminal_modal ${isDarkMode && 'darkModeCard'}`}>
                <h1 className={`access_control_add_staff_terminal_modal_title ${isDarkMode && 'darkModeColor'}`}>
                    {t("Terminal parametrlari")}
                </h1>

                <div className="access_control_add_terminal_modal_bodiy">
                    <div className="access_control_add_terminal_modal_item">
                        <Form.Item
                            label={t("Eshik nomi")}
                            name="door_name"
                            rules={[{
                                required: true, message: t('Eshik nomini kiriting'),
                            },]}
                        >
                            <Input
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                size="large"
                                placeholder={t("Kiriting")}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t("Yo’nalishi")}
                            name="direction"
                            rules={[{
                                required: true, message: t("Yo'nalishni tanlang"),
                            },]}
                        >
                            <SelectStyles
                                size="large"
                                placeholder={t("Tanlang")}
                            >
                                <Select.Option
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    disabled value="">
                                    <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                                </Select.Option>
                                <Select.Option
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    value="Entry">{t("Kirish")}
                                </Select.Option>
                                <Select.Option
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    value="Exit">{t("Chiqish")}</Select.Option>
                            </SelectStyles>
                        </Form.Item>
                    </div>

                    <div className="access_control_add_terminal_modal_item">
                        <Form.Item
                            label={t("Terminal IP manzili")}
                            name="ip_address"
                            rules={[{
                                required: true, message: t('Terminal IP manzil kiriting'),
                            },]}
                        >
                            <Input
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                size="large"
                                placeholder={t("Kiriting")}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t("Terminal turi")}
                            name="type"
                            rules={[{
                                required: true, message: t("Terminal turini tanlang"),
                            },]}
                        >
                            <SelectStyles
                                size="large"
                                placeholder={t("Tanlang")}
                            >
                                <Select.Option
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    disabled value="">
                                    <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                                </Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value="dahua">Dahua</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value="hikvision">Hikvision</Select.Option>
                            </SelectStyles>
                        </Form.Item>
                    </div>

                    <div className="access_control_add_terminal_modal_item">
                        <Form.Item
                            label={t("Bino")}
                            name="group_id"
                            rules={[{
                                required: true, message: t("Yo'nalishni tanlang"),
                            },]}
                        >
                            <SelectStyles
                                size="large"
                                placeholder={t("Tanlang")}
                            >
                                <Select.Option
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    disabled value="">
                                    <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                                </Select.Option>

                                {
                                    languageGroup && languageGroup.map((item, index)=>(
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            key={index}
                                            value={item.id}>
                                            {t(item.name)}
                                        </Select.Option>
                                    ))
                                }


                            </SelectStyles>
                        </Form.Item>

                        <Form.Item
                            label={t("Autentifikatsiya turi")}
                            name="auth_type"
                            rules={[{
                                required: true, message: t("Autentifikatsiya turini tanlang"),
                            },]}
                        >
                            <SelectStyles
                                size="large"
                                placeholder={t("Tanlang")}
                            >
                                <Select.Option
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    disabled value="">
                                    <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                                </Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={1}>{t("Yuz")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={2}>{t("Barmoq izi")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={3}>{t("ID karta")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={4}>{t("Yuz va Barmoq izi")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={5}>{t("Yuz yoki Barmoq izi")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={6}>{t("Yuz va ID karta")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={7}>{t("Yuz yoki ID karta")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={8}>{t("Barmoq izi va ID karta")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={9}>{t("Barmoq izi yoki ID karta")}</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value={10}>{t("Yuz yoki Barmoq izi yoki ID karta")}</Select.Option>
                            </SelectStyles>
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={t("API")}
                        name="api"
                        rules={[{
                            required: true, message: t('API' +
                                ' kiriting'),
                        },]}
                    >
                        <Input
                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                            size="large"
                            placeholder={t("Kiriting")}
                        />
                    </Form.Item>

                    <div className="access_control_add_terminal_modal_item">
                        <Form.Item
                            label={t("Login")}
                            name="username"
                            rules={[{
                                required: true, message: t('Login kiriting'),
                            },]}
                        >
                            <InputStyles
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                size="large"
                                placeholder={t("Kiriting")}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t("Parol")}
                            name="password"
                            rules={[{
                                required: true, message: t('Parol kiriting'),
                            },]}
                        >
                            <InputStyles.Password
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className='access_control_add_staff_terminal_modal_body_buttons'>
                    <div>
                        <button className="add_terminal_cancel_button" onClick={cancel}
                                type='button'>{t("Bekor qilish")}
                        </button>
                    </div>
                    <div>
                        <button className="add_terminal_save_button" type='submit'>
                            {t("Saqlash")}
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    </Modal>);
};

export default AddTerminalModal;