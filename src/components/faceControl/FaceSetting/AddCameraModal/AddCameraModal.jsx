import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Form, Input, Select} from "antd";
import {ip} from "../../../../ip";
import {useTranslation} from "react-i18next";
import {useAlert} from 'react-alert';

import Modal from "react-modal";
import axios from "axios";
import './addCameraModal.css';

import russia from "../../../../images/russia.svg";
import uzbek from "../../../../images/uzbek.svg";
import engliz from "../../../../images/engliz.svg";


import styled from "styled-components";

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
`;


const AddCameraModal = (props) => {

    const {
        isOpenAddCamera,
        setIsOpenAddCamera,
        cameraIntialValues,
        setCameraInitialValues,
        getCameraData,
        cameraPaginationCurrent,
    } = props;

    const alert = useAlert();
    const isDarkMode = useSelector(state => state.theme.theme_data);
    const {t} = useTranslation();

    const lang = localStorage.getItem('i18nextLng');
    const [cameraSetting, setCameraSetting] = useState([]);

    const cancel = () => {
        setIsOpenAddCamera(!isOpenAddCamera)
        setCameraInitialValues({
            name_uz: '',
            name_ru: '',
            name_en: '',
            type: '',
            group_id: '',
            ip_address: '',
            username: '',
            password: '',
            channel: ''
        })
    }

    const getCameraGroup = async () => {
        const response = await axios.get(`${ip}/face-detection-service/api/camera_group`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
        const {data} = response;
        setCameraSetting(data)
    }

    const onFinish = (values) => {
        if (cameraIntialValues.edit) {
            axios.put(`${ip}/face-detection-service/api/cameras/${cameraIntialValues.id}`, {
                    ...values,
                },
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(response => {
                    cancel()
                    getCameraData(cameraPaginationCurrent)
                })
                .catch(err => {
                    alert.error('Ip manzil xato kiritildi !')
                    console.log(err?.response?.data)
                })
        } else {
            axios.post(`${ip}/face-detection-service/api/cameras`,
                {
                    ...values,
                },
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(response => {
                    cancel()
                    getCameraData(cameraPaginationCurrent)
                })
                .catch(err => {
                    alert.error('Ip manzil xato kiritildi !')
                    console.log(err?.response?.data)
                    // console.log(err?.response?.data?.msg.includes("ip_address"))
                })
        }
    }

    const onFinishFailed = (e) => {
        // console.log(e)
    }

    useEffect(() => {
        getCameraGroup();
    }, [])

    return (
        <>
            <Modal
                isOpen={isOpenAddCamera}
                onRequestClose={() => setIsOpenAddCamera(cancel)}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >

                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={cameraIntialValues}
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div className={`camera_settings_modal_content ${isDarkMode && 'darkModeCard '}`}>
                        <div className={`camera_settings_modal_title ${isDarkMode && 'darkModeColor'}`}>
                            {t("Kamera parametrlari")}
                        </div>
                        <div className="camera_settings_modal_inputs">
                            <h4 className={`settings_modal_input_label ${isDarkMode && 'darkModeColor'}`}>{t("Kamera nomi")}</h4>
                            <div className="camera_groups_language">
                                <Form.Item
                                    label={false}
                                    name="name_uz"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Iltimos_guruh_nomini_kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles
                                        className={`settings_modal_select ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t('Kiriting')}
                                        prefix={<img src={uzbek} alt="uz"/>}

                                    />
                                </Form.Item>

                                <Form.Item
                                    label={false}
                                    name="name_ru"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Iltimos_guruh_nomini_kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles
                                        className={`settings_modal_select ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t('Kiriting')}
                                        prefix={<img src={russia} alt="uz"/>}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={false}
                                    name="name_en"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Iltimos_guruh_nomini_kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles
                                        className={`settings_modal_select ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t('Kiriting')}
                                        prefix={<img src={engliz} alt="uz"/>}
                                    />
                                </Form.Item>
                            </div>

                            <div className="setting_input_lebel_groups">
                                <Form.Item
                                    className={`settings_modal_input_label ${isDarkMode && 'darkModeColor'}`}
                                    label={t("Kamera turi")}
                                    name="type"
                                    rules={[
                                        {
                                            required: true,
                                            message: t('Kamera turini tanlang!'),
                                        },
                                    ]}
                                >
                                    <SelectStyles
                                        placeholder={t("Tanlash")}
                                        className="settings_modal_select"
                                    >
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            disabled value="">
                                            <span style={{color: "#bfbfbf"}}>{t("Tanlash")}</span>
                                        </Select.Option>
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value="dahua">{t("Dahua")}</Select.Option>
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value="hikvision">{t("Hikvision")}</Select.Option>
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value="boshqalar">{t("Boshqalar")}</Select.Option>
                                    </SelectStyles>
                                </Form.Item>

                                <Form.Item
                                    className="settings_modal_input_label"
                                    label={t("Kanal")}
                                    name="channel"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Kanal kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles
                                        className={`settings_modal_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t("Kiritish")}
                                        style={{borderRadius: '5px'}}
                                        type="number"
                                    />
                                </Form.Item>
                            </div>


                            <div className="setting_input_lebel_groups">
                                <Form.Item
                                    className="settings_modal_input_label"
                                    label={t("Guruh")}
                                    name="group_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Guruh turini tanlang!"),
                                        },
                                    ]}
                                >
                                    <SelectStyles
                                        className="settings_modal_select"
                                        placeholder={t("Tanlash")}
                                    >
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} disabled value="">
                                            <span style={{color: "#bfbfbf"}}>{t("Tanlash")}</span>
                                        </Select.Option>
                                        {
                                            cameraSetting && cameraSetting.map((item, index) => (
                                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} key={index}
                                                               value={item.id}>{item[`name_${lang}`]}</Select.Option>
                                            ))
                                        }
                                    </SelectStyles>
                                </Form.Item>

                                <Form.Item
                                    className="settings_modal_input_label"
                                    label={t("IP manzili")}
                                    name="ip_address"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("IP manzil kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles
                                        className={`settings_modal_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t("Kiritish")}
                                        style={{borderRadius: '5px'}}
                                    />
                                </Form.Item>
                            </div>

                            <div className="setting_input_lebel_groups">
                                <Form.Item
                                    className="settings_modal_input_label"
                                    label={t("Login")}
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Login kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles
                                        className={`settings_modal_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t("Kiritish")}
                                        style={{borderRadius: '5px'}}
                                    />
                                </Form.Item>
                                <Form.Item
                                    className="settings_modal_input_label"
                                    label={t("Parol")}
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Parol kiriting!"),
                                        },
                                    ]}
                                >
                                    <InputStyles.Password
                                        className={`settings_modal_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={t("Kiritish")}
                                        style={{borderRadius: '5px'}}
                                    />
                                </Form.Item>
                            </div>

                            <div className="add_camera_buttons">
                                <button type="button" onClick={cancel}
                                        className="add_camera_buttons_cancle">{t("Bekor qilish")}</button>
                                <button type="submit" className="add_camera_buttons_save">{t("Saqlash")}</button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default AddCameraModal;