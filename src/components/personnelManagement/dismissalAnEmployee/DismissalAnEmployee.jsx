import React, {useEffect, useState} from 'react';


import './dismissalAnEmployee.css';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import {AiOutlineSearch, AiOutlineCaretDown} from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdAddCircle, IoIosCloseCircle} from 'react-icons/io';
import EmployeeDismissalTable from './employeeDismissalTable/EmployeeDismissalTable';
import EmployeeDismissalPagination from "./employeeDismissalPagination/EmployeeDismissalPagination";
import DismissalJobAcceptance from "./dismissalAddJobAcceptance/DismissalJobAcceptance";
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment";
import {message} from "antd";
import {AiOutlineDelete} from 'react-icons/ai';
import EmployeeTable from "../hiringAnEmployee/employeeTable/EmployeeTable";
import Modal from "react-modal";
import EmployeePagination from "../hiringAnEmployee/employeePagination/EmployeePagination";
import HiringAnEmployeeAdd from "../hiringAnEmployee/addJobAcceptance/HiringAnEmployeeAdd";

const DismissalAnEmployee = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [changePageDismissal, setChangePageDismissal] = useState(false);
    const [view, setView] = useState(false);

    const [employeeDismissalPaginationLimit, setEmployeeDismissalPaginationLimit] = useState(15)
    const [employeeDismissalPaginationCurrent, setEmployeeDismissalPaginationCurrent] = useState(1);
    const [employeeDismissalTotal, setEmployeeDismissalTotal] = useState(null);

    const employeeDismissalPaginationOnChange = (e = 1, option) => {
        setEmployeeDismissalPaginationCurrent(e);
        setEmployeeDismissalPaginationLimit(option);
    }


    const [isOpenEmployeeDismissal, setIsOpenEmployeeDismissal] = useState(false)
    const [deleteEmployeeDismissal, setDeleteEmployeeDismissal] = useState([])
    const [employeeDismissalSelectionState, setEmployeeDismissalSelectionState] = useState({selectedRowKeys: []})

    const [employeeDismissal, setEmployeeDismissal] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setEmployeeDismissal({selectedRowKeys})
        setDeleteEmployeeDismissal(a.map(item => item.id));
    };

    const {selectedRowKeys} = employeeDismissal;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const [dismissalInitialValues, setDismissalInitialValues] = useState({
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
    });

    const [searchedData, setSearchedData] = useState('');
    const [employeeData, setEmployeeData] = useState([])
    const getEmployeeData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/fire_staff/${employeeDismissalPaginationLimit}/${id}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
        const {data} = response;
        const count = data.count;
        setEmployeeDismissalTotal(count);
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * employeeDismissalPaginationLimit,
                created_time: item.created_time ? moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss') : '',

                order_date: item.order_date ? moment(new Date(item.order_date)) : '',
                accountant: item.accountant,
                association: item.association,
                association_sign_date: item.association_sign_date ? moment(new Date(item.association_sign_date)) : '',
                basis: item.basis,
                company_name: item.company_name,
                degree: item.degree,
                department: item.department,
                filename: item.filename,
                fullname: item.fullname,
                id: item.id,
                level: item.level,
                main_basis: item.main_basis,
                not_worked_days: item.not_worked_days,
                order_number: item.order_number,
                position: item.position,
                reason: item.reason,
                recorded_date: item.recorded_date ? moment(new Date(item.recorded_date)) : '',
                section_area: item.section_area,
                staff_sign_date: item.staff_sign_date ? moment(new Date(item.staff_sign_date)) : '',
                tabel_number: item.tabel_number,
                user_id: item.user_id,
                worked_days: item.worked_days,
            }
        ))
        setEmployeeData(newData)
    }


    useEffect(() => {
        getEmployeeData(employeeDismissalPaginationCurrent);
    }, [employeeDismissalPaginationLimit, employeeDismissalPaginationCurrent, searchedData]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeleteEmployeeDismissal([]);
        setEmployeeDismissalSelectionState({selectedRowKeys: []});
        setEmployeeDismissal({selectedRowKeys: []});
    }

    const handleDeleteDismissal = () => {
        axios.delete(`${ip}/access-control-service/api/delete/fire_staff`,
            {
                data: deleteEmployeeDismissal,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success(t("Ma'lumotlar o'chirildi"), 5);
                setDeleteEmployeeDismissal([]);
                setEmployeeDismissalSelectionState({selectedRowKeys: []});
                setEmployeeDismissal({selectedRowKeys: []})
                getEmployeeData(employeeDismissalPaginationCurrent);
                setDeleteModalOpen(false);
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }

    return (
        <div className="employee_content_dismissal">
            <div className="employee_content_dismissal_header">
                <div className="employee_content_dismissal_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Xodimni ishdan bo'shatish")}
                    </p>
                </div>
            </div>

            {!changePageDismissal ?
                <div className="employee_content_dismissal_body">
                    <div className="employee_content_dismissal_body_title">
                        <div className="employee_content_dismissal_body_title_search">
                            <AiOutlineSearch/>
                            <input placeholder={t("Izlash")}
                                   onChange={(e) => {
                                       setEmployeeDismissalPaginationCurrent(1);
                                       setSearchedData(e.currentTarget.value);
                                   }}
                            />
                        </div>

                        <div className="employee_content_dismissal_body_title_right">
                            <div className="employee_content_dismissal_body_title_right_filter">
                                {t('F.I.SH orqali saralash')} <AiOutlineCaretDown/>
                            </div>
                            <div className="employee_content_dismissal_body_title_right_add"
                                 onClick={() => setChangePageDismissal(true)}>
                                <IoIosCloseCircle size={"18px"}/><span>{t('Shartnomani bekor qilish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="working_holiday_body_table">
                        <EmployeeDismissalTable
                            rowSelection={rowSelection}
                            employeeData={employeeData}
                            setDismissalInitialValues={setDismissalInitialValues}
                            dismissalInitialValues={dismissalInitialValues}
                            setChangePageDismissal={setChangePageDismissal}
                            setView={setView}
                            setDeleteEmployeeDismissal={setDeleteEmployeeDismissal}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />

                        {/*<div className="working_holiday_body_table_pagination">*/}
                        <div className="providing_pagination">
                            <EmployeeDismissalPagination
                                employeeDismissalPaginationLimit={employeeDismissalPaginationLimit}
                                employeeDismissalPaginationCurrent={employeeDismissalPaginationCurrent}
                                employeeDismissalPaginationOnChange={employeeDismissalPaginationOnChange}
                                employeeDismissalTotal={employeeDismissalTotal}
                            />
                            {
                                deleteEmployeeDismissal.length > 0 &&
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
                <div className="employee_content_dismissal_body_addJob">
                    <DismissalJobAcceptance
                        setChangePageDismissal={setChangePageDismissal}
                        setDismissalInitialValues={setDismissalInitialValues}
                        dismissalInitialValues={dismissalInitialValues}
                        employeeDismissalPaginationLimit={employeeDismissalPaginationLimit}
                        employeeDismissalPaginationCurrent={employeeDismissalPaginationCurrent}
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
                                        onClick={() => handleDeleteDismissal()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default DismissalAnEmployee;