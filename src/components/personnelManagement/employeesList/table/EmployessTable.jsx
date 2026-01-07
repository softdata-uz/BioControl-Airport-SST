import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import '../employessList.css';
import ETable from "./ETable";
import EmployessPagination from "./EmployessPagination";
import {IoMdAddCircle} from "react-icons/io";
import axios from "axios";
import {ip} from "../../../../ip";
import moment from "moment";
import EmployeesInfo from "../employeeInformation/EmployeesInfo";
import AddEmployees from "../addEmployees/AddEmployees";
import {AiOutlineDelete} from "react-icons/ai";
import AddEmployeesView from "../addEmployesView/AddEmployeesView";
import {AiOutlineSearch} from 'react-icons/ai';
import Modal from "react-modal";

const EmployessTable = (props) => {
    const {
        openAddemployees,
        setOpenAddemployees,
        openAddemployeesView,
        setOpenAddemployeesView,
        openEmployeesInfo,
        setOpenEmployeesInfo
    }=props

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [searchedData, setSearchedData] = useState('');
    const [staffPaginationLimit, setStaffPaginationLimit] = useState(12)
    const [staffPaginationCurrent, setStaffPaginationCurrent] = useState(1)
    const [staffData, setStaffData] = useState([])
    const [staffTotal, setStaffTotal] = useState(null)
    const [deleteStaff, setDeleteStaff] = useState([])
    const [staffSelectionState, setStaffSelectionState] = useState({selectedRowKeys: []});
    const [employeesId, setEmployeesId] = useState({});
    const [employeesView, setEmployeesView] = useState({});

    // console.log(employeesView)
    const [employeesInitialValue, setEmployeesInitialValue] = useState({
        user_id: '',
        fullname: '',
        date_of_birth: '',
        nationality: '',
        address: '',
        passport_seria: '',
        passport_given_date: '',
        passport_given_by:'',
        party_membership: '',
        labour_experience: '',
        experience_term: '',
        last_workplace: '',
        last_workplace_position: '',
        fired_date:'',
        firing_reason: '',
        relatives: [],
        education: {
            institution: '',
            degree: '',
            specialization:'',
            started_date: '',
            ended_date:'',
            diploma_seria:'',
        },
        military_service: {
            group_account: '',
            account_category: '',
            content: '',
            rank: '',
            special_account_number: '',
            specialization: '',
            period: '',
            name: '',
            address: ''
        },
        appointment: {
            the_date: '',
            department: '',
            specialization: '',
            razryad: '',
            basis: ''
        },
        labour_vacation: {
            type: '',
            period: '',
            from_date: '',
            to_date: '',
            basis: ''
        },
        extra_info:'',
    })


    const onSelectChange = (selectedRowKeys, a) => {
        setStaffSelectionState({selectedRowKeys})
        setDeleteStaff(a.map(item => item.id));
    };

    const {selectedRowKeys} = staffSelectionState;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const getStaffData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/staff/${staffPaginationLimit}/${staffPaginationCurrent}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        // console.log(response.data.data)
        const {data} = response;
        const count = data.count;
        setStaffTotal(count)
        const newData = data?.data?.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * staffPaginationLimit,
                fullname: item.fullname,
                date_of_birth: moment(item.date_of_birth).format('DD.MM.YYYY'),
                degree: item.education.degree,
                specialization: item.education.specialization,
            }
        ))
        setStaffData(newData);
    }

    // console.log(employeesId)


    const staffPaginationOnChange = (e = 1, option) => {
        getStaffData(e)
        setStaffPaginationCurrent(e)
        setStaffPaginationLimit(option)
    }


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeleteStaff([]);
        setStaffSelectionState({selectedRowKeys: []});
    }
    const handleDeliteStaff = () => {
        axios.delete(`${ip}/access-control-service/api/delete/staff`,
            {
                data: deleteStaff,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            },
        )
            .then(res => {
                getStaffData(staffPaginationCurrent);
                setStaffSelectionState({selectedRowKeys: []})
                setDeleteStaff([]);
                setDeleteModalOpen(false);
            })
            .catch(err => {
                console.log(err?.response?.data)
            })
    }

    useEffect(() => {
        getStaffData(staffPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffPaginationLimit, staffPaginationCurrent, searchedData ]);

    // console.log(staffData)
    return (
        <div className="providing_table_content">
            {
                openAddemployees ?
                        <AddEmployees
                            getStaffData={getStaffData}
                            setOpenAddemployees={setOpenAddemployees}
                            setEmployeesInitialValue={setEmployeesInitialValue}
                            employeesInitialValue={employeesInitialValue}
                            staffPaginationCurrent={staffPaginationCurrent}
                        />
                : openEmployeesInfo ?
                    <EmployeesInfo
                        staffData={staffData}
                        employeesId={employeesId}
                    />
                    : openAddemployeesView ?
                        <AddEmployeesView
                            setOpenAddemployeesView={setOpenAddemployeesView}
                            setEmployeesInitialValue={setEmployeesInitialValue}
                            employeesInitialValue={employeesInitialValue}
                            employeesView={employeesView}
                        />
                        :
                    <div>
                        <div className="employee_content_dismissal_body_title">
                                <div className="employee_content_body_title_search">
                                    <AiOutlineSearch/>
                                    <input placeholder={t("Izlash")}
                                           onChange={(e) => {
                                               setStaffPaginationCurrent(1);
                                               setSearchedData(e.currentTarget.value);
                                           }}
                                    />
                                </div>

                            <div className="employee_content_changePosition_body_title_right_add" onClick={()=>setOpenAddemployees(true)}>
                                <IoMdAddCircle size={"18px"}/><span>{t("Xodim qo'shish")}</span>
                            </div>
                        </div>
                        <div className="table_pagination">
                            <ETable
                                rowSelection={rowSelection}
                                staffData={staffData}
                                setOpenEmployeesInfo={setOpenEmployeesInfo}
                                setOpenAddemployees={setOpenAddemployees}
                                setOpenAddemployeesView={setOpenAddemployeesView}
                                setEmployeesId={setEmployeesId}
                                handleDeliteStaff ={handleDeliteStaff}
                                setEmployeesInitialValue={setEmployeesInitialValue}
                                employeesInitialValue={employeesInitialValue}
                                setEmployeesView={setEmployeesView}
                                setDeleteStaff={setDeleteStaff}
                                setDeleteModalOpen={setDeleteModalOpen}
                            />
                            <div className="pagenation_delete_button">
                                <EmployessPagination
                                    staffPaginationLimit={staffPaginationLimit}
                                    staffPaginationCurrent={staffPaginationCurrent}
                                    staffPaginationOnChange={staffPaginationOnChange}
                                    staffTotal={staffTotal}
                                />
                                {
                                    deleteStaff.length > 0 &&
                                    <button style={{marginLeft: 10}} className="delete_button" onClick={()=>setDeleteModalOpen(true)}>
                                        <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                        {t("O’chirish")}
                                    </button>
                                }
                            </div>

                        </div>
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
                                        onClick={() => handleDeliteStaff()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default EmployessTable;