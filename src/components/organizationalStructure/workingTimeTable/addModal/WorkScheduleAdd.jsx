import React, {useEffect, useState} from 'react';


import './workScheduleAdd.css';
import {DatePicker, Form, Input, message, Radio, Select, TimePicker} from "antd";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import {ip} from "../../../../ip";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiFillCloseCircle} from 'react-icons/ai';

const WorkScheduleAdd = (props) => {

    const {
        isOpencategory,
        setIsOpencategory,
        initialValuesCategory,
        setInitialValuesCategory,
        categoryPaginationCurrent,
        getCategoryData
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data);



    // console.log(department)
    const cencel = () => {
        setIsOpencategory(!isOpencategory);
        setInitialValuesCategory({
            name: '',
            from_time: '',
            to_time: '',
            created_time: ''
        })
    }

    const onFinish = (values) => {
        // console.log(values)
        const formData = {
            ...values,
            from_time: moment(values?.from_time).format("HH:mm"),
            to_time: moment(values?.to_time).format("HH:mm"),
        }

        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        if (initialValuesCategory.edit){
            axios.put(`${ip}/access-control-service/api/work-time-schedule/${initialValuesCategory.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success(t("Ma'lumotlar o'zgartirildi"), 5);
                    getCategoryData(categoryPaginationCurrent);
                    cencel();
                    // console.log(res)
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        }
        else {
            axios.post(`${ip}/access-control-service/api/work-time-schedule/`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success(t("Yangi qo'shildi"), 5);
                    getCategoryData(categoryPaginationCurrent);
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




    return (

        <Modal
            isOpen={isOpencategory}
            onRequestClose={cencel}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="category_add">
                <div className="category_add_title">
                    <div className="category_add_title_left">
                        <h2>{t("Ish vaqti jadvali")}</h2>
                    </div>
                    <div className="category_add_title_right">
                        <div onClick={() => setIsOpencategory(false)} style={{cursor: "pointer"}}>
                            <AiFillCloseCircle size={"20px"}/>
                        </div>
                    </div>
                </div>
                <div className="category_add_body">
                    <Form
                        name="basic"
                        layout="vertical"
                        initialValues={initialValuesCategory}
                        requiredMark='optional'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >

                        <div className="category_add_body_form_inner1">
                            <div className="category_add_body_form_field">
                                <span className="category_add_body_form_field_span">{t("Nomlanishi")}</span>
                                <Form.Item name="name" rules={
                                    [{
                                        required: true,
                                        message: t("Nomlanishini kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="category_add_body_form_field">
                            <span className="category_add_body_form_field_span">{t("Boshlanish vaqti")}</span>
                            <Form.Item
                                name="from_time"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Muddatni tanlang"),
                                    },
                                ]}
                            >
                                <TimePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "08:00"
                                    )}`}
                                    size="large"
                                    format="HH:mm"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>

                        <div className="category_add_body_form_field">
                            <span className="category_add_body_form_field_span">{t("Tugash vaqti")}</span>
                            <Form.Item
                                name="to_time"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Muddatni tanlang"),
                                    },
                                ]}
                            >
                                <TimePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "18:00"
                                    )}`}
                                    size="large"
                                    format="HH:mm"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>


                        <div className='category_add_body_buttons'>
                            <div>
                                <button className="category_add_body_add_button" type='submit'>
                                    {t("Saqlash")}
                                </button>
                            </div>
                        </div>

                    </Form>
                </div>
            </div>
        </Modal>

    );
};

export default WorkScheduleAdd;