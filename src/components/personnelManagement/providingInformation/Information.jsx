import React, {useState, useRef} from 'react';
import {useFormik} from "formik";
import * as yup from "yup"
import {DatePicker, Form, Input, message, Select} from "antd";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";


import download from '../../../images/metroBiocontrol/download.svg';
import print from '../../../images/metroBiocontrol/printer.svg';
import './information.css';
import ProvidingTable from "./providing/ProvidingTable";


import { useReactToPrint } from 'react-to-print';
import axios from "axios";
import {ip} from "../../../ip";
import {BsThreeDots} from "react-icons/bs";
import {SelectStyles} from "../employeesList/addEmployees/AddEmployees";
import ModalAddEmployee from "./modalAddEmployee/ModalAddEmployee";

const {Option} = Select;
const Information = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    const [isOpenInfoForms, setIsOpenInfoForms] = useState(false)
    const [isActiveShaping, setIsActiveShaping] = useState(true)



    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);
    const [modalAddEmployeesData, setModalAddEmployeesData] = useState([]);

    const [providingTableInitialVlue, setProvidingTableInitialVlue] = useState({
        order_number: '',
        order_date: '',
        user_id: '',
        fullname: '',
        position: '',
        reason: ''
    })

    const handleClickShaping =()=>{
        providingTableInitialVlue.fullname &&
        providingTableInitialVlue.order_number &&
        providingTableInitialVlue.order_date &&
        providingTableInitialVlue.position &&
        setIsActiveShaping(false)
    }

    // console.log(providingTableInitialVlue)
    const onFinish = (values) => {
        axios.post(`${ip}/access-control-service/api/reference`,
            providingTableInitialVlue,
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(respons =>{
                console.log(respons)
                setIsOpenInfoForms(false)
            })
            .catch(err=>{
                message.error(err.response.data.msg);
                console.log(err.response.data.msg)
            })
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }


    return (<div className="information_content">
        <Form
            name="basic"
            layout="vertical"
            requiredMark='optional'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={providingTableInitialVlue}
        >


            <div className='content_header'>
                <div className="content_top_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Kadrlarni boshqarish / Ma’lumotnomalar")}
                    </p>
                </div>
            </div>

            <div className="information_content_inner">
                <ModalAddEmployee
                    isOpenModalAddEmployee={isOpenModalAddEmployee}
                    setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                    modalAddEmployeesData={modalAddEmployeesData}
                    setModalAddEmployeesData={setModalAddEmployeesData}
                    setProvidingTableInitialVlue={setProvidingTableInitialVlue}
                    providingTableInitialVlue={providingTableInitialVlue}
                />

                {isOpenInfoForms ?
                    <div className="information_content_forms">
                        <div className="form_title">Ma’lumotnoma shakllantirish</div>
                        <div className="information_content_forms_inner">

                            <div className="content_form_items">
                                <Form.Item
                                    label={t("Sana")}
                                    name="order_date"
                                    rules={[{
                                        required: true, message: t('Sana kiriting'),
                                    },]}

                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={(date, dateString)=> setProvidingTableInitialVlue({...providingTableInitialVlue,
                                            order_date: dateString})}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Ma’lumotnoma raqami")}
                                    name='order_number'
                                    rules={[{
                                        required: true, message: t('Ma’lumotnoma raqami kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        type='number'
                                        onChange={(e)=> setProvidingTableInitialVlue({...providingTableInitialVlue,
                                            order_number: e.target.value})}
                                    />
                                </Form.Item>

                                <div className="add_employee_button" style={{marginTop: 27}}>
                                        <span className='add_employees_fullname'>
                                            {providingTableInitialVlue.fullname ? providingTableInitialVlue.fullname : t("Tanlash")}
                                        </span>
                                    <div className="add_employee_button_right"
                                         onClick={() => setIsOpenModalAddEmployee(true)}>
                                        <BsThreeDots/>
                                    </div>
                                </div>

                                <Form.Item
                                    label={t("Lavozim vazifasi")}
                                    name='position'
                                    rules={[{
                                        required: true, message: t('Lavozim vazifasi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setProvidingTableInitialVlue({...providingTableInitialVlue,
                                            position: e.target.value})}
                                    />
                                </Form.Item>

                                {/*<Form.Item*/}
                                {/*    label={t("Lavozim vazifasi")}*/}
                                {/*    name="position"*/}
                                {/*    rules={[{*/}
                                {/*        required: true, message: t('Lavozim vazifasi kiriting'),*/}
                                {/*    },]}*/}
                                {/*>*/}
                                {/*    <SelectStyles*/}
                                {/*        placeholder={t("Tanlang")}*/}
                                {/*        style={{width: "100%"}}*/}
                                {/*        onChange={(e)=> setProvidingTableInitialVlue({...providingTableInitialVlue,*/}
                                {/*            position: e})}*/}
                                {/*    >*/}
                                {/*        <Option*/}
                                {/*            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}*/}
                                {/*            value="1"*/}
                                {/*        >*/}
                                {/*            {t("Drektor")}*/}
                                {/*        </Option>*/}
                                {/*        <Option*/}
                                {/*            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}*/}
                                {/*            value="2"*/}
                                {/*        >*/}
                                {/*            {t("Ishchi")}*/}
                                {/*        </Option>*/}
                                {/*    </SelectStyles>*/}
                                {/*</Form.Item>*/}
                            </div>

                            <div className="content_form_text_area">
                                <Form.Item
                                    name="reason"
                                    label={t("Ma’lumotnoma berilish sababi")}
                                    rules={[{
                                        required: true, message: t('Ma’lumotnoma berilish sababi kiriting'),
                                    },]}
                                >
                                    <TextArea
                                        rows={5}
                                        autoSize={{minRows: 5, maxRows: 5}}
                                        // name="extra_info"
                                        placeholder="Kiriting"
                                        onChange={(e)=> setProvidingTableInitialVlue({...providingTableInitialVlue,
                                            reason: e.target.value})}
                                    />
                                </Form.Item>
                            </div>



                                <div className="active_shaping_button">
                                    {isActiveShaping ?
                                        <button type="submit" onClick={handleClickShaping}
                                                className="add_button_and_save_button"
                                        >
                                            Shakllantirish
                                        </button>
                                        : ''
                                    }
                                </div>

                                {isActiveShaping ? "" :
                                    <div className="print_information_shablon">
                                        <div className="print_download">
                                            <div className="information_download">
                                                <img src={download} alt=""/>
                                            </div>
                                            <div onClick={handlePrint} className="information_print">
                                                <img src={print} alt=""/>
                                            </div>
                                        </div>

                                        <div ref={componentRef} className="information_shablon">
                                            <div className="information_shablon_inner">
                                                <div className="information_shablon_header">
                                                    <div className="shablon_title_inner">
                                                        <h5>
                                                            O‘zbekiston Respublikasi Toshkent shahri <br/>
                                                            "Toshkent metropoliteni" DUK <br/>
                                                        </h5>
                                                        <p>
                                                            «______»___________20___й. <br/>
                                                            №______ <br/>
                                                            Toshkent shahar, 100027 <br/>
                                                            Islom Karimov ko‘chasi 16-uy
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="information_shablon_title">
                                                    MAʼLUMOTNOMA
                                                </div>
                                                <div className="information_text">
                                                    {providingTableInitialVlue.fullname} “Toshkent metropoliteni” DUK da {' '}
                                                    {providingTableInitialVlue.position} vazifasida ishlaydi.
                                                    Ushbu ma’lumotnoma {providingTableInitialVlue.reason} uchun berildi.
                                                </div>


                                                <div className="personnel_specialist">
                                                    <div className="personnel_specialist_inner">
                                                        Kadrlar bo‘yicha mutaxassis:
                                                    </div>
                                                    <div className="personnel_specialist_inner">
                                                        G.M. Adilova
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="information_content_buttons">
                                            <div className="information_content_buttons_inner">
                                                <button onClick={()=>setIsOpenInfoForms(false)} className="delete_button">
                                                    Bekor qilish
                                                </button>
                                                <button className="add_button_and_save_button">Saqlash</button>
                                            </div>
                                        </div>
                                    </div>
                                }

                        </div>
                    </div>
                    :
                    <ProvidingTable
                    setIsOpenInfoForms={setIsOpenInfoForms}
                />
                }

            </div>
        </Form>
        </div>);
};

export default Information;