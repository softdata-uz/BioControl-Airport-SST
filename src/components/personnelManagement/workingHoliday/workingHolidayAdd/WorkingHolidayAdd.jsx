import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import './workingHolidayAdd.css';
import {DatePicker, Form, Input, message, Select} from "antd";
import Modal from "react-modal";
import axios from "axios";
import {SelectStyles} from "../../../accessControl/settings/Terminal-modal/AddAdminModal";
import moment from "moment";
import {ip} from "../../../../ip";
import {BsThreeDots} from "react-icons/bs";
import ModalAddEmployee from "../modalAddEmployee/ModalAddEmployee";


const WorkingHolidayAdd = (props) => {

    const {
        setWorkingHoliday,
        holidayInitialValue,
        setHolidayInitialValue,
        workingHolidayPaginationLimit,
        workingHolidayPaginationCurrent
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);
    const [modalAddEmployeesData, setModalAddEmployeesData] = useState([]);
    const [companyData, setCompanyData]=useState([])
    const [componyIndex, setComponyIndex]=useState(null)
    const [departmentIndex, setDepartmentIndex]=useState(null)
    const [positionIndex, setPositionIndex]=useState(null)

    const getCompanyData = async () => {
        const result = await axios.get(`${ip}/access-control-service/api/allwithdata/company`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = result.data;

        setCompanyData(data);
    }

    const onFinish = (values) => {
        axios.post(`${ip}/access-control-service/api/labour_holiday`,
            holidayInitialValue,
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(respons =>{
                console.log(respons)
                setWorkingHoliday(false)
            })
            .catch(err=>{
                message.error(err.response.data.msg);
                console.log(err.response.data.msg)
            })
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    const disabledDate = (current) =>{
        // Can not select days after today and before start Date
        const start = moment(holidayInitialValue.worked_from_date,'YYYY-MM-DD');
        return  current< start ;
    }

    useEffect(() => {
        getCompanyData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workingHolidayPaginationLimit, workingHolidayPaginationCurrent])

    return (
        <div className="working_holiday_add">

            <div className="working_holiday_add_title">
                <div className="working_holiday_add_title_line"></div>
                <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                    {t("Mehnat ta\'tiliga chiqarishni shakllantirish")}
                </p>
            </div>

            <div className="working_holiday_add_form">
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={holidayInitialValue}
                >
                    <div className="working_holiday_add_form_inner1">
                        <ModalAddEmployee
                            isOpenModalAddEmployee={isOpenModalAddEmployee}
                            setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
                            modalAddEmployeesData={modalAddEmployeesData}
                            setModalAddEmployeesData={setModalAddEmployeesData}
                            holidayInitialValue={holidayInitialValue}
                            setHolidayInitialValue={setHolidayInitialValue}

                        />
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Korxona")}</span>
                            <Form.Item name="company_name" rules={[{
                                required: true,
                                message: "Korxonani tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e)=> {
                                        setHolidayInitialValue({...holidayInitialValue,
                                            company_name: companyData[e].full_name})
                                        setComponyIndex(e)
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>

                                    {companyData && companyData.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                       value={index}  key={index}>{item.full_name}
                                        </Select.Option>
                                    )) }

                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Buyruq raqami")}</span>
                            <Form.Item name="order_number" rules={
                                [{
                                    required: true,
                                    message: "Buyruq raqami kiriting"
                                }]
                            }>
                                <Input
                                    placeholder="Kiriting"
                                    onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                        order_number: e.target.value})}
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Xodim")}</span>
                            <div className="add_employee_button">
                                        <span className='add_employees_fullname'>
                                            {holidayInitialValue.fullname ?
                                                holidayInitialValue.fullname : t("Tanlash")}
                                        </span>
                                <div className="add_employee_button_right"
                                     onClick={() => setIsOpenModalAddEmployee(true)}>
                                    <BsThreeDots/>
                                </div>
                            </div>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Sana")}</span>
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
                                    onChange={(date, dateString)=> setHolidayInitialValue({...holidayInitialValue,
                                        order_date: dateString})}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="working_holiday_add_form_inner1">
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Bo'lim")}</span>
                            <Form.Item name="department" rules={[{
                                required: true,
                                message: "Bo’li tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e)=> {
                                        setHolidayInitialValue({...holidayInitialValue,
                                            department: companyData[componyIndex]?.department[e]?.full_name})
                                        setDepartmentIndex(e)
                                    }}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                       value={index}     key={index}>{item.full_name}
                                        </Select.Option>
                                    )) }
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Tarmoq")}</span>
                            <Form.Item name="section_area" rules={[{
                                required: true,
                                message: "Tarmoq tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e)=> setHolidayInitialValue({...holidayInitialValue,
                                        section_area: e})}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    {companyData && companyData[componyIndex]?.department[departmentIndex]?.section_area.map((item, index) => (
                                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                       value={item}     key={index}>{item}
                                        </Select.Option>
                                    )) }
                                </SelectStyles>
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Toifa")}</span>
                            <Form.Item name="level" rules={
                                [{
                                    required: true,
                                    message: "Toifa kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           level: e.target.value})}
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="change_position_page_form_field_span">{t("Lavozimi")}</span>
                            <Form.Item name="position" rules={[{
                                required: true,
                                message: "Kasbi tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e)=> {setHolidayInitialValue(
                                        {...holidayInitialValue,
                                            position: companyData[componyIndex]?.department[departmentIndex]?.position[e]?.full_name})
                                        setPositionIndex(e)
                                    }
                                    }
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
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
                    </div>

                    <div className="working_holiday_add_form_inner1">
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Tarif darajasi")}</span>
                            <Form.Item name="degree" rules={
                                [{
                                    required: true,
                                    message: "Tarif darajasi"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           degree: e.target.value})}
                                />
                            </Form.Item>
                        </div>

                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Maoshi")}</span>
                            <Form.Item name="salary" rules={
                                [{
                                    required: true,
                                    message: "Maoshi kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           salary: e.target.value})}
                                />
                            </Form.Item>
                        </div>

                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Tabel raqami")}</span>
                            <Form.Item name="tabel_number" rules={
                                [{
                                    required: true,
                                    message: "Tabel raqami kiriting"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           tabel_number: e.target.value})}
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Ish sharoiti")}</span>
                            <Form.Item name="Korxona" rules={[{
                                required: true,
                                message: "Korxonani tanlang"
                            }]}>
                                <SelectStyles
                                    placeholder="Tanlang"
                                    onChange={(e)=> setHolidayInitialValue({...holidayInitialValue, working_condition: e})}
                                >
                                    <Select.Option disabled value="">
                                        <span style={{color: "#bfbfbf"}}>Tanlang</span>
                                    </Select.Option>
                                    <Select.Option value="Og'ir">Og'ir</Select.Option>
                                    <Select.Option value="superadmin">Super Admin</Select.Option>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="operator">Operator</Select.Option>
                                </SelectStyles>
                            </Form.Item>
                        </div>
                    </div>


                    <div className="working_holiday_add_form_inner1">
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("-dan")}</span>
                            <Form.Item
                                // label={t(" ")}
                                name="worked_from_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Qabul qilish sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                    placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                    onChange={(e,a)=>setHolidayInitialValue({...holidayInitialValue, worked_from_date: a})}
                                    size="large"
                                    style={{width: "100%", borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("-gacha")}</span>
                            <Form.Item
                                name="worked_to_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Buyruq sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                    placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                    onChange={(e,a)=>setHolidayInitialValue({...holidayInitialValue, worked_to_date: a})}
                                    size="large"
                                    style={{width: "100%", borderRadius: '5px'}}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Muayyan kalendar kuni")}</span>
                            <Form.Item name="certain_calendar_days" rules={
                                [{
                                    required: true,
                                    message: "Muayyan kalendar kuni"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           certain_calendar_days: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Qo’shimcha ta’til")}</span>
                            <Form.Item name="extra_holiday_days" rules={
                                [{
                                    required: true,
                                    message: "Qo’shimcha ta’til"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           extra_holiday_days: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="working_holiday_add_form_inner1">
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("O’gir, zararli sharoitdagi ish uchun")}</span>
                            <Form.Item name="extra_days_for_difficulties" rules={
                                [{
                                    required: true,
                                    message: "O’gir, zararli sharoitdagi ish uchun"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           extra_days_for_difficulties: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>

                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("12 yoshgacha bolalari bo’lgan onalar uchun")}</span>
                            <Form.Item name="extra_days_for_mothers" rules={
                                [{
                                    required: true,
                                    message: "12 yoshgacha bolalari bo’lgan onalar uchun "
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           extra_days_for_mothers: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Uzluksiz ish staji uchun")}</span>
                            <Form.Item name="extra_days_for_stable_work" rules={
                                [{
                                    required: true,
                                    message: "Uzluksiz ish staji uchun "
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           extra_days_for_stable_work: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Ko’p smenali ish tartibi uchun")}</span>
                            <Form.Item name="extra_days_for_overworking" rules={
                                [{
                                    required: true,
                                    message: "Ko’p smenali ish tartibi uchun "
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           extra_days_for_overworking: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="working_holiday_add_form_inner1">
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Qo’chimcha ta’tilning boshqa turlari uchun")}</span>
                            <Form.Item name="extra_days_for_another_types" rules={
                                [{
                                    required: true,
                                    message: "Qo’chimcha ta’tilning boshqa turlari uchun "
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           extra_days_for_another_types: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("Hammasi bo’lib (Jami ta’til kunlari)")}</span>
                            <Form.Item name="all_days" rules={
                                [{
                                    required: true,
                                    message: "Hammasi bo’lib (Jami ta’til kunlari)"
                                }]
                            }>
                                <Input placeholder="Kiriting"
                                       onChange={(e)=>setHolidayInitialValue({...holidayInitialValue,
                                           all_days: e.target.value})}
                                       type="number"
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("-dan")}</span>
                            <Form.Item
                                name="from_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Buyruq sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                    placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                    onChange={(e,a)=>setHolidayInitialValue({...holidayInitialValue, from_date: a})}
                                    size="large"
                                    style={{width: "100%", borderRadius: '5px'}}
                                />
                            </Form.Item>
                        </div>
                        <div className="working_holiday_add_form_field">
                            <span className="working_holiday_add_form_field_span">{t("-gacha")}</span>
                            <Form.Item
                                name="to_date"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Buyruq sanasini tanlang"),
                                    },
                                ]}
                            >
                                <DatePicker
                                    className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                    placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                    onChange={(e,a)=>setHolidayInitialValue({...holidayInitialValue, to_date: a})}
                                    size="large"
                                    style={{width: "100%", borderRadius: '5px'}}
                                    // disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </div>

                    </div>

                    <div className='access_control_add_staff_terminal_modal_body_buttons'>
                        <div>
                            <button className="add_terminal_cancel_button" onClick={()=>setWorkingHoliday(false)}
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

export default WorkingHolidayAdd;