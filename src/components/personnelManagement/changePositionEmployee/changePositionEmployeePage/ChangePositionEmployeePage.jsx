import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import './changePositionEmployeePage.css';
import {DatePicker, Form, Input, message, Select} from "antd";
import Modal from "react-modal";
import axios from "axios";
import {ip} from "../../../../ip";
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";
import moment from "moment";
import {IoIosCloseCircle,IoMdAddCircle} from "react-icons/io";
import {BsThreeDots} from "react-icons/bs";
import ModalAddEmployee from "../modalAddEmployee/ModalAddEmployee";
import TextArea from "antd/es/input/TextArea";
import MaterialsTable from "./MaterialsTable";


const ChangePositionEmployeePage = (props) => {

    const {
        setChangePageChangePosition,
        changePositionInitialValue,
        setChangePositionInitialValue,
        employeeChangePositionPaginationLimit,
        employeeChangePositionPaginationCurrent
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);
    const [companyData, setCompanyData]=useState([])
    const [componyIndex, setComponyIndex]=useState(null)
    const [departmentIndex, setDepartmentIndex]=useState(null)
    const [positionIndex, setPositionIndex]=useState(null)

    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);
    const [modalAddEmployeesData, setModalAddEmployeesData] = useState([]);

    // console.log(companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.sign)
    //
    // console.log(changePositionInitialValue)
    const getCompanyData = async () => {
        const result = await axios.get(`${ip}/access-control-service/api/allwithdata/company`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = result.data;

        setCompanyData(data);
    }



    const onFinish = (values) => {
        // console.log(changePositionInitialValue)
        axios.post(`${ip}/access-control-service/api/change_rank`,
            changePositionInitialValue,
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(respons =>{
                console.log(respons)
                setChangePageChangePosition(false)
            })
            .catch(err=>{
                message.error(err.response.data.msg);
                console.log(err.response.data.msg)
            })
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    useEffect(() => {
        getCompanyData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeChangePositionPaginationLimit, employeeChangePositionPaginationCurrent])

    return (
        <div className="change_position_page">

            <div className="change_position_page_title">
                <div className="change_position_page_title_line"></div>
                <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                    {t('Boshqa doimiy ishga o’tkazish')}
                </p>
            </div>

            <div className="change_position_page_form">
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={changePositionInitialValue}
                >
                    <div className="change_position_page_form_inner1">
                        <ModalAddEmployee
                            isOpenModalAddEmployee={isOpenModalAddEmployee}
                            setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                            modalAddEmployeesData={modalAddEmployeesData}
                            setModalAddEmployeesData={setModalAddEmployeesData}
                            setChangePositionInitialValue={setChangePositionInitialValue}
                            changePositionInitialValue={changePositionInitialValue}
                            />

                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Korxona")}</span>
                            <Form.Item name="company_name" rules={[{
                                required: true,
                                message: t("Korxonani tanlang")
                            }]}>
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    onChange={(e)=> {
                                        setChangePositionInitialValue({...changePositionInitialValue,
                                            company_name: companyData[e].full_name})
                                        setComponyIndex(e)
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                    </Select.Option>

                                    {companyData && companyData.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                  value={index}  key={index}>{item.full_name}
                                        </Select.Option>
                                    )) }

                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Buyruq raqami")}</span>
                            <Form.Item name="order_number" rules={
                                [{
                                    required: true,
                                    message: t("Buyruq raqami kiriting")
                                }]
                            }>
                                <Input
                                    placeholder={t("Kiriting")}
                                    onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,
                                        order_number: e.target.value})}
                                />
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">
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
                                    onChange={(date, dateString)=> setChangePositionInitialValue({...changePositionInitialValue,
                                        order_date: dateString})}
                                />
                            </Form.Item>
                        </div>

                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Xodim")}</span>
                            <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                            {changePositionInitialValue.fullname ?
                                                changePositionInitialValue.fullname : t("Tanlash")}
                                        </span>
                                <div className="add_employee_button_right"
                                     onClick={() => setIsOpenModalAddEmployee(true)}>
                                    <BsThreeDots/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="change_position_page_form_inner2">
                        <div className="change_position_page_form_inner2_left">
                            <div className="change_position_page_form_field">
                                <span className="change_position_page_form_field_span">{t("Modda")}</span>
                                <Form.Item name="basis" rules={
                                    [{
                                        required: true,
                                        message: t("Modda kiriting")
                                    }]
                                }>
                                    <Input
                                        placeholder={t("Kiriting")}
                                        onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,
                                            basis: e.target.value})}
                                    />
                                </Form.Item>
                                {/*<Form.Item name="basis" rules={*/}
                                {/*    [{*/}
                                {/*        required: true,*/}
                                {/*        message: "Asos kiriting"*/}
                                {/*    }]*/}
                                {/*}>*/}
                                {/*    <Input*/}
                                {/*        placeholder="Kiriting"*/}
                                {/*        onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,*/}
                                {/*            basis: e.target.value})}*/}
                                {/*    />*/}
                                {/*</Form.Item>*/}
                            </div>
                        </div>
                        <div className="change_position_page_form_inner2_right">

                            <div className="change_position_page_form_field">
                                <span className="change_position_page_form_field_span">{t("Ish boshlash sanasi")}</span>
                                <Form.Item
                                    name="change_rank_date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("Ish boshlash sanasi tanlang"),
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
                                        onChange={(date, dateString)=> setChangePositionInitialValue({...changePositionInitialValue,
                                            change_rank_date: dateString})}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className="change_position_page_form_inner1">

                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Ish joyi")}</span>
                            <Form.Item name="work_place_name" rules={
                                [{
                                    required: true,
                                    message: "Ish joyi kiriting"
                                }]
                            }>
                                <Input
                                    placeholder={t("Kiriting")}
                                    onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,
                                        work_place_name: e.target.value})}
                                />
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">

                            <span className="change_position_page_form_field_span">{t("Bo'lim")}</span>
                            <Form.Item name="department" rules={[{
                                required: true,
                                message: t("Bo'limni tanlang")
                            }]}>
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    onChange={(e)=> {
                                        setChangePositionInitialValue({...changePositionInitialValue,
                                            department: companyData[componyIndex]?.department[e]?.full_name})
                                        setDepartmentIndex(e)
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                       value={index}     key={index}>{item.full_name}
                                        </Select.Option>
                                    )) }
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Tarmoq")}</span>
                            <Form.Item name="section_area" rules={[{
                                required: true,
                                message: t("Tarmoq tanlang")
                            }]}>
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    onChange={(e)=> setChangePositionInitialValue({...changePositionInitialValue,
                                        section_area: e})}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.section_area.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                       value={item}     key={index}>{item}
                                        </Select.Option>
                                    )) }
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Razryad (maosh)")}</span>
                            <Form.Item name="salary" rules={
                                [{
                                    required: true,
                                    message: "Razryad kiriting"
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}
                                       onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,
                                           salary: e.target.value})}
                                />
                            </Form.Item>
                        </div>

                    </div>

                    <div className="change_position_page_form_inner1">

                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Toifa")}</span>
                            <Form.Item name="level" rules={
                                [{
                                    required: true,
                                    message: t("Toifa kiriting")
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}
                                       onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,
                                           level: e.target.value})}
                                />
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Lavozimi")}</span>
                            <Form.Item name="position" rules={[{
                                required: true,
                                message: t("Kasbi tanlang")
                            }]}>
                                <SelectStyles
                                    placeholder={t("Tanlang")}
                                    onChange={(e)=> {setChangePositionInitialValue(
                                        {...changePositionInitialValue,
                                        position: companyData[componyIndex]?.department[departmentIndex]?.position[e]?.full_name})
                                        setPositionIndex(e)
                                    }
                                }
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>{t("Tanlang")}</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.position.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                       value={index} key={index}>
                                            {item.full_name}
                                        </Select.Option>
                                    )) }
                                </SelectStyles>
                            </Form.Item>
                        </div>

                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Kasbi")}</span>
                            <Form.Item name="position_sign" rules={
                                [{
                                    required: true,
                                    message: t("Kasb kiriting")
                                }]
                            }>
                                <Input
                                       onChange={(e)=> {setChangePositionInitialValue(
                                           {...changePositionInitialValue,
                                               position_sign: companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.short_name})
                                       }}
                                       placeholder={companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.short_name ? companyData[componyIndex]?.department[departmentIndex]?.position[positionIndex]?.short_name
                                           : t("Kiriting")}
                                       disabled={true}
                                />
                            </Form.Item>
                        </div>
                        <div className="change_position_page_form_field">
                            <span className="change_position_page_form_field_span">{t("Tabel raqami")}</span>
                            <Form.Item name="tabel_number" rules={
                                [{
                                    required: true,
                                    message: t("Tabel raqami kiriting")
                                }]
                            }>
                                <Input placeholder={t("Kiriting")}
                                       onChange={(e)=>setChangePositionInitialValue({...changePositionInitialValue,
                                           tabel_number: e.target.value})}
                                />
                            </Form.Item>
                        </div>

                    </div>

                    <div className="basis_content">
                        <span className="change_position_page_form_field_span">
                            {t("Boshqa ishga o‘tkazishga asos")}
                        </span>
                        <Form.Item name="basis"
                           rules={[{
                                   required: true,
                                   message: t("Kiriting")
                           }]}
                        >
                            <TextArea
                                rows={5}
                                autoSize={{minRows: 3, maxRows: 3}}
                                // name="extra_info"
                                placeholder={t("Kiriting")}
                                onChange={(e)=> setChangePositionInitialValue({...changePositionInitialValue, basis: e.target.value})}
                            />
                        </Form.Item>
                    </div>

                    <div className="medical_info">
                        <span className="medical_info_title">{t("Tibiy ko'rik ma'lumotlari")}</span>

                        <div className="basis_content">
                            <span className="change_position_page_form_field_span">{t("Tibbiy ko'rik xulosasi")}</span>
                            <Form.Item name="medical_report"
                                       rules={[{
                                           required: true,
                                           message: t("Tibbiy ko'rik xulosasi kiriting")
                                       }]}
                            >
                                <TextArea
                                    rows={5}
                                    autoSize={{minRows: 3, maxRows: 3}}
                                    placeholder="Kiriting"
                                    onChange={(e)=> setChangePositionInitialValue({...changePositionInitialValue, medical_report: e.target.value})}
                                />
                            </Form.Item>

                            <span className="change_position_page_form_field_span">{t("Tibbiy ko'rikdan o'tgan sana")}</span>
                            <Form.Item
                                name="medical_report_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Tibbiy ko'rikdan o'tgan sana tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px', width:'100%'}}
                                    onChange={(date, dateString)=> setChangePositionInitialValue({...changePositionInitialValue,
                                        medical_report_sign_date: dateString})}
                                />
                            </Form.Item>

                            <span className="change_position_page_form_field_span">
                                {t("Xavfsizlik texnikasi, yong’inga qarshi eng zarur ma’lumotlar va boshqa yo’riqnomalar bilan tanishish qaydlari")}
                            </span>
                            <Form.Item name="fire_prevention_instruction"
                                       rules={[{
                                           required: true,
                                           message: t("Xavfsizlik texnikasi kiriting")
                                       }]}
                            >
                                <TextArea
                                    rows={5}
                                    autoSize={{minRows: 3, maxRows: 3}}
                                    placeholder={t("Kiriting")}
                                    onChange={(e)=> setChangePositionInitialValue({...changePositionInitialValue, fire_prevention_instruction: e.target.value})}
                                />
                            </Form.Item>

                            <span className="change_position_page_form_field_span">
                                {t("Tanishish yo'riqnomasi")}
                            </span>
                            <Form.Item name="fire_prevention_instruction"
                                       rules={[{
                                           required: true,
                                           message: t("Tanishish yo'riqnomasi kiriting")
                                       }]}
                            >
                                <TextArea
                                    rows={5}
                                    autoSize={{minRows: 3, maxRows: 3}}
                                    placeholder={t("Kiriting")}
                                    onChange={(e)=> setChangePositionInitialValue({...changePositionInitialValue, fire_prevention_instruction: e.target.value})}
                                />
                            </Form.Item>

                            <span className="change_position_page_form_field_span">
                                {t("Hujjat shakllantirilgan sana")}
                            </span>
                            <Form.Item
                                name="medical_report_sign_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Hujjat shakllantirilgan sana tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                    placeholder={`${moment(new Date()).format(
                                        "DD.MM.YYYY"
                                    )}`}
                                    size="large"
                                    style={{borderRadius: '5px', width:'100%'}}
                                    onChange={(date, dateString)=> setChangePositionInitialValue({...changePositionInitialValue,
                                        medical_report_sign_date: dateString})}
                                />
                            </Form.Item>

                            <span className="medical_info_title">
                                {t("Topshirilmagan moddiy buyum mulklari va boshqa qimmatli narsalar haqida ma’lumot")}
                            </span>

                        </div>
                    </div>


                    <div className='access_control_add_staff_terminal_modal_body_buttons'>
                        <div>
                            <button className="add_terminal_cancel_button" onClick={() => setChangePageChangePosition(false)}
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


        </div>
    );
};

export default ChangePositionEmployeePage;