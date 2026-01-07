import React, {useState} from 'react';
import * as yup from "yup"
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {DatePicker, Form, Input, message, Select, TimePicker} from "antd";
import moment from "moment";


import './addEmployeesView.css';
import styled from "styled-components";
import TextArea from "antd/es/input/TextArea";
import AddRelativesTableView from "./AddRelativesTableView";
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
const AddEmployeesView = (props) => {

const {
    employeesInitialValue,
    setEmployeesInitialValue,
    setOpenAddemployeesView,
    employeesView
}=props
    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);
    const [modalAddEmployeesData, setModalAddEmployeesData] = useState([]);
    const [modalEmployee, setModalEmployee] = useState({selectedRowKeys: []})
    const [initialValue, setInitialValue]=useState({
        user_id: '',
        fullname: employeesView.fullname,
        date_of_birth: '',
        nationality: employeesView.nationality,
        address: employeesView.address,
        passport_seria: employeesView.passport_seria,
        passport_given_date: '',
        passport_given_by: employeesView.passport_given_by,
        party_membership: employeesView.party_membership,
        labour_experience: employeesView.labour_experience,
        experience_term: employeesView.experience_term,
        last_workplace: employeesView.last_workplace,
        last_workplace_position: employeesView.last_workplace_position,
        fired_date: '',
        firing_reason: employeesView.firing_reason,
        relatives: [],
        education: {
            institution: employeesView.education.institution,
            degree: employeesView.education.degree,
            specialization:employeesView.education.specialization,
            started_date: '',
            ended_date:'',
            diploma_seria:employeesView.education.diploma_seria,
        },
        military_service: {
            group_account: employeesView.military_service.group_account,
            account_category: employeesView.military_service.account_category,
            content: employeesView.military_service.content,
            rank: employeesView.military_service.rank,
            special_account_number: employeesView.military_service.special_account_number,
            specialization: employeesView.military_service.specialization,
            period: employeesView.military_service.period,
            name: employeesView.military_service.name,
            address: employeesView.military_service.address
        },
        appointment: {
            the_date: '',
            department: employeesView.appointment.department,
            specialization: employeesView.appointment.specialization,
            razryad: employeesView.appointment.razryad,
            basis: employeesView.appointment.basis
        },
        labour_vacation: {
            type: employeesView.labour_vacation.type,
            period: employeesView.labour_vacation.period,
            from_date: '',
            to_date: '',
            basis: employeesView.labour_vacation.basis
        },
        extra_info:employeesView.extra_info,
    })






    return (<div>
        <Form
            name="basic"
            layout="vertical"
            requiredMark='optional'
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={initialValue}
        >
            <div className="information_content1">
                <div className="information_content_inner_no_title">
                    <div className="information_content_items">
                        <div className="information_content_title">
                            <div className="title_vertcal_line"></div>
                            Xodim haqida ma’lumot
                        </div>
                        <hr/>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                I. Shaxsiy ma’lumotlar
                            </div>
                            <div className="add_employees_forms">
                                <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                            {employeesView && employeesView.fullname && employeesView.fullname}
                                        </span>
                                    <div className="add_employee_button_right"
                                         onClick={() => setIsOpenModalAddEmployee(false)}>
                                        <BsThreeDots/>
                                    </div>
                                </div>

                                <Form.Item
                                    label={t("Tug’ilgan sana")}
                                    name="date_of_birth"
                                    rules={[{
                                        required: true, message: t('Otasining ismi kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={employeesView.date_of_birth}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        disabled={true}
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
                                        disabled={true}
                                        value={employeesView.nationality}
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
                                        disabled={true}
                                    />
                                </Form.Item>
                            </div>

                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Pasport seriyasi va raqami")}
                                    name='passport_seria'
                                    rules={[{
                                        required: true, message: t('Pasport seriyasi va raqami kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        disabled={true}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Berilgan sana")}
                                    name="passport_given_date"
                                    rules={[{
                                        required: true, message: t('Berilgan sana kiriting'),
                                    },]}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        disabled={true}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Kim tomonidan berilgan")}
                                    name='passport_given_by'
                                    rules={[{
                                        required: true, message: t('Kim tomonidan berilgan kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={t("Kiritish")}
                                        disabled={true}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t("Partiyaviyligi")}
                                    name="party_membership"
                                    className="duasbled_select"
                                    rules={[{
                                        required: true, message: t('Partiyaviyligi kiriting'),
                                    },]}

                                >
                                    <SelectStyles
                                        placeholder={t("Tanlang")}
                                        style={{width: "100%"}}
                                        disabled={true}
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
                                        placeholder={employeesView.labour_experience}
                                        disabled={true}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Staj davomiyligi")}
                                    name="experience_term"
                                    rules={[{
                                        required: true, message: t('Staj davomiyligi'),
                                    },]}
                                >
                                    <Input
                                        type="number"
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={employeesView.experience_term}
                                        disabled={true}
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
                                        placeholder={employeesView.last_workplace}
                                        disabled={true}
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
                                        placeholder={employeesView.last_workplace_position}
                                        disabled={true}
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
                                        placeholder={moment(employeesView.fired_date).format('YYYY-MM-DD')}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        disabled={true}
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
                                        placeholder={employeesView.firing_reason}
                                        disabled={true}
                                    />
                                </Form.Item>


                            </div>

                            <div className="add_relatives">
                                <div className="add_relatives_title">Qarindoshlar:</div>
                                <div className="add_relatives_table">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th className="table_index">Qator</th>
                                            <th>Qarindoshlik</th>
                                            <th>F.I.SH</th>
                                            <th>Tug’ilgan sana</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {employeesView.relatives.map((row, index) => (

                                            <tr key={row.id}>
                                                <td className="relatives_table_add_icon">{index+1}</td>
                                                <td>{
                                                    // row.relation
                                                    row.relation==1 ? 'Otasi' :
                                                        row.relation==2 ? 'Onasi' :
                                                            row.relation==3 ? 'Akasi':
                                                                row.relation==4 ? 'Ukasi' :
                                                                    row.relation==5 ? 'Opasi' :
                                                                        row.relation==6 ? 'Singlisi':
                                                                            row.relation==7 ? 'Ayoli':
                                                                                row.relation==8 ? `O'g'li`:
                                                                                    row.relation==9 ?'Qizi' : ''
                                                }
                                                </td>
                                                <td>{row.fullname}</td>
                                                <td>{row.date_of_birth}</td>
                                            </tr>))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                II. Ta’lim haqida ma’lumot
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
                                        placeholder={employeesView.education.institution}
                                        disabled={true}
                                        // onChange={(e) => setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, institution: e.target.value}})}
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
                                        placeholder={employeesView.education.degree == 1 ? `O'rta maxsus`
                                            : employeesView.education.degree == 2? `To'liqsiz oliy`
                                                : employeesView.education.degree ==3 ? `Oliy`
                                                    :employeesView.education.degree ==4 `Phd`}
                                        style={{width: "100%"}}
                                        // onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, degree: e}})}
                                        disabled={true}
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
                                        placeholder={employeesView.education.specialization}
                                        disabled={true}
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
                                            placeholder={moment(employeesView.education.started_date).format('YYYY-MM-DD')}
                                            size="large"
                                            style={{width: "100%", borderRadius: '5px'}}
                                            disabled={true}
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
                                            placeholder={moment(employeesView.education.ended_date).format('YYYY-MM-DD')}
                                            size="large"
                                            style={{width: "100%", borderRadius: '5px'}}
                                            disabled={true}
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
                                        placeholder={employeesView.education.diploma_seria}
                                        disabled={true}
                                        // onChange={(e)=> setEmployeesInitialValue({...employeesInitialValue, education: {...employeesInitialValue.education, diploma_seria: e.target.value}})}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                III. Harbiy ma’lumotnoma
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
                                        placeholder={employeesView.military_service.group_account}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.account_category}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.content}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.rank}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.special_account_number}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.specialization}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.period}
                                        disabled={true}
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
                                        placeholder={employeesView.military_service.name}
                                        disabled={true}
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
                                    placeholder={employeesView.military_service.address}
                                    disabled={true}
                                />
                            </Form.Item>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                IV. Tayinlanish
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
                                        placeholder={moment(employeesView.appointment.the_date).format('YYYY-MM-DD')}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        disabled={true}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={t("Bo’lim")}
                                    name="department"
                                    rules={[{
                                        required: true, message: t('Bo’lim kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={employeesView.appointment.department}
                                        disabled={true}
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
                                        placeholder={employeesView.appointment.specialization}
                                        disabled={true}
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
                                        placeholder={employeesView.appointment.razryad}
                                        disabled={true}
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
                                        placeholder={employeesView.appointment.basis}
                                        disabled={true}
                                    />
                                </Form.Item>

                            </div>

                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                V. Mehnat ta’tili
                            </div>
                            <div className="add_employees_forms">
                                <Form.Item
                                    label={t("Ta’til turi ko’rinishi")}
                                    name='type'
                                    rules={[{
                                        required: true, message: t('Ta’til turi ko’rinishi kiriting'),
                                    },]}
                                >
                                    <Input
                                        className={`working_payment_input ${isDarkMode && "darkModeInputBackgraund darkModeColor"}`}
                                        style={{width: "100%"}}
                                        placeholder={employeesView.labour_vacation.type}
                                        disabled={true}
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
                                        placeholder={employeesView.labour_vacation.period}
                                        disabled={true}
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
                                        disabled={true}
                                        placeholder={moment(employeesView.labour_vacation.from_date).format("YYYY-MM-DD")}
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
                                        disabled={true}
                                        placeholder={moment(employeesView.labour_vacation.to_date).format("YYYY-MM-DD")}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
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
                                    placeholder={employeesView.labour_vacation.basis}
                                    disabled={true}
                                />
                            </Form.Item>
                        </div>

                        <div className="add_employees">
                            <div className="add_employees_forms_title">
                                VI. Qo’shimcha ma’lumotlar
                            </div>
                            <Form.Item name="extra_info" label={t("Ma’lumot")}>
                                <TextArea
                                    rows={5}
                                    autoSize={{minRows: 5, maxRows: 5}}
                                    placeholder={employeesView.extra_info}
                                    disabled={true}
                                />
                            </Form.Item>

                        </div>


                        {/*<div className="information_content_buttons">*/}
                        {/*    <div className="information_content_buttons_inner_view">*/}
                        {/*        <button onClick={()=> setOpenAddemployeesView(false)} className="delete_button">Yopish</button>*/}
                        {/*        /!*<button className="add_button_and_save_button">Saqlash</button>*!/*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className='dismissal_job_acceptance_form_viewButton'>
                            <button className="add_terminal_cancel_button" onClick={()=> setOpenAddemployeesView(false)}
                                    type='button'>{t("Yopish")}
                            </button>
                        </div>

                    </div>

                    <ModalAddEmployee
                        isOpenModalAddEmployee={isOpenModalAddEmployee}
                        setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                        modalAddEmployeesData={modalAddEmployeesData}
                        setModalAddEmployeesData={setModalAddEmployeesData}
                        // rowSelection={rowSelection}
                        modalEmployee={modalEmployee}
                        setModalEmployee={setModalEmployee}
                        setEmployeesInitialValue={setEmployeesInitialValue}
                        employeesInitialValue={employeesInitialValue}
                    />

                </div>
            </div>
        </Form>
    </div>);
};

export default AddEmployeesView;