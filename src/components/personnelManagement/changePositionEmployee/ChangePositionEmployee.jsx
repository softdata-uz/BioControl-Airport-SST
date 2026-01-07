import React, {useEffect, useState} from 'react';


import './changePositionEmployee.css';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import {AiOutlineSearch, AiOutlineCaretDown, AiOutlineDelete} from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdAddCircle , IoIosCloseCircle} from 'react-icons/io';
import {MdChangeCircle} from 'react-icons/md';
import EmployeeChangePositionTable from './employeeChangePositionTable/EmployeeChangePositionTable';
import EmployeeChangePositonPagination from "./employeeChangePositonPagination/EmployeeChangePositonPagination";
import ChangePositionEmployeePage from "./changePositionEmployeePage/ChangePositionEmployeePage";
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment/moment";

const ChangePositionEmployee = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [changePageChangePosition, setChangePageChangePosition] = useState(false);

    const [employeeChangePositionPaginationLimit, setEmployeeChangePositionPaginationLimit] = useState(15)
    const [employeeChangePositionPaginationCurrent, setEmployeeChangePositionPaginationCurrent] = useState(1);
    const [employeeChangePositionTotal, setEmployeeChangePositionTotal] = useState(null);
    const [positionData, setPositionData]=useState([]);
    const [deleteStaff, setDeleteStaff] = useState([])

    const [isOpenEmployeeChangePosition, setIsOpenEmployeeChangePosition] = useState(false)
    const [employeeChangePosition, setEmployeeChangePosition] = useState({selectedRowKeys: []})
    const [searchedData, setSearchedData] = useState('');
    const [changePositionInitialValue, setChangePositionInitialValue]=useState({
        company_name: '',
        order_number: '',
        order_date: '',
        user_id: '',
        fullname: '',
        basis: '',
        change_rank_date: '',
        department: '',
        section_area: '',
        level: '',
        salary: '',
        position: '',
        position_sign: '',
        tabel_number: '',
        recorded_date: '',
        medical_report: '',
        medical_report_sign_date: '',
        safety_regulations: '',
        fire_prevention_instruction: '',
        introductory_guide: '',
        staff_sign_date: '',
        degree: ''
    });


    const getPositionData = async (id) => {
        const response = await axios.get(
            `${ip}/access-control-service/api/change_rank/${employeeChangePositionPaginationLimit}/${employeeChangePositionPaginationCurrent}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const count = data.count;
        setEmployeeChangePositionTotal(count)
        const newData = data?.data?.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * employeeChangePositionPaginationLimit,
                fullname: item.fullname,
                position:item.position,
                change_rank_date: moment(item.change_rank_date).format('DD.MM.YYYY'),
                order_number: item.order_number
            }
        ))
        setPositionData(newData);
    }
    // console.log(positionData)

    const handleDelitePosition = () => {
        axios.delete(`${ip}/access-control-service/api/delete/change_rank`,
            {
                data: deleteStaff,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            },
        )
            .then(res => {
                getPositionData(employeeChangePositionPaginationCurrent);
                setEmployeeChangePosition({selectedRowKeys: []})
                setDeleteStaff([])
            })
            .catch(err => {
                console.log(err?.response?.data)
            })
    }

    const employeeChangePositionPaginationOnChange = (e = 1, option) => {
        setEmployeeChangePositionPaginationCurrent(e)
        setEmployeeChangePositionPaginationLimit(option)
    }

    const onSelectChange = (selectedRowKeys, a) => {
        setEmployeeChangePosition({selectedRowKeys})
        setDeleteStaff(a.map(item => item.id));
    };

    const {selectedRowKeys} = employeeChangePosition;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    useEffect(() => {
        getPositionData(employeeChangePositionPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeChangePositionPaginationLimit, employeeChangePositionPaginationCurrent, searchedData])

    return (
        <div className="employee_content_changePosition">
            <div className="employee_content_changePosition_header">
                <div className="employee_content_changePosition_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Xodim lavozimini o’zgartirish")}
                    </p>
                </div>
            </div>

            {!changePageChangePosition ?
                <div className="employee_content_changePosition_body">
                    <div className="employee_content_changePosition_body_title">
                        <div className="employee_content_changePosition_body_title_search">
                            <AiOutlineSearch/>
                            <input placeholder={t("Izlash")}
                                   onChange={(e) => {
                                       setEmployeeChangePositionPaginationCurrent(1);
                                       setSearchedData(e.currentTarget.value);
                                   }}
                            />
                        </div>

                        <div className="employee_content_changePosition_body_title_right">
                            <div className="employee_content_changePosition_body_title_right_filter">
                                {t('F.I.SH orqali saralash')} <AiOutlineCaretDown/>
                            </div>
                            <div className="employee_content_changePosition_body_title_right_add" onClick={() => setChangePageChangePosition(true)}>
                                <MdChangeCircle size={"18px"}/><span>{t('Lavozim o’zgartirish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="employee_content_changePosition_body_table">
                        <EmployeeChangePositionTable
                            rowSelection={rowSelection}
                            positionData={positionData}
                            handleDelitePosition={handleDelitePosition}
                        />

                        <div className="providing_pagination">
                            <EmployeeChangePositonPagination
                                employeeChangePositionPaginationLimit={employeeChangePositionPaginationLimit}
                                employeeChangePositionPaginationCurrent={employeeChangePositionPaginationCurrent}
                                employeeChangePositionPaginationOnChange={employeeChangePositionPaginationOnChange}
                                employeeChangePositionTotal={employeeChangePositionTotal}
                            />

                            {
                                deleteStaff.length > 0 &&
                                <button style={{marginLeft: 10}} type='button' className="delete_button" onClick={handleDelitePosition}>
                                    <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                    {t("O’chirish")}
                                </button>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="employee_content_changePosition_body_addJob">
                    <ChangePositionEmployeePage
                        setChangePageChangePosition={setChangePageChangePosition}
                        changePositionInitialValue={changePositionInitialValue}
                        setChangePositionInitialValue={setChangePositionInitialValue}
                        employeeChangePositionPaginationLimit={employeeChangePositionPaginationLimit}
                        employeeChangePositionPaginationCurrent={employeeChangePositionPaginationCurrent}

                    />
                </div>
            }


        </div>
    );
};

export default ChangePositionEmployee;