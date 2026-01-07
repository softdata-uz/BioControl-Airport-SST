import React, {useState} from 'react';
import * as yup from "yup"
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {DatePicker, Form, Input, message, Select, TimePicker} from "antd";
import moment from "moment";


import './addEmployees.css';
import styled from "styled-components";
import TextArea from "antd/es/input/TextArea";
import AddRelativesTable from "./AddRelativesTable";
import {BsThreeDots} from "react-icons/bs";
import ModalAddEmployee from '../modalAddEmployee/ModalAddEmployee';
import axios from "axios";
import {ip} from "../../../../ip";
import dayjs from "dayjs";


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

const {Option} = Select;
const AddEmployees = (props) => {

const {
    getStaffData,
    setOpenAddemployees,
    employeesInitialValue,
    setEmployeesInitialValue,
    staffPaginationCurrent
}=props
    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);
    const [modalAddEmployeesData, setModalAddEmployeesData] = useState([]);




   const disabledDate = (current) =>{
        // Can not select days after today and before start Date
        const start = moment(employeesInitialValue.education.started_date,'YYYY-MM-DD');
        return  current< start ;
    }

    const disabledLabourDate = (current) =>{
        // Can not select days after today and before start Date
        const start = moment(employeesInitialValue.labour_vacation.from_date,'YYYY-MM-DD');
        return  current< start ;
    }

    const onFinish = (values) => {
        axios.post(`${ip}/access-control-service/api/staff`,
            employeesInitialValue,
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
            .then(respons =>{
                // console.log(respons)
                setOpenAddemployees(false)
                getStaffData(staffPaginationCurrent)
            })
            .catch(err=>{
                message.error(err.response.data.msg);
                console.log(err.response.data.msg)
            })
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }



    return (<div>
        <Form
            name="basic"
            layout="vertical"
            requiredMark='optional'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={employeesInitialValue}
        >
            <div className="information_content1">
                <div className="information_content_inner_no_title">
                    <div className="information_content_items">
                        <div className="information_content_title">
                            <div className="title_vertcal_line"></div>
                            {t("Xodim haqida ma’lumot")}
                        </div>
                        <hr/>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                I. {t("Shaxsiy ma’lumotlar")}
                            </div>
                            <div className="add_employees_forms">
                                <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                            {employeesInitialValue?.fullname ? employeesInitialValue?.fullname : t("Tanlash")}
                                        </span>
                                    <div className="add_employee_button_right"
                                         onClick={() => setIsOpenModalAddEmployee(true)}>
                                        <BsThreeDots/>
                                    </div>
                                </div>

                                <Form.Item
                                    label={t("Tug’ilgan sanasi")}
                                    name="date_of_birth"
                                    rules={[{
                                        required: true, message: t('Tug’ilgan sanasini tanlang'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={(date, dateString)=> {setEmployeesInitialValue({...employeesInitialValue, date_of_birth: dateString})
                                            console.log(dateString)}}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Millati")}
                                    name='nationality'
                                    rules={[{
                                        required: true, message: t('Millati kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, nationality: e.target.value})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Yashash manzili")}
                                    name='address'
                                    rules={[{
                                        required: true, message: t('Yashash manzili kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, address: e.target.value})}
                                    />
                                </Form.Item>
                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Pasport seriyasi va raqami")}
                                    name='passport_seria'
                                    rules={[{
                                        required: true, message: t('Pasport seriyasi va raqamini kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, passport_seria: e.target.value})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Berilgan sana")}
                                    name="passport_given_date"
                                    rules={[{
                                        required: true, message: t('Berilgan sanani kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        onChange={(e,a)=>setEmployeesInitialValue({...employeesInitialValue, passport_given_date: a})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Kim tomonidan berilgan")}
                                    name='passport_given_by'
                                    rules={[{
                                        required: true, message: t('Kim tomonidan berilganini kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, passport_given_by: e.target.value})}

                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Partiyaviyligi")}
                                    name="party_membership"
                                    rules={[{
                                        required: true, message: t('Partiyaviyligini kiriting'),
                                    },]}
                                    placeholder={t("Tanlang")}
                                >
                                    <SelectStyles
                                        placeholder={t("Tanlang")}
                                        style={{width: "100%"}}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, party_membership: e})}
                                    >
                                        <Option
                                            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                            value="1"
                                        >
                                            {t("Bor")}
                                        </Option>
                                        <Option
                                            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                            value="2"
                                        >
                                            {t("Yo'q")}
                                        </Option>
                                    </SelectStyles>
                                </Form.Item>
                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Mehnat staji")}
                                    name='labour_experience'
                                    rules={[{
                                        required: true, message: t('Mehnat staji kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, labour_experience: e.target.value})}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Staj davomiyligi")}
                                    name="experience_term"
                                    rules={[{
                                        required: true, message: t('Staj davomiyligi kiriting'),
                                    },]}
                                >
                                    <Input
                                        type="number"
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, experience_term: e.target.value})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("So’ngi ish joyi")}
                                    name='last_workplace'
                                    rules={[{
                                        required: true, message: t('So’ngi ish joyi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, last_workplace: e.target.value})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Lavozimi")}
                                    name="last_workplace_position"
                                    rules={[{
                                        required: true, message: t('Lavozimi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, last_workplace_position: e.target.value})}
                                    />
                                </Form.Item>
                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Ishdan bo’shash sanasi")}
                                    name='fired_date'
                                    rules={[{
                                        required: true, message: t('Ishdan bo’shash sanasi kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={(e,a)=>setEmployeesInitialValue({...employeesInitialValue, fired_date: a})}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Sababi")}
                                    name='firing_reason'
                                    rules={[{
                                        required: true, message: t('Sabab kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, firing_reason: e.target.value})}
                                    />
                                </Form.Item>


                            </div>

                            <div className="add_relatives">
                                <div className="add_relatives_title">{t("Qarindoshlar")}:</div>
                                <AddRelativesTable
                                    setEmployeesInitialValue={setEmployeesInitialValue}
                                    employeesInitialValue={employeesInitialValue}
                                />
                            </div>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                II. {t("Ta’lim haqida ma’lumot")}
                            </div>
                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Ta’lim muassasasi nomi")}
                                    name='institution'
                                    rules={[{
                                        required: true, message: t('Ta’lim muassasasi nomi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e) => setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, institution: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Daraja")}
                                    name="degree"
                                    rules={[{
                                        required: true, message: t('Daraja kiriting'),
                                    },]}
                                >
                                    <SelectStyles
                                        placeholder={t("Tanlang")}
                                        style={{width: "100%"}}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, degree: e}})}
                                    >
                                        <Option
                                            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                            value="1"
                                        >
                                            {t("O'rta maxsus")}
                                        </Option>
                                        <Option
                                            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                            value="2"
                                        >
                                            {t("To'liqsiz oliy")}
                                        </Option>
                                        <Option
                                            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                            value="3"
                                        >
                                            {t("Oliy")}
                                        </Option>
                                        <Option
                                            className={` ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                            value="4"
                                        >
                                            {t("PhD")}
                                        </Option>

                                    </SelectStyles>
                                </Form.Item>
                                <Form.Item
                                    label={t("Mutaxassislik")}
                                    name='education_specialization'
                                    rules={[{
                                        required: true, message: t('Mutaxassislik kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e) => setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, specialization: e.target.value}})}
                                    />
                                </Form.Item>
                                <div className="two_datePicker">
                                    <Form.Item
                                        label={t("O'qish Davri")}
                                        name='started_date'
                                        rules={[{
                                            required: true, message: t('Davri kiriting'),
                                        },]}
                                    >
                                        <DatePicker
                                            className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                            placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                            onChange={(e,a)=>setEmployeesInitialValue({...employeesInitialValue,
                                                education: {...employeesInitialValue.education, started_date: a}})}
                                            size="large"
                                            style={{width: "100%", borderRadius: '5px'}}
                                            // disabledDate={disableDateRanges}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={t(" ")}
                                        name='ended_date'
                                        rules={[{
                                            required: true, message: t('Davri kiriting'),
                                        },]}
                                    >
                                        <DatePicker
                                            className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                            placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                            onChange={(e,a)=>setEmployeesInitialValue({...employeesInitialValue,
                                                education: {...employeesInitialValue.education, ended_date: a}})}
                                            size="large"
                                            style={{width: "100%", borderRadius: '5px'}}
                                            disabledDate={disabledDate}
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Diplom seriyasi va raqami")}
                                    name='diploma_seria'
                                    rules={[{
                                        required: true, message: t('Diplom seriyasi va raqami kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, diploma_seria: e.target.value}})}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                III. {t("Harbiy ma’lumotnoma")}
                            </div>
                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Guruh hisobi")}
                                    name='group_account'
                                    rules={[{
                                        required: true, message: t('Guruh hisobi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, group_account: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Hisob kategoriyasi")}
                                    name='account_category'
                                    rules={[{
                                        required: true, message: t('Hisob kategoriyasi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, account_category: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Tarkib")}
                                    name='content'
                                    rules={[{
                                        required: true, message: t('Tarkib kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, content: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Harbiy martabasi")}
                                    name='rank'
                                    rules={[{
                                        required: true, message: t('Harbiy martabasi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, rank: e.target.value}})}
                                    />
                                </Form.Item>

                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Maxsus hisob raqami")}
                                    name='special_account_number'
                                    rules={[{
                                        required: true, message: t('Maxsus hisob raqami kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, special_account_number: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Harbiy hisob mutaxassisligi")}
                                    name='specialization'
                                    rules={[{
                                        required: true, message: t('Harbiy hisob mutaxassisligi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, specialization: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Harbiy xizmat muddati")}
                                    name='military_service_period'
                                    rules={[{
                                        required: true, message: t('Harbiy xizmat muddati kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, period: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Harbiy qism nomi")}
                                    name='name'
                                    rules={[{
                                        required: true, message: t('Harbiy qism nomi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, name: e.target.value}})}
                                    />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label={t("Harbiy qism manzili")}
                                name='military_service_address'
                                rules={[{
                                    required: true, message: t('Harbiy qism manzili kiriting'),
                                },]}
                            >
                                <Input
                                    className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                    style={{width: "100%"}}
                                    placeholder={t("Kiritish")}
                                    onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, military_service: {...employeesInitialValue.military_service, address: e.target.value}})}
                                />
                            </Form.Item>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                IV. {t("Tayinlanish")}
                            </div>
                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Sana")}
                                    name="the_date"
                                    rules={[{
                                        required: true, message: t('Sana kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={(e,a)=>setEmployeesInitialValue({...employeesInitialValue, appointment: {...employeesInitialValue.appointment, the_date: a}})}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Bo'lim")}
                                    name="department"
                                    rules={[{
                                        required: true, message: t("Bo'lim kiriting"),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, appointment: {...employeesInitialValue.appointment, department: e.target.value}})}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Mutaxassislik")}
                                    name="appointment_specialization"
                                    rules={[{
                                        required: true, message: t('Mutaxassislik kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, appointment: {...employeesInitialValue.appointment, specialization: e.target.value}})}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Razryad")}
                                    name='razryad'
                                    rules={[{
                                        required: true, message: t('Razryad kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, appointment: {...employeesInitialValue.appointment, razryad: e.target.value}})}
                                    />
                                </Form.Item>

                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Asos")}
                                    name='appointment_basis'
                                    rules={[{
                                        required: true, message: t('Asos kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, appointment: {...employeesInitialValue.appointment, basis: e.target.value}})}
                                    />
                                </Form.Item>

                            </div>

                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                V. {t("Mehnat ta’tili")}
                            </div>
                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Ta’til turi")}
                                    name='type'
                                    rules={[{
                                        required: true, message: t('Ta’til turi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, labour_vacation: {...employeesInitialValue.labour_vacation, type: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Ta’til muddati")}
                                    name='labour_vacation_period'
                                    rules={[{
                                        required: true, message: t('Ta’til muddati kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, labour_vacation: {...employeesInitialValue.labour_vacation, period: e.target.value}})}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Ta’tilning boshlanishi")}
                                    name='from_date'
                                    rules={[{
                                        required: true, message: t('Ta’tilning boshlanishi kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={(e, a)=>setEmployeesInitialValue({...employeesInitialValue, labour_vacation: {...employeesInitialValue.labour_vacation, from_date: a}})}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Ta’tilning tugashi")}
                                    name='to_date'
                                    rules={[{
                                        required: true, message: t('Ta’tilning tugashi kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={(e, a)=>setEmployeesInitialValue({...employeesInitialValue, labour_vacation: {...employeesInitialValue.labour_vacation, to_date: a}})}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        disabledDate={disabledLabourDate}
                                    />
                                </Form.Item>

                            </div>
                            <Form.Item
                                label={t("Asos")}
                                name='basis'
                                rules={[{
                                    required: true, message: t('Asos kiriting'),
                                },]}
                            >
                                <Input
                                    className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                    style={{width: "100%"}}
                                    placeholder={t("Kiritish")}
                                    onChange={(e)=>setEmployeesInitialValue({...employeesInitialValue, labour_vacation: {...employeesInitialValue.labour_vacation, basis: e.target.value}})}
                                />
                            </Form.Item>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                VI. {t("Qo’shimcha ma’lumotlar")}
                            </div>
                            <Form.Item name="extra_info" label={t("Ma’lumot")}>
                                <TextArea
                                    rows={5}
                                    autoSize={{minRows: 5, maxRows: 5}}
                                    placeholder="Kiriting"
                                    onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, extra_info: e.target.value})}
                                />
                            </Form.Item>

                        </div>


                        <div className="information_content_buttons">
                            <div className='access_control_add_staff_terminal_modal_body_buttons'>
                                <div>
                                    <button className="add_terminal_cancel_button" onClick={()=> setOpenAddemployees(false)}
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
                    </div>

                    <ModalAddEmployee
                        isOpenModalAddEmployee={isOpenModalAddEmployee}
                        setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                        modalAddEmployeesData={modalAddEmployeesData}
                        setModalAddEmployeesData={setModalAddEmployeesData}
                        setEmployeesInitialValue={setEmployeesInitialValue}
                        employeesInitialValue={employeesInitialValue}
                    />

                </div>
            </div>
        </Form>
    </div>);
};

export default AddEmployees;