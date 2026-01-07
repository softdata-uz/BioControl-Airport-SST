import React  from 'react';
import {useTranslation} from "react-i18next";
import {ip} from "../../../../ip";
import {Form, Input} from "antd";
import uzbek from "../../../../images/uzbek.svg";
import russia from "../../../../images/russia.svg";
import engliz from "../../../../images/engliz.svg";
import axios from "axios";

import styled from "styled-components";
import {useSelector} from "react-redux";

export const InputStyles = styled(Input)`
  .ant-input {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

const AddNewGroup = (props) => {
    const {
        groupIntialValues,
        setGroupInitialValues,
        setShow,
        show,
        getCameraGroup
    } = props;

    const isDarkMode = useSelector(state => state.theme.theme_data);
    const {t} = useTranslation()
    const cancel = () =>{
        setShow(!show)
        setGroupInitialValues({
            name_uz: '',
            name_ru: '',
            name_en: '',
        })
    }


    const onFinish = (values) => {
        if(groupIntialValues.edit) {
            axios.put(`${ip}/face-detection-service/api/camera_group/${groupIntialValues.id}`, {
                ...values,
            },
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(response => {
                    // item edited
                    cancel();
                    getCameraGroup();
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        else {
            axios.post(`${ip}/face-detection-service/api/camera_group`,
                {
                    ...values,
                },
                { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    cancel();
                    getCameraGroup();
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
    }

    const onFinishFailed = (e) => {
        // console.log(e)
    }


    return (
        <div>
            <Form
                name="basic"
                layout="vertical"
                initialValues={groupIntialValues}
                requiredMark = 'optional'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
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
                                    className={`camera_language_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
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
                                    className={`camera_language_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
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
                                    className={`camera_language_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={t('Kiriting')}
                                    prefix={<img src={engliz} alt="uz"/>}
                                />
                            </Form.Item>
                            <div className="add_new_group_buttons">
                                <button type="submit" className="camera_groups_button">{t("Saqlash")}</button>
                                <button type="button" onClick={cancel} className="camera_groups_button_cancle">{t("Bekor qilish")}</button>
                            </div>

                        </div>
            </Form>
        </div>
    );
};

export default AddNewGroup;