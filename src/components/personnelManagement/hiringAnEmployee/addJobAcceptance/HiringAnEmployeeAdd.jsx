import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import './addJobAcceptance.css';
import {DatePicker, Form, Input, message, Select} from "antd";
import Modal from "react-modal";
import axios from "axios";
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";
import moment from "moment";
import {BsThreeDots} from 'react-icons/bs';
import ModalAddEmployee from "../modalAddEmployee/ModalAddEmployee";
import {ip} from "../../../../ip";
import TextArea from "antd/es/input/TextArea";

const HiringAnEmployeeAdd = (props) => {

    const {
        setChangePage,
        hiringInitialValues,
        setHiringInitialValues,
        employeePaginationLimit,
        employeePaginationCurrent,
        getEmployeeData,
        view,
        setView
    } = props;


    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [disabled1, setDisabled1] = useState(false);
    const [disabled2, setDisabled2] = useState(false);
    const [disabled3, setDisabled3] = useState(false);

    const [modalAddEmployeesData, setModalAddEmployeesData] = useState([]);
    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);

    const [modalAddEmployee, setModalAddEmployee] = useState(false);
    const [companyData, setCompanyData] = useState([])
    const [componyIndex, setComponyIndex] = useState(null);
    const [departmentIndex, setDepartmentIndex] = useState(null);
    const [positionIndex, setPositionIndex] = useState(null);
    const [sectionAreaIndex, setSectionAreaIndex] = useState(null);

    const getCompanyData = async () => {
        const result = await axios.get(`${ip}/access-control-service/api/allwithdata/company`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = result.data;
        // console.log(data)
        setCompanyData(data);
    };



    const [userId, setUserId] = useState({});

    const cancel = () => {
        setChangePage(false);
        setView(false);
        setUserId({});
        setCompanyData([]);
        setComponyIndex(null);
        setDepartmentIndex(null);
        setPositionIndex(null);
        setSectionAreaIndex(null);
        setPositionSign(null);
        setPositionManager(null);
        setDirectorName(null);
        setHiringInitialValues({
            company_name: '',
            company_director: '',
            order_number: '',
            order_date: '',
            user_id: '',
            fullname: '',
            hiring_date: '',
            trial_from_date: '',
            trial_to_date: '',
            certain_from_date: '',
            certain_to_date: '',
            placement_from_date: '',
            placement_to_date: '',
            department: '',
            section_area: '',
            level: '',
            salary: '',
            degree: '',
            position: '',
            tabel_number: '',
            recorded_date: '',
            testable_from_date: '',
            testable_to_date: '',
            department_director: '',
            department_director_sign_date: '',
            medical_report: '',
            medical_report_sign_date: '',
            safety_regulations: '',
            fire_prevention_instruction: '',
            introductory_guide: '',
            staff_sign_date: '',
        })
    }

    const onFinish = (values) => {
        const formData = {
            ...values,

            user_id: userId.id ? userId.id : hiringInitialValues.user_id,
            fullname: userId.fullname ? userId.fullname : hiringInitialValues.fullname,

            company_name: companyData[componyIndex]?.full_name ? companyData[componyIndex]?.full_name : hiringInitialValues.company_name,
            company_director: companyData[componyIndex]?.director_fullname ? companyData[componyIndex]?.director_fullname : hiringInitialValues.company_director,
            department: companyData[componyIndex]?.department[departmentIndex]?.full_name ? companyData[componyIndex]?.department[departmentIndex]?.full_name : hiringInitialValues.department,
            section_area: companyData[componyIndex]?.department[departmentIndex]?.section_area[sectionAreaIndex] ? companyData[componyIndex]?.department[departmentIndex]?.section_area[sectionAreaIndex] : hiringInitialValues.section_area,
            position: companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.full_name ? companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.full_name : hiringInitialValues.position,
            position_sign: companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.short_name ? companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.short_name : hiringInitialValues.position_sign,
            department_director: companyData[componyIndex]?.department[departmentIndex]?.manager ? companyData[componyIndex]?.department[departmentIndex]?.manager : hiringInitialValues.department_director,


            order_date: values.order_date ? moment(values.order_date).format('MM-DD-YYYY') : '',
            hiring_date: values.hiring_date ? moment(values.hiring_date).format('MM-DD-YYYY') : '',
            trial_from_date: values.trial_from_date ? moment(values.trial_from_date).format('MM-DD-YYYY') : '',
            trial_to_date: values.trial_to_date ? moment(values.trial_to_date).format('MM-DD-YYYY') : '',
            certain_from_date: values.certain_from_date ? moment(values.certain_from_date).format('MM-DD-YYYY') : '',
            certain_to_date: values.certain_to_date ? moment(values.certain_to_date).format('MM-DD-YYYY') : '',
            placement_from_date: values.placement_from_date ? moment(values.placement_from_date).format('MM-DD-YYYY') : '',
            placement_to_date: values.placement_to_date ? moment(values.placement_to_date).format('MM-DD-YYYY') : '',
            recorded_date: values.recorded_date ? moment(values.recorded_date).format('MM-DD-YYYY') : '',
            testable_from_date: values.testable_from_date ? moment(values.testable_from_date).format('MM-DD-YYYY') : '',
            testable_to_date: values.testable_to_date ? moment(values.testable_to_date).format('MM-DD-YYYY') : '',
            department_director_sign_date: values.department_director_sign_date ? moment(values.department_director_sign_date).format('MM-DD-YYYY') : '',
            medical_report_sign_date: values.medical_report_sign_date ? moment(values.medical_report_sign_date).format('MM-DD-YYYY') : '',
            staff_sign_date: values.staff_sign_date ? moment(values.staff_sign_date).format('MM-DD-YYYY') : '',
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        if (hiringInitialValues.edit) {
            axios.put(`${ip}/access-control-service/api/hire_staff/${hiringInitialValues.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success("Ma'lumotlar o'zgartirildi", 5);
                    getEmployeeData(employeePaginationCurrent);
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        } else {
            axios.post(`${ip}/access-control-service/api/hire_staff/`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(respons => {
                    // console.log(respons);
                    message.success("Yangi qo'shildi", 5);
                    getEmployeeData(employeePaginationCurrent);
                    cancel();
                })
                .catch(err => {
                    message.error(err?.response?.data?.msg);
                    console.log(err?.response?.data?.msg);
                })
        }

    }

    const onFinishFailed = (error) => {
        console.log(error)
        // console.log(moment(error.values.trial_from_date).format('MM-DD-YYYY'))
    }

    useEffect(() => {
        getCompanyData();
    }, [employeePaginationLimit, employeePaginationCurrent]);

    // useEffect(() => {
    //     companyData[componyIndex]?.department[departmentIndex]?.manager,
    //         companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.sign
    // }, [componyIndex, departmentIndex, positionIndex, sectionAreaIndex]);

    const  [positionManager , setPositionManager] = useState(null);
    const  [positionSign , setPositionSign] = useState(null);



    const changePosition = (e) =>{
        setPositionIndex(e);
        setPositionSign(companyData[componyIndex]?.department[departmentIndex]?.position[e]?.sign);
    }

    const changeDepartment = (e) =>{
        setDepartmentIndex(e);
        setPositionManager(companyData[componyIndex]?.department[e]?.manager);
    }

    const  [directorName , setDirectorName] = useState(null);
    const companyIndexSave = (e) => {
        setComponyIndex(e);
        setDirectorName(companyData[e]?.director_fullname);
    }




    return (
        <div className="add_job_acceptance">

            <div className="add_job_acceptance_title">
                <div className="add_job_acceptance_title_line"></div>
                <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                    {t('Ishga qabul qilish ma’lumotlarini shakllantirish')}
                </p>
            </div>

            <div className="add_job_acceptance_form">
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={hiringInitialValues}
                    disabled={view}
                >
                    <div className="add_job_acceptance_form_inner1">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Korxona")}</span>
                            <Form.Item name="company_name" rules={[{
                                required: true,
                                message: "Korxonani tanlang"
                            }]}
                            >
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={companyIndexSave}
                                    className="disabled_select"
                                    disabled={view}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData?.map((item, index) => (
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={index} key={index}>{item.full_name}
                                        </Select.Option>
                                    ))}
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="change_position_page_form_field_span">{t("Buyruq raqami")}</span>
                            <Form.Item name="order_number" rules={
                                [{
                                    required: true,
                                    message: "Buyruq raqamini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="change_position_page_form_field_span">{t("Buyruq sanasi")}</span>
                            <Form.Item
                                name="order_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Buyruq sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                    // defaultValue = {moment(new Date("2024-09-09T00:00:00.000Z"))}
                                />
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="change_position_page_form_field_span">{t("Xodim")}</span>
                            <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                           {
                                               hiringInitialValues.edit && !userId.fullname ? hiringInitialValues.fullname
                                                   : !hiringInitialValues.edit && userId.fullname ? userId.fullname
                                                   : hiringInitialValues.edit && userId.fullname ? userId.fullname
                                                       : t("Tanlash")
                                           }
                                        </span>
                                <div className={view ? "add_employee_button_right add_employee_disabled" : "add_employee_button_right"}
                                     onClick={() => setIsOpenModalAddEmployee(true)}>
                                    <BsThreeDots/>
                                </div>
                            </div>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Qabul qilish sanasi")}</span>
                            <Form.Item
                                name="hiring_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Qabul qilish sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner2">
                        <span className="add_job_acceptance_form_field_span">{t("Ishga qabul qilish turi")}</span>
                        <div className="add_job_acceptance_form_inner2_inner">
                            <button type="button"
                                    className={disabled1 ? "add_job_acceptance_form_inner2_inner_button_active" : "add_job_acceptance_form_inner2_inner_button"}
                                    onClick={() => setDisabled1(!disabled1)}>{t("Sinov muddati bilan")}</button>
                            <button type="button"
                                    className={disabled2 || hiringInitialValues?.certain_from_date || hiringInitialValues?.certain_to_date ? "add_job_acceptance_form_inner2_inner_button_active" : "add_job_acceptance_form_inner2_inner_button"}
                                    onClick={() => setDisabled2(!disabled2)}>{t("Muayyan muddat bilan")}</button>
                            <button type="button"
                                    className={disabled3 ? "add_job_acceptance_form_inner2_inner_button_active" : "add_job_acceptance_form_inner2_inner_button"}
                                    onClick={() => setDisabled3(!disabled3)}>{t("O’rindoshlik asosida")}</button>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner3">
                        <div className="add_job_acceptance_form_inner3_inner">
                            <span
                                className={!disabled1 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("Sinov muddati")}</span>
                            <div className="add_job_acceptance_form_inner3_inner_inner">
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled1 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-dan")}</span>
                                    <Form.Item
                                        name="trial_from_date"
                                        rules={[
                                            {
                                                required: false,
                                                message: t("Sinov muddati tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            disabled={disabled1 ? false : true}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled1 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-gacha")}</span>
                                    <Form.Item
                                        name="trial_to_date"
                                        rules={[
                                            {
                                                required: false,
                                                message: t("Sinov muddati tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            disabled={disabled1 ? false : true}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="add_job_acceptance_form_inner3_inner">
                            <span
                                className={!disabled2 || hiringInitialValues.certain_from_date === '' ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("Muayyan muddati")}</span>
                            <div className="add_job_acceptance_form_inner3_inner_inner">
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled2 || hiringInitialValues?.certain_from_date || hiringInitialValues?.certain_to_date ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-dan")}</span>
                                    <Form.Item
                                        name="certain_from_date"
                                        rules={[
                                            {
                                                required: false,
                                                message: t("Muayyan muddatini tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            disabled={disabled2 || hiringInitialValues?.certain_from_date ? false : true}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled2 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-gacha")}</span>
                                    <Form.Item
                                        name="certain_to_date"
                                        rules={[
                                            {
                                                required: false,
                                                message: t("Muayyan muddatini tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            disabled={disabled2 || hiringInitialValues?.certain_to_date ? false : true}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="add_job_acceptance_form_inner3_inner">
                            <span
                                className={!disabled3 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("O’rindoshlik muddati")}</span>
                            <div className="add_job_acceptance_form_inner3_inner_inner">
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled3 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-dan")}</span>
                                    <Form.Item
                                        name="placement_from_date"
                                        rules={[
                                            {
                                                required: false,
                                                message: t("O’rindoshlik muddatini tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            disabled={disabled3 ? false : true}
                                        />
                                    </Form.Item>

                                </div>
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled3 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-gacha")}</span>
                                    <Form.Item
                                        name="placement_to_date"
                                        rules={[
                                            {
                                                required: false,
                                                message: t("O’rindoshlik muddatini tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            disabled={disabled3 ? false : true}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner4">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Rahbar")}</span>
                            {/*<Form.Item name="company_director" rules={*/}
                            {/*    [{*/}
                            {/*        required: false,*/}
                            {/*        message: "Rahbarni kiriting"*/}
                            {/*    }]*/}
                            {/*}>*/}
                                <Input
                                    placeholder={directorName ? directorName : (hiringInitialValues.edit ? hiringInitialValues.company_director : "Kiriting")}
                                    disabled={true}
                                />
                            {/*</Form.Item>*/}
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Bo’lim")}</span>
                            <Form.Item name="department" rules={[{
                                required: true,
                                message: "Bo’limni tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e) =>{changeDepartment(e)}}>
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department?.map((item, index) => (
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={index} key={index}>
                                            {item?.full_name}
                                        </Select.Option>
                                    ))}
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Tarmoq")}</span>
                            <Form.Item name="section_area" rules={[{
                                required: true,
                                message: "Tarmoqni tanlang"
                            }]}>
                                <SelectStyles placeholder="Tanlang" onChange={(e) => {
                                    setSectionAreaIndex(e)
                                }}>
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.section_area?.map((item, index) => (
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={index} key={index}>{item}
                                        </Select.Option>
                                    ))}
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Qayd qilingan sana")}</span>
                            <Form.Item
                                name="recorded_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Qayd qilingan sanani tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner5">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Lavozim")}</span>
                            <Form.Item name="position" rules={[{
                                required: true,
                                message: "Lavozimini tanlang"
                            }]}>
                                <SelectStyles placeholder="Tanlang" onChange={(e) => {changePosition(e)}}>
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.position?.map((item, index) => (
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={index} key={index}>{item?.full_name}
                                        </Select.Option>
                                    ))}
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Kasb")}</span>
                            {/*<Form.Item name="" rules={*/}
                            {/*    [{*/}
                            {/*        required: false,*/}
                            {/*        message: "Kasbini kiriting"*/}
                            {/*    }]*/}
                            {/*}>*/}
                                <Input
                                    placeholder={positionSign ? positionSign : (hiringInitialValues.edit ? hiringInitialValues.position_sign : "Kiriting")}
                                    disabled={true}
                                />
                            {/*</Form.Item>*/}
                        </div>

                        <div className="add_job_acceptance_form_inner5_date">
                            <div className="add_job_acceptance_form_field">
                                <span className="add_job_acceptance_form_field_span">{t("Sinov muddati")}</span>
                                <Form.Item
                                    name="testable_from_date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Sinov muddati tanlang"),
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={`${moment(new Date()).format(
                                            "DD.MM.YYYY"
                                        )}`}
                                        size="large"
                                        style={{borderRadius: '5px'}}
                                    />
                                </Form.Item>
                            </div>
                            <div className="add_job_acceptance_form_field">
                                <span className="add_job_acceptance_form_field_span">{t("Sinov muddati")}</span>
                                <Form.Item
                                    name="testable_to_date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Sinov muddati tanlang"),
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        placeholder={`${moment(new Date()).format(
                                            "DD.MM.YYYY"
                                        )}`}
                                        size="large"
                                        style={{borderRadius: '5px'}}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Maosh (razryad)")}</span>
                            <Form.Item name="salary" rules={
                                [{
                                    required: true,
                                    message: "Maoshini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner10">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Toifa")}</span>
                            <Form.Item name="degree"
                                       rules={[{
                                           required: true,
                                           message: "Toifani kiriting"
                                       }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Tarif darajasi")}</span>
                            <Form.Item name="level"
                                       rules={[{
                                           required: true,
                                           message: "Tarif darajasini kiriting"
                                       }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Tabel raqami")}</span>
                            <Form.Item name="tabel_number"
                                       rules={[{
                                           required: true,
                                           message: "Tabel raqamini kiriting"
                                       }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner6">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Bo’lim, xizmat boshlig’i")}</span>
                            {/*<Form.Item name="department_director" rules={[{*/}
                            {/*    required: false,*/}
                            {/*    message: "Bo’lim, xizmat boshlig’ini kiriting"*/}
                            {/*}]}>*/}
                                <Input
                                    // placeholder={companyData[componyIndex]?.department[departmentIndex]?.manager ? companyData[componyIndex]?.department[departmentIndex]?.manager : "Kiriting"}
                                    // value={companyData[componyIndex]?.department[departmentIndex]?.manager}
                                    placeholder={positionManager ? positionManager : (hiringInitialValues.edit ? hiringInitialValues.department_director : "Kiriting")}
                                    disabled={true}
                                />
                            {/*</Form.Item>*/}
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Sana")}</span>
                            <Form.Item
                                name="department_director_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Bo’lim, xizmat boshlig’i sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Tibbiy ko’rik xulosasi")}</span>
                            <Form.Item name="medical_report"
                                       rules={[{
                                           required: true,
                                           message: "Tibbiy ko‘rik xulosasi kiriting"
                                       }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Sana")}</span>
                            <Form.Item
                                name="medical_report_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Tibbiy ko’rik xulosasi sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner7">
                        <div className="add_job_acceptance_form_field">
                            <span
                                className="add_job_acceptance_form_field_span">{t("Xavfsizlik texnikasi, yong‘inga qarshi eng zarur ma`lumotlar va boshqa yo‘riqnomalar bilan tanishish qaydlari")}</span>
                            <Form.Item name="safety_regulations"
                                       rules={[{
                                           required: true,
                                           message: "Xavfsizlik texnikasi kiriting"
                                       }]}
                            >
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span
                                className="add_job_acceptance_form_field_span">{t("Yong‘indan saqlash yo‘riqnomasi")}</span>
                            <Form.Item name="fire_prevention_instruction"
                                       rules={[{
                                           required: true,
                                           message: "Yong‘indan saqlash yo‘riqnomasini kiriting"
                                       }]}
                            >
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner6">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Tanishtirish yo‘riqnomasi")}</span>
                            <Form.Item name="introductory_guide"
                                       rules={[{
                                           required: true,
                                           message: "Tanishtirish yo‘riqnomasini kiriting"
                                       }]}
                            >
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Xodim imzo sanasi")}</span>
                            <Form.Item
                                name="staff_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Xodim imzo sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {!view ?
                        <div className='access_control_add_staff_terminal_modal_body_buttons'>
                            <div>
                                <button className="add_terminal_cancel_button" onClick={cancel}
                                        type='button'>{t("Bekor qilish")}
                                </button>
                            </div>
                            <div>
                                <button className="add_terminal_save_button" type='submit'>
                                    {t("Saqlash")}
                                </button>
                            </div>
                        </div>
                        :
                        <div className='add_job_acceptance_form_viewButton'>
                            <button className="add_terminal_cancel_button" onClick={cancel}
                                    type='button'>{t("Yopish")}
                            </button>
                        </div>
                    }


                </Form>
            </div>

            <ModalAddEmployee
                modalAddEmployee={isOpenModalAddEmployee}
                setModalAddEmployee={setIsOpenModalAddEmployee}
                setUserId={setUserId}
            />

        </div>
    );
};

export default HiringAnEmployeeAdd;