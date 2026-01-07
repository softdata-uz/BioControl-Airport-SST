import React, {useEffect, useState} from 'react';


import './workingContract.css';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import {AiOutlineSearch, AiOutlineCaretDown} from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdAddCircle} from 'react-icons/io';
import EmployeeTable from "./workingContractTable/WorkingContractTable";
import WorkingContractPagination from "./workingContractPagination/WorkingContractPagination";
import WorkingContractAdd from "./workingContractAdd/WorkingContractAdd";
import {AiOutlineDelete} from 'react-icons/ai';
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment";
import {message} from "antd";
import Modal from "react-modal";
import HiringAnEmployeeAdd from "../hiringAnEmployee/addJobAcceptance/HiringAnEmployeeAdd";


const WorkingContract = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [workingContract, setWorkingContract] = useState(false);
    const [changePage, setChangePage] = useState(false);
    const [view, setView] = useState(false);


    const [workingContractPaginationLimit, setWorkingContractPaginationLimit] = useState(12)
    const [workingContractPaginationCurrent, setWorkingContractPaginationCurrent] = useState(1);
    const [workingContractTotal, setWorkingContractTotal] = useState(null);

    const adminPaginationWorkingContract = (e = 1, option) => {
        setWorkingContractPaginationCurrent(e)
        setWorkingContractPaginationLimit(option)
    }


    const [deleteWorkingContract, setDeleteWorkingContract] = useState([])
    const [employeeSelectionState, setEmployeeSelectionState] = useState({selectedRowKeys: []})

    const [contract, setContract] = useState({selectedRowKeys: []})
    const [contractInitialValue, setContractInitialValue] = useState({})
    const onSelectChange = (selectedRowKeys, a) => {
        setContract({selectedRowKeys})
        setDeleteWorkingContract(a.map(item => item.id));
    };

    const {selectedRowKeys} = contract;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }


    const [contractInitialValues, setContractInitialValues] = useState({
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
    });

    const [searchedData, setSearchedData] = useState('');
    const [employeeData, setEmployeeData] = useState([])
    const getEmployeeData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/labour_contract/${workingContractPaginationLimit}/${id}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
        const {data} = response;
        const count = data.count;
        setWorkingContractTotal(count);
        // console.log(data)
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * workingContractPaginationLimit,
                created_time: item.created_time ? moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss') : '',
                company_name: item.company_name,
                contract: item.contract,
                contract_type: item.contract_type,
                department: item.department,
                director_fullname: item.director_fullname,
                director_sign_date: item.director_sign_date ? moment(new Date(item.director_sign_date)) : '',
                extra_holidays: item.extra_holidays,
                extra_salary: item.extra_salary,
                filename: item.filename,
                fullname: item.fullname,
                hourly_salary: item.hourly_salary,
                id: item.id,
                labour_condition: item.labour_condition,
                main_holidays: item.main_holidays,
                monthly_salary: item.monthly_salary,
                order_date: item.order_date ? moment(new Date(item.order_date)) : '',
                order_number: item.order_number,
                position: item.position,
                staff_address: item.staff_address,
                staff_sign_date: item.staff_sign_date ? moment(new Date(item.staff_sign_date)) : '',
                trial_period: item.trial_period,
                user_id: item.user_id,
                valid_from_date: item.valid_from_date ? moment(new Date(item.valid_from_date)) : '',
                valid_to_date: item.valid_to_date ? moment(new Date(item.valid_to_date)) : '',
                working_days_schedule: item.working_days_schedule

            }
        ))
        setEmployeeData(newData)
    }


    useEffect(() => {
        getEmployeeData(workingContractPaginationCurrent);
    }, [workingContractPaginationLimit, workingContractPaginationCurrent, searchedData]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeleteWorkingContract([]);
        setEmployeeSelectionState({selectedRowKeys: []});
        setContract({selectedRowKeys: []});
    }

    const handleDeleteContract = () => {
        axios.delete(`${ip}/access-control-service/api/delete/labour_contract`,
            {
                data: deleteWorkingContract,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success("Ma'lumotlar o'chirildi", 5);
                setDeleteWorkingContract([]);
                setEmployeeSelectionState({selectedRowKeys: []});
                setContract({selectedRowKeys: []})
                getEmployeeData(workingContractPaginationCurrent);
                setDeleteModalOpen(false);
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }


    return (
        <div className="working_contract">
            <div className="working_contract_header">
                <div className="working_contract_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Mehnat shartnomasi")}
                    </p>
                </div>
            </div>

            {!changePage ?
                <div className="working_contract_body">
                    <div className="working_contract_body_title">
                        <div className="working_contract_body_title_search">
                            <AiOutlineSearch/><input placeholder={t("Izlash")}/>
                        </div>

                        <div className="working_contract_body_title_right">
                            <div className="working_contract_body_title_right_filter">
                                {t('F.I.SH orqali saralash')} <AiOutlineCaretDown/>
                            </div>
                            <div className="working_contract_body_title_right_add" onClick={() => setChangePage(true)}>
                                <IoMdAddCircle size={"18px"}/><span>{t('Shartnoma tuzish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="working_contract_body_table">
                        <EmployeeTable
                            rowSelection={rowSelection}
                            employeeData={employeeData}
                            setContractInitialValues={setContractInitialValues}
                            contractInitialValues={contractInitialValues}
                            setChangePage={setChangePage}
                            setView={setView}
                            setDeleteWorkingContract={setDeleteWorkingContract}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />

                        <div className="working_contract_body_table_pagination">
                            {/*<div className="providing_pagination">*/}
                            <WorkingContractPagination
                                workingContractPaginationLimit={workingContractPaginationLimit}
                                workingContractPaginationCurrent={workingContractPaginationCurrent}
                                adminTablePaginationOnChange={adminPaginationWorkingContract}
                                workingContractTotal={workingContractTotal}
                            />

                            {
                                deleteWorkingContract.length > 0 &&
                                <button style={{marginLeft: 10}} type='button' className="delete_button"
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                    {t("O’chirish")}
                                </button>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="working_contract_body_addJob">
                    <WorkingContractAdd
                        setChangePage={setChangePage}
                        setContractInitialValues={setContractInitialValues}
                        contractInitialValues={contractInitialValues}
                        workingContractPaginationLimit={workingContractPaginationLimit}
                        workingContractPaginationCurrent={workingContractPaginationCurrent}
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
                                        onClick={() => handleDeleteContract()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>

        </div>
    );
};

export default WorkingContract;