import React, {useState} from 'react';


import './enterpriseAdd.css';
import {DatePicker, Form, Input, message, Radio, Select} from "antd";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import {ip} from "../../../../ip";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiFillCloseCircle} from 'react-icons/ai';
import {BsThreeDots} from 'react-icons/bs';
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";
import ModalAddEmployee from "../modalAddEmployee/ModalAddEmployee";

const EnterpriseAdd = (props) => {

    const {
        isOpenEnterprise,
        setIsOpenEnterprise,
        getEnterpriseData,
        enterprisePaginationCurrent,
        initialValues,
        setInitialValues
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data);

    const [userId , setUserId] = useState({});

    const cencel = () => {
        setIsOpenEnterprise(!isOpenEnterprise);
        setInitialValues({
            date_of_birth: '',
            director_fullname: '',
            email: '',
            full_name: '',
            short_name: '',
            status: '',
            tel: '',
            // user_id: '',
            address:''
        })
        setCheckRadio(true);
        setUserId({});
    }

    const [checkRadio, setCheckRadio] = useState(true);
    const onChange = (e) => {
        setCheckRadio(e.target.value);
    };

    const onFinish = (values) => {
        console.log(values);
        const formData = {
            ...values,
            status : checkRadio,
            // user_id: userId.id ? userId.id : initialValues.user_id,
            // director_fullname : userId.fullname ? userId.fullname : initialValues.director_fullname,
            date_of_birth: moment(values.date_of_birth).format('MM-DD-YYYY')
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
            if (initialValues.edit){
                axios.put(`${ip}/access-control-service/api/company/${initialValues.id}`, fd,
                    {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                    .then((res) => {
                        message.success(t("Ma'lumotlar o'zgartirildi"), 5);
                        getEnterpriseData(enterprisePaginationCurrent);
                        cencel();
                        // console.log(res)
                    })
                    .catch(err =>
                        message.error(err?.response?.data.msg)
                    )
            }
            else {
                axios.post(`${ip}/access-control-service/api/company/`, fd,
                    {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                    .then((res) => {
                        message.success(t("Yangi qo'shildi"), 5);
                        getEnterpriseData(enterprisePaginationCurrent);
                        cencel();
                        // console.log(res)
                    })
                    .catch(err =>
                        message.error(err?.response?.data.msg)
                    )
            }
    }

    const onFinishFailed = (e) => {
        // console.log(e)
    }

    const [modalAddEmployee, setModalAddEmployee] = useState(false);

    return (

        <Modal
            isOpen={isOpenEnterprise}
            onRequestClose={cencel}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="enterprise_add">
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={initialValues}
                >
                <div className="enterprise_add_title">
                    <div className="enterprise_add_title_left">
                        <h2>{t("Tashkilot (korxona)")}</h2>
                    </div>
                    <div className="enterprise_add_title_right">

                        <div className="enterprise_add_title_right_check">
                            <span>{t("Holati")} :</span>
                            <div className="enterprise_add_title_right_check_group">
                                <Form.Item name="status" rules={
                                    [{
                                        required: true,
                                        message: t("Holatini tanlang")
                                    }]
                                }>
                                <Radio.Group onChange={onChange} value={checkRadio}>
                                    <Radio value={true}>{t("Faol")}</Radio>
                                    <Radio value={false}>{t("Nofaol")}</Radio>
                                </Radio.Group>
                                </Form.Item>
                            </div>
                        </div>
                        <div onClick={cencel} style={{cursor: "pointer"}}>
                            <AiFillCloseCircle size={"20px"}/>
                        </div>
                    </div>
                </div>
                <div className="enterprise_add_body">

                        <div className="enterprise_add_body_form_inner1">
                            <div className="enterprise_add_body_form_field">
                                <span className="enterprise_add_body_form_field_span">{t("Qisqacha nomlanishi")}</span>
                                <Form.Item name="short_name" rules={
                                    [{
                                        required: true,
                                        message: t("Qisqacha nomlanishini kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                            <div className="enterprise_add_body_form_field">
                                <span className="enterprise_add_body_form_field_span">{t("To’liq nomlanishi")}</span>
                                <Form.Item name="full_name" rules={
                                    [{
                                        required: true,
                                        message: t("To‘liq nomlanishini kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                        </div>
                        <div className="enterprise_add_body_form_inner2">
                            <span className="enterprise_add_body_form_field_span">{t("Rahbar haqida ma'lumot")}</span>
                        </div>

                        <div className="enterprise_add_body_form_inner1">
                            <div className="enterprise_add_body_form_field">
                                <span className="enterprise_add_body_form_field_span">{t("Direktor F.I.SH")}</span>
                                {/*<div className="add_employee_button">*/}
                                {/*    <span>*/}
                                {/*        {*/}
                                {/*        initialValues.edit && !userId.fullname ? initialValues.director_fullname*/}
                                {/*            : !initialValues.edit && userId.fullname ? userId.fullname*/}
                                {/*            : initialValues.edit && userId.fullname ? userId.fullname*/}
                                {/*                : t("Tanlash")*/}
                                {/*    }*/}
                                {/*    </span>*/}
                                {/*    <div className="add_employee_button_right" onClick={() => setModalAddEmployee(true)}>*/}
                                {/*        <BsThreeDots/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <Form.Item name="director_fullname" rules={
                                    [{
                                        required: true,
                                        message: t("Direktor F.I.SH ni kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>

                            </div>
                            <div className="enterprise_add_body_form_field">
                                <span className="enterprise_add_body_form_field_span">{t("Tug’ilgan sanasi")}</span>
                                <Form.Item
                                    name="date_of_birth"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Tug’ilgan sanasini tanlang"),
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                        size="large"
                                        style={{borderRadius: '5px'}}
                                    />
                                </Form.Item>
                            </div>
                        </div>


                        <div className="enterprise_add_body_form_inner1">
                            <div className="enterprise_add_body_form_field">
                                <span className="enterprise_add_body_form_field_span">{t("Telefon raqami")}</span>
                                <Form.Item name="tel" rules={
                                    [{
                                        required: true,
                                        message: t("Telefon raqamini kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                            <div className="enterprise_add_body_form_field">
                                <span className="enterprise_add_body_form_field_span">{t("Elektron pochta")}</span>
                                <Form.Item name="email" rules={
                                    [{
                                        required: true,
                                        message: t("Elektron pochtani kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                        </div>

                    <div className="enterprise_add_body_form_field">
                        <span className="enterprise_add_body_form_field_span">{t("Manzil")}</span>
                        <Form.Item name="address" rules={
                            [{
                                required: true,
                                message: t("Manzil  kiriting")
                            }]
                        }>
                            <Input placeholder={t("Kiriting")}/>
                        </Form.Item>
                    </div>


                        <div className='enterprise_add_body_buttons'>
                            <div>
                                <button className="enterprise_add_body_add_button" type='submit'>
                                    {t("Saqlash")}
                                </button>
                            </div>
                        </div>

                </div>
                </Form>
            </div>
            <ModalAddEmployee
                modalAddEmployee={modalAddEmployee}
                setModalAddEmployee={setModalAddEmployee}
                setUserId={setUserId}
            />
        </Modal>

    );
};

export default EnterpriseAdd;