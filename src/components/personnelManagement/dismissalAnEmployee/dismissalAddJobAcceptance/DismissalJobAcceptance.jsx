import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import './dismissalJobAcceptance.css';
import {DatePicker, Form, Input, message, Select} from "antd";
import Modal from "react-modal";
import axios from "axios";
import {ip} from "../../../../ip";
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";
import moment from "moment";
import {IoIosCloseCircle, IoMdAddCircle} from "react-icons/io";
import {BsThreeDots} from 'react-icons/bs';
import ModalAddEmployee from "../modalAddEmployee/ModalAddEmployee";
import TextArea from "antd/es/input/TextArea";

// const {TextArea} = Input;

const DismissalJobAcceptance = (props) => {

    const {
        setChangePageDismissal,
        setDismissalInitialValues,
        dismissalInitialValues,
        employeeDismissalPaginationLimit,
        employeeDismissalPaginationCurrent,
        getEmployeeData,
        view,
        setView
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [isOpenModalAddDismissal, setIsOpenModalAddDismissal] = useState(false);

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

    useEffect(() => {
        getCompanyData();
    }, [employeeDismissalPaginationLimit, employeeDismissalPaginationCurrent]);


    const companyIndexSave = (e) => {
        setComponyIndex(e);
    }

    const [userId, setUserId] = useState({});

    const cancel = () => {
        setChangePageDismissal(false);
        setView(false);
        setUserId({});
        setCompanyData([]);
        setComponyIndex(null);
        setDepartmentIndex(null);
        setPositionIndex(null);
        setSectionAreaIndex(null);
        setPositionSign(null);
        setPositionManager(null);
        setDismissalInitialValues({
            accountant: '',
            association: '',
            association_sign_date: '',
            basis: '',
            company_name: '',
            created_time: '',
            degree: '',
            department: '',
            filename: '',
            fullname: '',
            id: '',
            level: '',
            main_basis: '',
            not_worked_days: '',
            order_date: '',
            order_number: '',
            position: '',
            reason: '',
            recorded_date: '',
            section_area: '',
            staff_sign_date: '',
            tabel_number: '',
            user_id: '',
            worked_days: '',
        })
    }


    const onFinish = (values) => {
        const formData = {
            ...values,

            user_id: userId.id ? userId.id : dismissalInitialValues.user_id,
            fullname: userId.fullname ? userId.fullname : dismissalInitialValues.fullname,

            company_name: companyData[componyIndex]?.full_name ? companyData[componyIndex]?.full_name : dismissalInitialValues.company_name,
            department: companyData[componyIndex]?.department[departmentIndex]?.full_name ? companyData[componyIndex]?.department[departmentIndex]?.full_name : dismissalInitialValues.department,
            section_area: companyData[componyIndex]?.department[departmentIndex]?.section_area[sectionAreaIndex] ? companyData[componyIndex]?.department[departmentIndex]?.section_area[sectionAreaIndex] : dismissalInitialValues.section_area,
            position: companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.full_name ? companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.full_name : dismissalInitialValues.position,

            order_date: values.order_date ? moment(values.order_date).format('MM-DD-YYYY') : '',
            recorded_date: values.recorded_date ? moment(values.recorded_date).format('MM-DD-YYYY') : '',
            association_sign_date: values.association_sign_date ? moment(values.association_sign_date).format('MM-DD-YYYY') : '',
            staff_sign_date: values.staff_sign_date ? moment(values.staff_sign_date).format('MM-DD-YYYY') : '',
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        if (dismissalInitialValues.edit) {
            axios.put(`${ip}/access-control-service/api/fire_staff/${dismissalInitialValues.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success(t("Ma'lumotlar o'zgartirildi"), 5);
                    getEmployeeData(employeeDismissalPaginationCurrent);
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        } else {
            axios.post(`${ip}/access-control-service/api/fire_staff/`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(respons => {
                    // console.log(respons);
                    message.success(t("Yangi qo'shildi"), 5);
                    getEmployeeData(employeeDismissalPaginationCurrent);
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
    }


    const [positionManager, setPositionManager] = useState(null);
    const [positionSign, setPositionSign] = useState(null);


    const changePosition = (e) => {
        setPositionIndex(e);
        setPositionSign(companyData[componyIndex]?.department[departmentIndex]?.position[e]?.sign);
    }

    const changeDepartment = (e) => {
        setDepartmentIndex(e);
        setPositionManager(companyData[componyIndex]?.department[e]?.manager);
    }

    return (
        <div className="dismissal_job_acceptance">
            <div className="dismissal_job_acceptance_title">
                <div className="dismissal_job_acceptance_title_line"></div>
                <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                    {t('Mehnat shartnomasini bekor qilish ma’lumotlarini shakllantirish')}
                </p>
            </div>

            <div className="dismissal_job_acceptance_form">
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={dismissalInitialValues}
                    disabled={view}
                >
                    <div className="dismissal_job_acceptance_form_inner1">
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Korxona")}</span>
                            <Form.Item name="company_name" rules={[{
                                required: true,
                                message: "Korxonani tanlang"
                            }]}
                            >
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    onChange={companyIndexSave}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
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
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Buyruq NOK raqami")}</span>
                            <Form.Item name="order_number" rules={
                                [{
                                    required: true,
                                    message: t("Buyruq raqami kiriting")
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Buyruq sanasi")}</span>
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
                                />
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Xodim")}</span>
                            <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                           {
                                               dismissalInitialValues.edit && !userId.fullname ? dismissalInitialValues.fullname
                                                   : !dismissalInitialValues.edit && userId.fullname ? userId.fullname
                                                   : dismissalInitialValues.edit && userId.fullname ? userId.fullname
                                                       : t("Tanlash")
                                           }
                                        </span>
                                {/*<div className="add_employee_button_right"*/}
                                <div className={view ? "add_employee_button_right add_employee_disabled" : "add_employee_button_right"}
                                     onClick={() => setIsOpenModalAddDismissal(true)}>
                                    <BsThreeDots/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dismissal_job_acceptance_form_inner1">
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Bo'lim")}</span>
                            <Form.Item name="department" rules={[{
                                required: true,
                                message: t("Bo'limni tanlang")
                            }]}>
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    onChange={(e) => {
                                        changeDepartment(e)
                                    }}>
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
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
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Tarmoq")}</span>
                            <Form.Item name="section_area" rules={[{
                                required: true,
                                message: t("Tarmoq tanlang")
                            }]}>
                                <SelectStyles placeholder={t("Tanlang")} onChange={(e) => {
                                    setSectionAreaIndex(e)
                                }}>
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
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
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Kasbi, lavozimi")}</span>
                            <Form.Item name="position" rules={[{
                                required: true,
                                message: t("Lavozimini tanlang")
                            }]}>
                                <SelectStyles placeholder={t("Tanlang")} onChange={(e) => {
                                    changePosition(e)
                                }}>
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
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
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Toifa")}</span>
                            <Form.Item name="degree"
                                       rules={[{
                                           required: true,
                                           message: t("Toifa kiriting")
                                       }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>tabel
                        </div>
                    </div>

                    <div className="dismissal_job_acceptance_form_inner12">
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Tabel raqami")}</span>
                            <Form.Item name="tabel_number"
                                       rules={[{
                                           required: true,
                                           message: t("Tabel raqami kiriting")
                                       }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Tarif darajasi")}</span>
                            <Form.Item name="level"
                                       rules={[{
                                           required: true,
                                           message: t("Tarif darajasi kiriting")
                                       }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Asos")}</span>
                            <Form.Item name="basis" rules={[{
                                required: true,
                                message: t("Asos kiriting")
                            }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="dismissal_job_acceptance_form_inner11">
                        <div className="dismissal_job_acceptance_form_field">
                            <span
                                className="dismissal_job_acceptance_form_field_span">{t("Shartnomani bekor qilish sababi")}</span>
                            <Form.Item name="reason" rules={[{
                                required: true,
                                message: "Shartnomani bekor qilish sababi kiriting"
                            }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span
                                className="dismissal_job_acceptance_form_field_span">{t("Shartnoma bekor qilish sanasi")}</span>
                            <Form.Item
                                name="recorded_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Shartnomani bekor qilish sanasi tanlang"),
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

                    <div className="dismissal_job_acceptance_form_inner7">
                        <div className="dismissal_job_acceptance_form_field">
                            <span
                                className="dismissal_job_acceptance_form_field_span">{t("Mehnat shartnomasini bekor qilish xususidagi kasaba uyushmasi qo’mitasining roziligi")}</span>
                        </div>
                    </div>

                    <div className="dismissal_job_acceptance_form_inner6">
                        <div className="dismissal_job_acceptance_form_field">
                            <span
                                className="dismissal_job_acceptance_form_field_span">{t("Kasaba uyushmasi yig'ilish qarori")}</span>
                            <Form.Item name="association" rules={
                                [{
                                    required: true,
                                    message: t("Kasaba uyushmasi yig'ilish qarori kiriting")
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Sanasi")}</span>
                            <Form.Item
                                name="association_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Sanasini tanlang"),
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
                    <div className="dismissal_job_acceptance_form_inner4">
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Buxgalter")}</span>
                            <Form.Item name="accountant" rules={[{
                                required: true,
                                message: t("Buxgalter kiriting")
                            }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span
                                className="dismissal_job_acceptance_form_field_span">{t("Mehnat tatilidan ishlanmagan kun")}</span>
                            <Form.Item name="not_worked_days" rules={[{
                                required: true,
                                message: t("Mehnat tatilidan ishlanmagan kun kiring")
                            }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span
                                className="dismissal_job_acceptance_form_field_span">{t("Mehnat tatilidan foydalanilmagan kun")}</span>
                            <Form.Item name="worked_days" rules={[{
                                required: true,
                                message: t("Foydalanilmagan kun kiriting")
                            }]}>
                                <Input placeholder={t("Kiriting")}/>
                            </Form.Item>
                        </div>
                        <div className="dismissal_job_acceptance_form_field">
                            <span className="dismissal_job_acceptance_form_field_span">{t("Xodim imzo sanasi")}</span>
                            <Form.Item
                                name="staff_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Xodim imzo sanas tanlang"),
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

                    {/*<div className="dismissal_job_acceptance_form_inner7">*/}
                    {/*    <div className="dismissal_job_acceptance_form_field">*/}
                    {/*        <span className="dismissal_job_acceptance_form_field_span">{t("Asoslar:")}</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="dismissal_job_acceptance_form_inner8">
                        <div>
                            <span className="dismissal_job_acceptance_form_field_span">{t("Asos")}</span>
                        </div>
                        <div className="dismissal_job_acceptance_form_inner8_inner">
                            <div className="dismissal_job_acceptance_form_field">
                                <Form.Item name="main_basis" rules={
                                    [{
                                        required: true,
                                        message: t("Asos kiriting")
                                    }]
                                }>
                                    <TextArea
                                        placeholder={t("Kiriting")}
                                        rows={5}
                                        autoSize={{minRows: 5, maxRows: 5}}
                                    />
                                </Form.Item>
                            </div>
                            {/*<div className="dismissal_job_acceptance_form_inner8_right"><IoMdAddCircle size={"18px"}/></div>*/}
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
                        <div className='dismissal_job_acceptance_form_viewButton'>
                            <button className="add_terminal_cancel_button" onClick={cancel}
                                    type='button'>{t("Yopish")}
                            </button>
                        </div>
                    }

                </Form>
            </div>

            <ModalAddEmployee
                modalAddEmployee={isOpenModalAddDismissal}
                setModalAddEmployee={setIsOpenModalAddDismissal}
                setUserId={setUserId}
            />

        </div>
    );
};

export default DismissalJobAcceptance;