import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Form, Input, Select,message} from "antd";
import {useTranslation} from "react-i18next";
import {ip} from "../../../../ip";
import {useAlert} from 'react-alert';
import Modal from "react-modal";
import axios from "axios";
import modalImg from '../../../../images/gallery-add.png';
import {BsUpload} from 'react-icons/bs';

import './addTerminal.css';


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

  .ant-input-affix-wrapper > input.ant-input {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;


const AddTerminalModal = (props) => {
    const {
        isOpenAddAdmin,
        setIsOpenAddAdmin,
        initialValues,
        setInitialValues,
        getAdminData,
        adminPaginationCurrent,
    } = props

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data)
    const alert = useAlert();

    // img
    const [view, setView] = useState(null);
    const [imageState, setImageState] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [img, setImg] = useState({})
    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log('uploaded')
            setView(URL.createObjectURL(e.target.files[0]))
            setImg({...img, image: e.target.files[0]})
            setImageState({
                initial: false,
                uploaded: true,
                requested: false,
                check: true
            })
        } else {
            setView(null)
            setImageState({
                initial: true,
                uploaded: false,
                requested: false,
                check: false
            })
        }
    }
    // img
    const cancel = () => {
        setIsOpenAddAdmin(!isOpenAddAdmin);
        setImageState({
            initial: true,
            uploaded: false,
            requested: false,
            check: false
        });
        setInitialValues({
            lastname: '',
            firstname: '',
            fathersname: '',
            role : '',
            image: '',
            created_time:'',
            login:'',
            password:'',
            id:'',
            key : ''
        })
        setView(null)
        setImg({})
    }

    const onFinish = (values) => {
        const formData = {
            ...values,
            image: imageState.uploaded ? img.image : initialValues ? initialValues.image : "",
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        if (initialValues.edit){
            axios.put(`${ip}/api/admin/${initialValues.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success("Admin ma'lumotlari o'zgartirildi", 5);
                    getAdminData(adminPaginationCurrent);
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        }
        else {
            axios.post(`${ip}/api/admin`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success("Yangi admin qo'shildi", 5);
                    getAdminData(adminPaginationCurrent);
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        }

    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    return (
        <Modal
        isOpen={isOpenAddAdmin}
        onRequestClose={cancel}
        contentLabel="My dialog"
        className="mymodalAdmin"
        overlayClassName="myoverlay"
        closeTimeoutMS={300}
    >
            <Form
                name="basic"
                layout="vertical"
                requiredMark='optional'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                initialValues={initialValues}
            >
                <div className="user_list_modal">
                    <div className="user_list_modal_head">
                        <h2>{initialValues.edit ? t("Admin ma'lumotlarini o'zgartirish") : t("Admin qo'shish")}</h2>
                    </div>
                    <div className="user_list_modal_uploadImg">
                        <div className="user_list_modal_uploadImg_left">
                            <div className="user_list_modal_uploadImg_left_inner">
                                {
                                    initialValues.edit && !imageState.check ?
                                        <img src={`${ip}/${initialValues.image}`} className="img1"/> :
                                        imageState.uploaded ? <img src={view} className="img1"/>
                                            : <img src={modalImg} className="img2"/>}
                            </div>
                        </div>
                        <div className="user_list_modal_uploadImg_right">
                            <div className="user_list_modal_uploadImg_right_inner">
                                <label htmlFor='add_staff_img' className="upload_button">
                                    <div className="upload_button_icon">
                                        {/*<img src={UploadIcon} style={{marginRight: "8px"}}/>*/}
                                        <BsUpload size={22} style={{marginRight: "8px"}}/>
                                        {t("Rasm yuklash")}
                                    </div>
                                    <input onChange={upload} name='image' type="file"
                                           id="add_staff_img"
                                           style={{display: 'none'}}
                                           className=""
                                    />
                                </label>
                                <div className="upload_button_text">
                                    <span>{t("Maksimal fayl hajmi 1 Mb 500x500 o‘lchamda")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="user_list_modal_form">

                        <div className="user_list_modal_form_input">
                            <span>{t("Familiya")}</span>
                            <Form.Item name="lastname" rules={
                                [{
                                    required: true,
                                    message: t("Familiya kiriting")
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="user_list_modal_form_input">
                            <span>{t("Ism")}</span>
                            <Form.Item name="firstname" rules={
                                [{
                                    required: true,
                                    message: t("Ism kiriting")
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="user_list_modal_form_input">
                            <span>{t("Otasining ismi")}</span>
                            <Form.Item name="fathersname" rules={[{
                                required: true,
                                message: t("Otasining ismini kiriting")
                            }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="user_list_modal_form_input">
                            <span>{t("Boshqarma")}</span>
                            <Form.Item name="role" rules={[{
                                required: true,
                                message: t("Boshqarmani tanlang")
                            }]}>
                                {/*<Input placeholder="Kiriting"/>*/}
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    // defaultValue="king"
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                    </Select.Option>
                                    <Select.Option value="king">King</Select.Option>
                                    <Select.Option value="superadmin">Super Admin</Select.Option>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="operator">Operator</Select.Option>
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="user_list_modal_form_input">
                            <span>{t("Login")}</span>
                            <Form.Item name="login" rules={[{
                                required: true,
                                message: t("Login kiriting")
                            }]}>
                                <InputStyles placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>

                        <div className="user_list_modal_form_input">
                            <span>{t("Parol")}</span>
                            <Form.Item name="password" rules={[{
                                required: true,
                                message: t("Parol kiriting")
                            }]} type="password">
                                {/*<Input placeholder="Kiriting"/>*/}
                                <InputStyles.Password size="large" placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>

                    </div>

                    <div className='access_control_add_staff_terminal_modal_body_buttons'>
                        <div>
                            <button className="add_terminal_cancel_button" onClick={()=>cancel()}
                                    type='button'>{t("Bekor qilish")}
                            </button>
                        </div>
                        <button className="add_terminal_save_button" type='submit'>
                            {t("Saqlash")}
                        </button>
                    </div>

                </div>
            </Form>
    </Modal>);
};

export default AddTerminalModal;