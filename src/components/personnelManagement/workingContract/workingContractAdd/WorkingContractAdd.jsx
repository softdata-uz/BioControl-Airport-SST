import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import './workingContractAdd.css';
import {DatePicker, Form, Input, message, Select} from "antd";
import Modal from "react-modal";
import axios from "axios";
import {ip} from "../../../../ip";
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";
import moment from "moment";
import ModalAddEmployee from "../modalAddEmployee/ModalAddEmployee";
import {BsThreeDots} from 'react-icons/bs';


const WorkingContractAdd = (props) => {

    const {
        setChangePage,
        setContractInitialValues,
        contractInitialValues,
        workingContractPaginationLimit,
        workingContractPaginationCurrent,
        getEmployeeData,
        view,
        setView
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);


    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);

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
        console.log(data);
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
        setCompanyAdress(null);
        setContractInitialValues({
            company_name: '',
            contract: '',
            contract_type: '',
            created_time: '',
            department: '',
            director_fullname: '',
            director_sign_date: '',
            extra_holidays: '',
            extra_salary: '',
            filename: '',
            fullname: '',
            hourly_salary: '',
            id: '',
            labour_condition: '',
            main_holidays: '',
            monthly_salary: '',
            order_date: '',
            order_number: '',
            position: '',
            staff_address: '',
            staff_sign_date: '',
            trial_period: '',
            user_id: '',
            valid_from_date: '',
            valid_to_date: '',
            working_days_schedule: ''
        })
    }

    const onFinish = (values) => {
        const formData = {
            ...values,

            user_id: userId.id ? userId.id : contractInitialValues.user_id,
            fullname: userId.fullname ? userId.fullname : contractInitialValues.fullname,

            company_name: companyData[componyIndex]?.full_name ? companyData[componyIndex]?.full_name : contractInitialValues.company_name,
            director_fullname: companyData[componyIndex]?.director_fullname ? companyData[componyIndex]?.director_fullname : contractInitialValues.company_director,
            company_address: companyData[componyIndex]?.address ? companyData[componyIndex]?.address : contractInitialValues.company_address,
            department: companyData[componyIndex]?.department[departmentIndex]?.full_name ? companyData[componyIndex]?.department[departmentIndex]?.full_name : contractInitialValues.department,
            // section_area: companyData[componyIndex]?.department[departmentIndex]?.section_area[sectionAreaIndex] ? companyData[componyIndex]?.department[departmentIndex]?.section_area[sectionAreaIndex] : contractInitialValues.section_area,
            position: companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.full_name ? companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.full_name : contractInitialValues.position,
            // position_sign: companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.sign ? companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.sign : contractInitialValues.position_sign,
            // department_director: companyData[componyIndex]?.department[departmentIndex]?.manager ? companyData[componyIndex]?.department[departmentIndex]?.manager : contractInitialValues.department_director,


            order_date: values.order_date ? moment(values.order_date).format('MM-DD-YYYY') : '',
            valid_from_date: values.valid_from_date ? moment(values.valid_from_date).format('MM-DD-YYYY') : '',
            valid_to_date: values.valid_to_date ? moment(values.valid_to_date).format('MM-DD-YYYY') : '',
            staff_sign_date: values.staff_sign_date ? moment(values.staff_sign_date).format('MM-DD-YYYY') : '',
            director_sign_date: values.director_sign_date ? moment(values.director_sign_date).format('MM-DD-YYYY') : '',

        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        if (contractInitialValues.edit) {
            axios.put(`${ip}/access-control-service/api/labour_contract/${contractInitialValues.id}`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
                .then((res) => {
                    message.success("Ma'lumotlar o'zgartirildi", 5);
                    getEmployeeData(workingContractPaginationCurrent);
                    cancel();
                })
                .catch(err =>
                    message.error(err?.response?.data.msg)
                )
        } else {
            axios.post(`${ip}/access-control-service/api/labour_contract/`, fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(respons => {
                    message.success("Yangi qo'shildi", 5);
                    getEmployeeData(workingContractPaginationCurrent);
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

    useEffect(() => {
        getCompanyData();
    }, [workingContractPaginationLimit, workingContractPaginationCurrent]);


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
    const  [companyAdress , setCompanyAdress] = useState(null);
    const companyIndexSave = (e) => {
        setComponyIndex(e);
        setDirectorName(companyData[e]?.director_fullname);
        setCompanyAdress(companyData[e]?.address);
    }



    return (
        <div className="working_contract_add">

            <div className="working_contract_add_title">
                <div className="working_contract_add_title_line"></div>
                <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                    {t('Mehnat shartnomasi shakllantirish')}
                </p>
            </div>

            <div className="working_contract_add_form">
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={contractInitialValues}
                    disabled={view}
                >
                    <div className="working_contract_add_form_inner1">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Korxona")}</span>
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
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Buyruq raqami")}</span>
                            <Form.Item name="order_number" rules={
                                [{
                                    required: true,
                                    message: "Buyruq raqamini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Buyruq sanasi")}</span>
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
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Xodim")}</span>
                            <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                           {
                                               contractInitialValues.edit && !userId.fullname ? contractInitialValues.fullname
                                                   : !contractInitialValues.edit && userId.fullname ? userId.fullname
                                                   : contractInitialValues.edit && userId.fullname ? userId.fullname
                                                       : t("Tanlash")
                                           }
                                        </span>
                                <div className={view ? "add_employee_button_right add_employee_disabled" : "add_employee_button_right"}
                                     onClick={() => setIsOpenModalAddEmployee(true)}>
                                    <BsThreeDots/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="working_contract_add_form_inner1">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Ish beruvchi")}</span>
                            {/*<Form.Item name="director_fullname" rules={*/}
                            {/*    [{*/}
                            {/*        required: false,*/}
                            {/*        message: "Ish beruvchisini kiriting"*/}
                            {/*    }]*/}
                            {/*}>*/}
                                <Input
                                    placeholder={directorName ? directorName : (contractInitialValues.edit ? contractInitialValues.director_fullname : "Kiriting")}
                                    disabled={true}
                                />
                            {/*</Form.Item>*/}
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Korxona manzili")}</span>
                            {/*<Form.Item name="director_fullname" rules={*/}
                            {/*    [{*/}
                            {/*        required: false,*/}
                            {/*        message: "Ish beruvchisini kiriting"*/}
                            {/*    }]*/}
                            {/*}>*/}
                                <Input
                                    placeholder={companyAdress ? companyAdress : (contractInitialValues.edit ? contractInitialValues.company_address : "Kiriting")}
                                    disabled={true}
                                />
                            {/*</Form.Item>*/}
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Bo'lim")}</span>
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
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Kasb, lavozim")}</span>
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
                    </div>


                    <div className="working_contract_add_form_inner1">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Shartnoma")}</span>
                            <Form.Item name="contract" rules={[{
                                required: true,
                                message: "Shartnoma tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    <Select.Option value={"asosiy ish joyidagi"}>asosiy ish joyidagi</Select.Option>
                                    <Select.Option value={'o\'rindoshlik ish joyidagi'}>o'rindoshlik ish joyidagi</Select.Option>

                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Shartnoma turi")}</span>
                            <Form.Item name="contract_type" rules={[{
                                required: true,
                                message: "Shartnoma turini tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    <Select.Option value={'muayyan muddatga'}>muayyan muddatga</Select.Option>
                                    <Select.Option value={'5 yildan ortiq bo\'lmagan muayyan muddatga'}>5 yildan ortiq bo'lmagan muayyan muddatga</Select.Option>
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Shartnoma amal qilish muddati (-dan)")}</span>
                            <Form.Item
                                name="valid_from_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Amal qilish muddatini tanlang"),
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
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Shartnoma amal qilish muddati (-gacha)")}</span>
                            <Form.Item
                                name="valid_to_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Amal qilish muddatini tanlang"),
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
                    </div>

                    <div className="working_contract_add_form_inner17">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Sinov muddati")}</span>
                            <Form.Item name="trial_period" rules={
                                [{
                                    required: true,
                                    message: "Sinov muddatini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Ish kuni tartibi")}</span>
                            <Form.Item name="working_days_schedule" rules={
                                [{
                                    required: true,
                                    message: "Ish kuni tartibini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>

                    </div>

                    <div className="working_contract_add_form_inner18">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Tarif stavkasi (mansab maoshi) oyiga")}</span>
                            <Form.Item name="monthly_salary" rules={[{
                                required: true,
                                message: "Tarif stavkasini kiriting"
                            }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Tarif stavkasi (mansab maoshi) soatiga")}</span>
                            <Form.Item name="hourly_salary" rules={[{
                                required: true,
                                message: "Tarif stavkasini kiriting"
                            }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Tarif stavkasi (mansab maoshi) qo'shimcha")}</span>
                            <Form.Item name="extra_salary" rules={[{
                                required: true,
                                message: "Tarif stavkasini kiriting"
                            }]}>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="working_contract_add_form_inner18">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Asosiy mehnat ta'tili kunlari")}</span>
                            <Form.Item name="main_holidays" rules={
                                [{
                                    required: true,
                                    message: "Kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Qo’shimcha mehnat ta'tili kunlari")}</span>
                            <Form.Item name="extra_holidays" rules={
                                [{
                                    required: true,
                                    message: "Kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Mehnat shartnomasi shartlari")}</span>
                            <Form.Item name="labour_condition" rules={
                                [{
                                    required: true,
                                    message: "Shartlarini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="working_contract_add_form_inner18">
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Xodim manzili")}</span>
                            <Form.Item name="staff_address" rules={
                                [{
                                    required: true,
                                    message: "Xodim manzilini kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"/>
                            </Form.Item>
                        </div>
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Xodim imzo sanasi")}</span>
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
                        <div className="working_contract_add_form_field">
                            <span className="working_contract_add_form_field_span">{t("Direktor imzo sanasi")}</span>
                            <Form.Item
                                name="director_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Direktor imzo sanasini tanlang"),
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
                        <div className='working_contract_add_form_viewButton'>
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

export default WorkingContractAdd;