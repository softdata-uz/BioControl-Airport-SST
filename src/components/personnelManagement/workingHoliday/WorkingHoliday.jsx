import React, {useEffect, useState} from 'react';
import './workingHoliday.css';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import {AiOutlineSearch, AiOutlineCaretDown, AiOutlineDelete} from 'react-icons/ai';
import {IoMdAddCircle} from 'react-icons/io';
import WorkingHolidayTable from "./workingHolidayTable/WorkingHolidayTable";
import WorkingHolidayPagination from "./workingHolidayPagination/WorkingHolidayPagination";
import WorkingHolidayAdd from "./workingHolidayAdd/WorkingHolidayAdd";
import axios from "axios";
import {ip} from "../../../ip";


const WorkingHoliday = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [workingHoliday, setWorkingHoliday] = useState(false);

    const [workingHolidayPaginationLimit, setWorkingHolidayPaginationLimit] = useState(15)
    const [workingHolidayPaginationCurrent, setWorkingHolidayPaginationCurrent] = useState(1);
    const [workingHolidayTotal, setWorkingHolidayTotal] = useState(null);
    const [deleteWorkingHoliday, setDeleteWorkingHoliday] = useState([])
    const [holiday, setHoliday] = useState({selectedRowKeys: []});
    const [holidayData, setHolidayData] = useState([]);
    const [searchedData, setSearchedData] = useState('');
    const [holidayInitialValue, setHolidayInitialValue]=useState({
        company_name: '',
        order_number: '',
        order_date: '',
        user_id: '',
        fullname: '',
        department: '',
        section_area: '',
        degree: '',
        position: '',
        level: '',
        salary: '',
        tabel_number: '',
        working_condition: '',
        worked_from_date: '',
        worked_to_date: '',
        certain_calendar_days: '',
        extra_holiday_days: '',
        extra_days_for_difficulties: '',
        extra_days_for_mothers: '',
        extra_days_for_stable_work: '',
        extra_days_for_overworking: '',
        extra_days_for_place_difficulties: '',
        extra_days_for_another_types: '',
        all_days: '',
        from_date: '',
        to_date: '',
        staff_sign_date: '',
    });


    const getHolidayData = async (id) => {
        const response = await axios.get(
            `${ip}/access-control-service/api/labour_holiday/${workingHolidayPaginationLimit}/${workingHolidayPaginationCurrent}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const count = data.count;
        setWorkingHolidayTotal(count)
        const newData = data?.data?.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * workingHolidayPaginationLimit,
                fullname: item.fullname,
                position:item.position,
                order_date: item.order_date,
                order_number: item.order_number,
            }
        ))
        setHolidayData(newData);
    }

    const handleDeliteHoliday = () => {
        axios.delete(`${ip}/access-control-service/api/delete/labour_holiday`,
            {
                data: deleteWorkingHoliday,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            },
        )
            .then(res => {
                getHolidayData(workingHolidayPaginationCurrent);
                setHoliday({selectedRowKeys: []})
                setDeleteWorkingHoliday([])
            })
            .catch(err => {
                console.log(err?.response?.data)
            })
    }

    const adminPaginationWorkingHoliday = (e = 1, option) => {
        setWorkingHolidayPaginationCurrent(e)
        setWorkingHolidayPaginationLimit(option)
    }
    const onSelectChange = (selectedRowKeys, a) => {
        setHoliday({selectedRowKeys})
        setDeleteWorkingHoliday(a.map(item => item.id));
    };

    const {selectedRowKeys} = holiday;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }


    useEffect(() => {
        getHolidayData(workingHolidayPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workingHolidayPaginationLimit, workingHolidayPaginationCurrent, searchedData])


    return (
        <div className="working_holiday">
            <div className="working_holiday_header">
                <div className="working_holiday_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Mehnat ta'tili")}
                    </p>
                </div>
            </div>

            {!workingHoliday ?
                <div className="working_holiday_body">
                    <div className="working_holiday_body_title">
                        <div className={`working_holiday_body_title_search  ${isDarkMode && 'darkModeInputBackgraund'}`}>
                            <AiOutlineSearch className={`${isDarkMode && 'darkModeColor'}`}/>
                            <input
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                onChange={(e) => {
                                    setWorkingHolidayPaginationCurrent(1);
                                    setSearchedData(e.currentTarget.value);
                                }}
                                type='search'
                                placeholder={t('Izlash')}
                            />
                        </div>



                        <div className="working_holiday_body_title_right">
                            <div className="working_holiday_body_title_right_filter">
                                {t('F.I.SH orqali saralash')} <AiOutlineCaretDown/>
                            </div>
                            <div className="working_holiday_body_title_right_add"
                                 onClick={() => setWorkingHoliday(true)}>
                                <IoMdAddCircle size={"18px"}/><span>{t('Mehnat ta\'tiliga chiqarish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="working_holiday_body_table">
                        <WorkingHolidayTable
                            rowSelection={rowSelection}
                            holidayData={holidayData}
                            handleDeliteHoliday={handleDeliteHoliday}
                        />

                        <div className="providing_pagination">
                            <WorkingHolidayPagination
                                workingHolidayPaginationLimit={workingHolidayPaginationLimit}
                                workingHolidayPaginationCurrent={workingHolidayPaginationCurrent}
                                adminPaginationWorkingHoliday={adminPaginationWorkingHoliday}
                                workingHolidayTotal={workingHolidayTotal}
                            />

                            {
                                deleteWorkingHoliday.length > 0 &&
                                <button style={{marginLeft: 10}} type='button' className="delete_button" onClick={handleDeliteHoliday}>
                                    <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                    {t("O’chirish")}
                                </button>
                            }
                        </div>
                    </div>

                </div>
                :
                <div className="working_holiday_body_addJob">
                    <WorkingHolidayAdd
                        setWorkingHoliday={setWorkingHoliday}
                        holidayInitialValue={holidayInitialValue}
                        setHolidayInitialValue={setHolidayInitialValue}
                        workingHolidayPaginationLimit={workingHolidayPaginationLimit}
                        workingHolidayPaginationCurrent={workingHolidayPaginationCurrent}
                    />
                </div>
            }


        </div>
    );
};

export default WorkingHoliday;