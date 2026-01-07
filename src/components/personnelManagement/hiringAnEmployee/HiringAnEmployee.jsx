import React, {useEffect, useState} from 'react';
import './hiringAnEmployee.css';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import {AiOutlineSearch, AiOutlineCaretDown, AiOutlineDelete} from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdAddCircle} from 'react-icons/io';
import EmployeeTable from "./employeeTable/EmployeeTable";
import EmployeePagination from "./employeePagination/EmployeePagination";
import AddJobAcceptance from "./addJobAcceptance/AddJobAcceptance";
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment";
import {message} from "antd";
import EnterpriseTable from "../../organizationalStructure/organizationEnterprise/enterpriseTable/EnterpriseTable";
import HiringAnEmployeeAdd from "./addJobAcceptance/HiringAnEmployeeAdd";
import Modal from "react-modal";


const HiringAnEmployee = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [changePage, setChangePage] = useState(false);
    const [view, setView] = useState(false);

    const [employeePaginationLimit, setEmployeePaginationLimit] = useState(15)
    const [employeePaginationCurrent, setEmployeePaginationCurrent] = useState(1);
    const [employeeTotal, setEmployeeTotal] = useState(null);

    const employeePaginationOnChange = (e = 1, option) => {
        getEmployeeData(e);
        setEmployeePaginationCurrent(e)
        setEmployeePaginationLimit(option)
    }


    const [isOpenEmployee, setIsOpenEmployee] = useState(false);
    const [deleteEmployee, setDeleteEmployee] = useState([]);
    const [employeeSelectionState, setEmployeeSelectionState] = useState({selectedRowKeys: []});

    const [employee, setEmployee] = useState({selectedRowKeys: []});
    const onSelectChange = (selectedRowKeys, a) => {
        setEmployee({selectedRowKeys});
        setDeleteEmployee(a.map(item => item.id));
    };

    const {selectedRowKeys} = employee;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const [hiringInitialValues, setHiringInitialValues] = useState({
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
    });

    const [searchedData, setSearchedData] = useState('');
    const [employeeData, setEmployeeData] = useState([])
    const getEmployeeData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/hire_staff/${employeePaginationLimit}/${id}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
        const {data} = response;
        const count = data.count;
        setEmployeeTotal(count);

        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * employeePaginationLimit,
                created_time: item.created_time ? moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss') : '',
                certain_from_date: item.certain_from_date ? moment(new Date(item.certain_from_date)) : '',
                certain_to_date: item.certain_to_date ? moment(new Date(item.certain_to_date)) : '',
                company_name: item.company_name,
                company_director: item.company_director,
                degree: item.degree,
                department: item.department,
                department_director: item.department_director,
                department_director_sign_date: item.department_director_sign_date ? moment(new Date(item.department_director_sign_date)) : '',
                filename: item.filename,
                fire_prevention_instruction: item.fire_prevention_instruction,
                fullname: item.fullname,
                hiring_date: item.hiring_date ? moment(new Date(item.hiring_date)) : '',
                id: item.id,
                introductory_guide: item.introductory_guide,
                level: item.level,
                medical_report: item.medical_report,
                medical_report_sign_date: item.medical_report_sign_date ? moment(new Date(item.medical_report_sign_date)) : '',

                order_date: item.order_date ? moment(new Date(item.order_date)) : '',
                order_number: item.order_number,
                placement_from_date: item.placement_from_date ? moment(new Date(item.placement_from_date)) : '',
                placement_to_date: item.placement_to_date ? moment(new Date(item.placement_to_date)) : '',
                position: item.position,
                recorded_date: item.recorded_date ? moment(new Date(item.recorded_date)) : '',
                safety_regulations: item.safety_regulations,
                salary: item.salary,
                section_area: item.section_area,
                staff_sign_date: item.staff_sign_date ? moment(new Date(item.staff_sign_date)) : '',
                tabel_number: item.tabel_number,
                testable_from_date: item.testable_from_date ? moment(new Date(item.testable_from_date)) : '',
                testable_to_date: item.testable_to_date ? moment(new Date(item.testable_to_date)) : '',
                trial_from_date: item.trial_from_date ? moment(new Date(item.trial_from_date)) : '',
                trial_to_date: item.trial_to_date ? moment(new Date(item.trial_to_date)) : '',
                user_id: item.user_id,
            }
        ))
        setEmployeeData(newData)
    }


    useEffect(() => {
        getEmployeeData(employeePaginationCurrent);
    }, [employeePaginationLimit, employeePaginationCurrent, searchedData]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeleteEmployee([]);
        setEmployeeSelectionState({selectedRowKeys: []});
        setEmployee({selectedRowKeys: []});
    }

    const handleDeleteHiring = () => {
        axios.delete(`${ip}/access-control-service/api/delete/hire_staff`,
            {
                data: deleteEmployee,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success("Ma'lumotlar o'chirildi", 5);
                setDeleteEmployee([]);
                setEmployeeSelectionState({selectedRowKeys: []});
                setEmployee({selectedRowKeys: []})
                getEmployeeData(employeePaginationCurrent);
                setDeleteModalOpen(false);
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }


    return (
        <div className="employee_content">
            <div className="employee_content_header">
                <div className="employee_content_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Xodimni ishga qabul qilish")}
                    </p>
                </div>
            </div>
            {!changePage ?
                <div className="employee_content_body">
                    <div className="employee_content_body_title">
                        <div className="employee_content_body_title_search">
                            <AiOutlineSearch/>
                            <input placeholder={t("Izlash")}
                                   onChange={(e) => {
                                       setEmployeePaginationCurrent(1);
                                       setSearchedData(e.currentTarget.value);
                                   }}
                            />
                        </div>

                        <div className="employee_content_body_title_right">
                            <div className="employee_content_body_title_right_filter">
                                {t('F.I.SH orqali saralash')} <AiOutlineCaretDown/>
                            </div>
                            <div className="employee_content_body_title_right_add" onClick={() => setChangePage(true)}>
                                <IoMdAddCircle size={"18px"}/><span>{t('Ishga qabul qilish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="working_holiday_body_table">
                        <EmployeeTable
                            rowSelection={rowSelection}
                            employeeData={employeeData}
                            setHiringInitialValues={setHiringInitialValues}
                            hiringInitialValues={hiringInitialValues}
                            setChangePage={setChangePage}
                            setView={setView}
                            setDeleteEmployee={setDeleteEmployee}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />

                        <div className="employee_content_body_table_pagination">
                        {/*<div className="providing_pagination">*/}
                            <EmployeePagination
                                employeePaginationLimit={employeePaginationLimit}
                                employeePaginationCurrent={employeePaginationCurrent}
                                employeePaginationOnChange={employeePaginationOnChange}
                                employeeTotal={employeeTotal}
                            />
                            {
                                deleteEmployee.length > 0 &&
                                <button style={{marginLeft: 10}} type='button' className="delete_button"
                                        onClick={() => setDeleteModalOpen(true)}>
                                    <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                    {t("O’chirish")}
                                </button>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="employee_content_body_addJob">
                    <HiringAnEmployeeAdd
                        setChangePage={setChangePage}
                        setHiringInitialValues={setHiringInitialValues}
                        hiringInitialValues={hiringInitialValues}
                        employeePaginationLimit={employeePaginationLimit}
                        employeePaginationCurrent={employeePaginationCurrent}
                        getEmployeeData={getEmployeeData}
                        view={view}
                        setView={setView}
                    />
                </div>
            }

            <div className="delete_modal_all">
                <Modal
                    isOpen={deleteModalOpen}
                    onRequestClose={cencelDelete}
                    contentLabel="My dialog"
                    className="mymodal"
                    overlayClassName="myoverlay"
                    closeTimeoutMS={0}
                >
                    <div className="delete_modal">
                        <h3>{t("Haqiqatdan ham o'chirasizmi ?")}</h3>
                        <div className="delete_modal_button">
                            <div className="">
                                <button type="button" className="delete_modal_button_left"
                                        onClick={cencelDelete}>{t("Yo'q")}
                                </button>
                            </div>
                            <div>
                                <button type="button" className="delete_modal_button_right"
                                        onClick={() => handleDeleteHiring()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default HiringAnEmployee;
