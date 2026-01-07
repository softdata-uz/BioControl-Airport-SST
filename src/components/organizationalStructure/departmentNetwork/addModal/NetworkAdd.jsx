import React, {useEffect, useState} from 'react';


import './networkAdd.css';
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

const NetworkAdd = (props) => {

    const {
        isOpennetwork,
        setIsOpennetwork,
        initialValuesNetwork,
        setInitialValuesNetwork,
        networkPaginationCurrent,
        getNetworkData
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data);
    const [checkRadio, setCheckRadio] = useState(true);
    const onChangeRadio = (e) => {
        setCheckRadio(e.target.value);
    };

    const [company, setCompany] = useState([])
    useEffect(() => {
        axios.get(`${ip}/access-control-service/api/all/company`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res) => {
                setCompany(res?.data?.data)
            })
    }, []);

    const [userIdNetwork , setUserIdNetwork] = useState({});

    
    const cencel = () => {
        setIsOpennetwork(!isOpennetwork);
        setInitialValuesNetwork({
            full_name: '',
            short_name: '',
            status: '',
            company_id: '',
            manager_fullname:'',
            // user_id : '',
            // sign: ''
        })
        setCheckRadio(true);
        setUserIdNetwork({});
    }

    const onFinish = (values) => {
        // console.log(values)
        const formData = {
            ...values,
            status : checkRadio,
            // user_id : userIdNetwork.id ? userIdNetwork.id : initialValuesNetwork.user_id,
            // manager_fullname : userIdNetwork.fullname ? userIdNetwork.fullname : initialValuesNetwork.manager_fullname,
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        if (initialValuesNetwork.edit){
            axios.put(`${ip}/access-control-service/api/department/${initialValuesNetwork.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success(t("Ma'lumotlar o'zgartirildi"), 5);
                    getNetworkData(networkPaginationCurrent);
                    cencel();
                    // console.log(res)
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        }
        else {
            axios.post(`${ip}/access-control-service/api/department/`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success(t("Yangi qo'shildi"), 5);
                    getNetworkData(networkPaginationCurrent);
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
            isOpen={isOpennetwork}
            onRequestClose={cencel}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="network_add">
                <div className="network_add_title">
                    <div className="network_add_title_left">
                        <h2>{t("Bo'lim")}</h2>
                    </div>
                    <div className="network_add_title_right">
                        <div onClick={cencel} style={{cursor: "pointer"}}>
                            <AiFillCloseCircle size={"20px"}/>
                        </div>
                    </div>
                </div>
                <div className="network_add_body">
                    <Form
                        name="basic"
                        layout="vertical"
                        requiredMark='optional'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={initialValuesNetwork}
                    >

                        <div className="network_add_body_form_inner1">
                            <div className="network_add_body_form_field">
                                <span className="network_add_body_form_field_span">{t("Qisqacha nomlanishi")}</span>
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
                        <div className="network_add_body_form_inner1">

                        </div>
                        <div className="network_add_body_form_inner1">
                            <div className="network_add_body_form_field">
                                <span className="network_add_body_form_field_span">{t("To’liq nomlanishi")}</span>
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
                        <div className="network_add_body_form_inner1">
                            <div className="network_add_body_form_field">
                                <span className="network_add_body_form_field_span">{t("Bo'lim boshlig'i")}</span>
                                {/*<div className="add_employee_button">*/}
                                {/*    <span>{*/}
                                {/*        initialValuesNetwork.edit && !userIdNetwork.fullname ? initialValuesNetwork.manager_fullname*/}
                                {/*            : !initialValuesNetwork.edit && userIdNetwork.fullname ? userIdNetwork.fullname*/}
                                {/*            : initialValuesNetwork.edit && userIdNetwork.fullname ? userIdNetwork.fullname*/}
                                {/*                : t("Tanlash")*/}
                                {/*    }</span>*/}
                                {/*    <div className="add_employee_button_right" onClick={() => setModalAddEmployee(true)}>*/}
                                {/*        <BsThreeDots/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <Form.Item name="manager_fullname" rules={
                                    [{
                                        required: true,
                                        message: t("Bo'lim boshlig'ini kiriting")
                                    }]
                                }>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="network_add_body_form_inner1">
                            <div className="network_add_body_form_field">
                                <span className="network_add_body_form_field_span">{t("Yuqori turuvchisi")}</span>
                                <Form.Item name="company_id" rules={[{
                                    required: true,
                                    message: "Yuqori turuvchisini tanlang"
                                }]}>
                                    <SelectStyles
                                        placeholder="Tanlang"
                                    >
                                        <Select.Option disabled value="">
                                            <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                        </Select.Option>
                                        <Select.Option value={0}>{t("Hammasi")}</Select.Option>
                                        {company?.map((item, index) => {
                                            return (
                                                <Select.Option value={item.id}>{item?.full_name}</Select.Option>
                                            )
                                        })}
                                    </SelectStyles>
                                </Form.Item>
                            </div>
                        </div>

                        <div className="network_add_body_check">
                            <div>{t("Holati")} :</div>
                            <div className="network_add_body_check_group">
                                <Form.Item name="status" rules={
                                    [{
                                        required: true,
                                        message: t("Holatini tanlang")
                                    }]
                                }>
                                    <Radio.Group onChange={onChangeRadio} value={checkRadio}>
                                        <Radio value={true}>{t("Faol")}</Radio>
                                        <Radio value={false}>{("Nofaol")}</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        </div>


                        <div className='network_add_body_buttons'>
                            <div>
                                <button className="network_add_body_add_button" type='submit'>
                                    {t("Saqlash")}
                                </button>
                            </div>
                        </div>

                    </Form>
                </div>
            </div>
            <ModalAddEmployee
                modalAddEmployee={modalAddEmployee}
                setModalAddEmployee={setModalAddEmployee}
                setUserIdNetwork={setUserIdNetwork}
            />
        </Modal>

    );
};

export default NetworkAdd;