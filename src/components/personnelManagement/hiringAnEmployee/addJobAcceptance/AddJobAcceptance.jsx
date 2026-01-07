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
import ModalAddEmployee from "../../modalAddEmployee/ModalAddEmployee";
import {ip} from "../../../../ip";
import TextArea from "antd/es/input/TextArea";

const AddJobAcceptance = (props) => {

    const {
        setChangePage,
        hiringInitialValues,
        setHiringInitialValues,
        employeePaginationLimit,
        employeePaginationCurrent,
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
    const [departmentIndex, setDepartmentIndex] = useState([])

    const getCompanyData = async () => {
        const result = await axios.get(`${ip}/access-control-service/api/allwithdata/company`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = result.data;
        // console.log(data)
        setCompanyData(data);
    };

    const cancel = () =>{
        setChangePage(false);
        setHiringInitialValues({
            company_name: '',
            company_director : '',
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
        console.log(values)
        axios.post(`${ip}/access-control-service/api/hire_staff`,
            hiringInitialValues,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(respons => {
                console.log(respons);
                setChangePage(false)
            })
            .catch(err => {
                message.error(err.response.data.msg);
                console.log(err.response.data.msg)
            })
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    useEffect(() => {
        getCompanyData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeePaginationLimit, employeePaginationCurrent]);


    console.log(hiringInitialValues)

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
                    // initialValues={hiringInitialValues}
                >
                    <div className="add_job_acceptance_form_inner1">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Korxona")}</span>
                            <Form.Item name="company_name" rules={[{
                                required: true,
                                message: "Korxonani tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e) => {
                                        setHiringInitialValues({
                                            ...hiringInitialValues,
                                            company_name : companyData[e].full_name
                                        })
                                        setComponyIndex(e);
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>

                                    {companyData && companyData.map((item, index) => (
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
                                <Input
                                    placeholder="Kiriting"
                                    onChange={(e) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        order_number: e.target.value
                                    })}
                                />
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
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px'}}
                                    onChange={(date, dateString) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        order_date: dateString
                                    })}
                                />
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="change_position_page_form_field_span">{t("Xodim")}</span>
                            <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                            {hiringInitialValues.fullname ?
                                                hiringInitialValues.fullname : t("Tanlash")}
                                        </span>
                                <div className="add_employee_button_right"
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
                                    onChange={(date, dateString) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        hiring_date: dateString
                                    })}
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
                                    className={disabled2 ? "add_job_acceptance_form_inner2_inner_button_active" : "add_job_acceptance_form_inner2_inner_button"}
                                    onClick={() => setDisabled2(!disabled2)}>{t("Muayyan muddat bilan")}</button>
                            <button type="button"
                                    className={disabled3 ? "add_job_acceptance_form_inner2_inner_button_active" : "add_job_acceptance_form_inner2_inner_button"}
                                    onClick={() => setDisabled3(!disabled3)}>{t("O’rindoshlik asosida")}</button>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner3">
                        <div className="add_job_acceptance_form_inner3_inner">
                            <span className={!disabled1 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("Sinov muddati")}</span>
                            <div className="add_job_acceptance_form_inner3_inner_inner">
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled1 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-dan")}</span>
                                    <Form.Item
                                        name="trial_from_date"
                                        rules={[
                                            {
                                                // required: true,
                                                // message: t("Sinov muddati tanlang"),
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            // placeholder={`${moment(new Date()).format("DD.MM.YYYY")}`}
                                            size="large"
                                            style={{borderRadius: '5px'}}
                                            onChange={(date, dateString) => setHiringInitialValues({
                                                ...hiringInitialValues,
                                                trial_from_date: dateString
                                            })}
                                            disabled={disabled1 ? false : true}
                                            defaultValue={5}
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
                                            onChange={(date, dateString) => setHiringInitialValues({
                                                ...hiringInitialValues,
                                                trial_to_date: dateString
                                            })}
                                            disabled={disabled1 ? false : true}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="add_job_acceptance_form_inner3_inner">
                            <span
                                className={!disabled2 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("Muayyan muddati")}</span>
                            <div className="add_job_acceptance_form_inner3_inner_inner">
                                <div className="add_job_acceptance_form_field">
                                    <span
                                        className={!disabled2 ? "add_job_acceptance_form_field_span disabled" : "add_job_acceptance_form_field_span"}>{t("-dan")}</span>
                                    <Form.Item
                                        name="certain_from_date"
                                        rules={[
                                            {
                                                required: true,
                                                message: t("Muayyan muddatini tanlang"),
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
                                            onChange={(date, dateString) => setHiringInitialValues({
                                                ...hiringInitialValues,
                                                certain_from_date: dateString
                                            })}
                                            disabled={disabled2 ? false : true}
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
                                                required: true,
                                                message: t("Muayyan muddatini tanlang"),
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
                                            onChange={(date, dateString) => setHiringInitialValues({
                                                ...hiringInitialValues,
                                                certain_to_date: dateString
                                            })}
                                            disabled={disabled2 ? false : true}
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
                                                required: true,
                                                message: t("O’rindoshlik muddatini tanlang"),
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
                                            onChange={(date, dateString) => setHiringInitialValues({
                                                ...hiringInitialValues,
                                                placement_from_date: dateString
                                            })}
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
                                                required: true,
                                                message: t("O’rindoshlik muddatini tanlang"),
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
                                            onChange={(date, dateString) => setHiringInitialValues({
                                                ...hiringInitialValues,
                                                placement_to_date: dateString
                                            })}
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
                            <Form.Item name="company_director" rules={[{
                                required: true,
                                message: "Rahbarni tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e) => {
                                        setHiringInitialValues({
                                            ...hiringInitialValues,
                                            company_director: companyData[componyIndex]?.director_fullname
                                        })
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {/*{companyData && companyData[componyIndex]?.company_director.map((item, index) => (*/}
                                    <Select.Option
                                        className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        value={companyData[componyIndex]?.director_fullname}
                                    >
                                        {companyData[componyIndex]?.director_fullname}
                                    </Select.Option>
                                    {/*)) }*/}
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Bo’lim")}</span>
                            <Form.Item name="department" rules={[{
                                required: true,
                                message: "Bo’limni tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e) => {
                                        setHiringInitialValues({
                                            ...hiringInitialValues,
                                            department: companyData[componyIndex]?.department[e]?.full_name
                                        })
                                        setDepartmentIndex(e);
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department.map((item, index) => (
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={index} key={index}>{item.full_name}
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
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e) => {
                                        setHiringInitialValues({...hiringInitialValues, section_area: e})
                                        console.log(e)
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.section_area.map((item, index) => (
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={item} key={index}>{item?.fullname}
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
                                    onChange={(date, dateString) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        recorded_date: dateString
                                    })}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner5">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Kasb")}</span>
                            <Form.Item name="position_sign" rules={
                                [{
                                    required: true,
                                    message: "Kasbini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e) => setHiringInitialValues({
                                           ...hiringInitialValues,
                                           position_sign: e.target.value
                                       })}
                                />
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Lavozim")}</span>
                            <Form.Item name="position" rules={[{
                                required: true,
                                message: "Lavozimini tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        position: e
                                    })}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.position.map((item, index) => (
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={index} key={index}>{item?.fullname}
                                        </Select.Option>
                                    ))}
                                </SelectStyles>
                            </Form.Item>
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
                                        onChange={(date, dateString) => setHiringInitialValues({
                                            ...hiringInitialValues,
                                            testable_from_date: dateString
                                        })}
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
                                        onChange={(date, dateString) => setHiringInitialValues({
                                            ...hiringInitialValues,
                                            testable_to_date: dateString
                                        })}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Maosh (razryad)")}</span>
                            <Form.Item name="salary" rules={
                                [{
                                    required: true,
                                    message: "Razryad kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e) => setHiringInitialValues({
                                           ...hiringInitialValues,
                                           salary: e.target.value
                                       })}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner6">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Bo’lim, xizmat boshlig’i")}</span>
                            <Form.Item name="department_director" rules={[{
                                required: true,
                                message: "Bo’lim, xizmat boshlig’ini tanlang"
                            }]}>
                                <SelectStyles placeholder="Tanlang"
                                              onChange={(e) => setHiringInitialValues({
                                                      ...hiringInitialValues,
                                                      department_director: e
                                                  }
                                              )}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    <Select.Option value="king">
                                        {companyData[componyIndex]?.department[departmentIndex]?.position}
                                    </Select.Option>
                                </SelectStyles>
                            </Form.Item>
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
                                    onChange={(date, dateString) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        department_director_sign_date: dateString
                                    })}
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
                                <Input
                                    placeholder="Kiriting"
                                    onChange={(e) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        medical_report: e.target.value
                                    })}
                                />
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
                                    onChange={(date, dateString) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        medical_report_sign_date: dateString
                                    })}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="add_job_acceptance_form_inner7">
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Xavfsizlik texnikasi, yong‘inga qarshi eng zarur ma`lumotlar va boshqa yo‘riqnomalar bilan tanishish qaydlari")}</span>
                            <Form.Item name="safety_regulations"
                                       rules={[{
                                           required: true,
                                           message: "Xavfsizlik texnikasi kiriting"
                                       }]}
                            >
                                <Input
                                    placeholder="Kiriting"
                                    onChange={(e) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        safety_regulations: e.target.value
                                    })}
                                />
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Yong‘indan saqlash yo‘riqnomasi")}</span>
                            <Form.Item name="fire_prevention_instruction"
                                       rules={[{
                                           required: true,
                                           message: "Yong‘indan saqlash yo‘riqnomasini kiriting"
                                       }]}
                            >
                                <Input
                                    placeholder="Kiriting"
                                    onChange={(e) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        fire_prevention_instruction: e.target.value
                                    })}
                                />
                            </Form.Item>
                        </div>
                        <div className="add_job_acceptance_form_field">
                            <span className="add_job_acceptance_form_field_span">{t("Tanishtirish yo‘riqnomasi")}</span>
                            <Form.Item name="introductory_guide"
                                       rules={[{
                                           required: true,
                                           message: "Tanishtirish yo‘riqnomasini kiriting"
                                       }]}
                            >
                                <Input
                                    placeholder="Kiriting"
                                    onChange={(e) => setHiringInitialValues({
                                        ...hiringInitialValues,
                                        introductory_guide: e.target.value
                                    })}
                                />
                            </Form.Item>
                        </div>
                    </div>

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
                </Form>
            </div>

            <ModalAddEmployee
                isOpenModalAddEmployee={isOpenModalAddEmployee}
                setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                modalAddEmployeesData={modalAddEmployeesData}
                setModalAddEmployeesData={setModalAddEmployeesData}
                setHiringInitialValues={setHiringInitialValues}
                hiringInitialValues={hiringInitialValues}

                // modalAddEmployee={modalAddEmployee}
                // setModalAddEmployee={setModalAddEmployee}
            />

        </div>
    );
};

export default AddJobAcceptance;