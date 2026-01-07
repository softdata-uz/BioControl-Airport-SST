import React, {useEffect, useState} from 'react';


import './categoryAdd.css';
import {DatePicker, Form, Input, message, Radio, Select} from "antd";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import {ip} from "../../../../ip";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiFillCloseCircle} from 'react-icons/ai';
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";

const CategoryAdd = (props) => {

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


    const [checkRadio, setCheckRadio] = useState(true);
    const onChangeRadio = (e) => {
        setCheckRadio(e.target.value);
    };

    const [department, setDepartment] = useState([])
    useEffect(() => {
        axios.get(`${ip}/access-control-service/api/all/department`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res) => {
                setDepartment(res?.data?.data)
            })
    }, []);


    const cencel = () => {
        setIsOpencategory(!isOpencategory);
        setInitialValuesCategory({
            full_name: '',
            short_name: '',
            status: '',
            department_id: '',
            // sign: ''
        })
        setCheckRadio(true);
    }

    const onFinish = (values) => {
        // console.log(values)
        const formData = {
            ...values,
            status : checkRadio,
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        if (initialValuesCategory.edit){
            axios.put(`${ip}/access-control-service/api/position/${initialValuesCategory.id}`, fd,
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
            axios.post(`${ip}/access-control-service/api/position/`, fd,
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
                        <h2>{t("Lavozimlar")}</h2>
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
                        requiredMark='optional'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={initialValuesCategory}
                    >

                        <div className="category_add_body_form_inner1">
                            <div className="category_add_body_form_field">
                                <span className="category_add_body_form_field_span">{t("Qisqacha nomlanishi")}</span>
                                <Form.Item name="short_name" rules={
                                    [{
                                        required: true,
                                        message: t("Qisqacha nomlanishini kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="category_add_body_form_inner1">
                            <div className="category_add_body_form_field">
                                <span className="category_add_body_form_field_span">{t("To’liq nomlanishi")}</span>
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

                        <div className="category_add_body_form_inner1">
                            <div className="category_add_body_form_field">
                                <span className="category_add_body_form_field_span">{t("Yuqori turuvchisi")}</span>
                                <Form.Item name="department_id" rules={[{
                                    required: true,
                                    message: t("Yuqori turuvchisini tanlang")
                                }]}>
                                    <SelectStyles
                                        placeholder={t("Tanlang")}
                                    >
                                        <Select.Option disabled value="">
                                            <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                        </Select.Option>
                                        <Select.Option value={0}>{t("Hammasi")}</Select.Option>
                                        {department?.map((item, index) => {
                                            return (
                                                <Select.Option value={item.id}>{item?.full_name}</Select.Option>
                                            )
                                        })}
                                    </SelectStyles>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="category_add_body_check">
                            <div>{t("Holati")} :</div>
                            <div className="category_add_body_check_group">
                                <Form.Item name="status" rules={
                                    [{
                                        required: true,
                                        message: t("Holatini tanlang")
                                    }]
                                }>
                                    <Radio.Group onChange={onChangeRadio} value={checkRadio}>
                                        <Radio value={true}>{t("Faol")}</Radio>
                                        <Radio value={false}>{t("Nofaol")}</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
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

export default CategoryAdd;