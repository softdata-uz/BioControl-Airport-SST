import React, {useEffect, useState} from 'react';
import "./working.css";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {DatePicker, Input, Radio, Space, Tabs} from "antd";
import StaffTable2 from "./WorkingHoursReportTable";
import StaffPagination from "../settings/paginations/StaffPagination";
import axios from "axios";
import {ip} from "../../../ip";
import {useTranslation} from "react-i18next";
import search from "../../../images/newimages/ishvaqti/Vector.png";
import {AiOutlineSearch} from "react-icons/ai";
import moment from 'moment';
import 'moment/locale/zh-cn';
import WorkingHoursReportPagination from "./WorkingHoursReportPagination";
import WorkingHoursReportTable from "./WorkingHoursReportTable";


const {TabPane} = Tabs;


const WorkingHoursReport = () => {

    const isDarkMode = useSelector(state => state.theme.theme_data)

    const {t} = useTranslation()

    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const navigate = useNavigate();


    // add new staff modal state
    const [isOpenAddStaff, setIsOpenAddStaff] = useState(false)

    // add new terminal modal state
    const [isOpenAddTerminal, setIsOpenAddTerminal] = useState(false)

    // terminal
    const [terminalPaginationLimit, setTerminalPaginationLimit] = useState(15)
    const [terminalPaginationCurrent, setTerminalPaginationCurrent] = useState(1)
    const [terminalData, setTerminalData] = useState([])
    const [terminalTotal, setTerminalTotal] = useState(null)

    // staff
    const [staffPaginationLimit, setStaffPaginationLimit] = useState(15)
    const [staffPaginationCurrent, setStaffPaginationCurrent] = useState(1)
    const [staffData, setStaffData] = useState([])
    const [staffTotal, setStaffTotal] = useState(null)

    const [staffTableIntialValues, setStaffTableIntialValues] = useState({
        fullname: '',
        gender: '',
        rank: '',
        user_type: '',
        door_ip: [],
        access_type: '',
        valid_from_time: '',
        valid_to_time: '',
        image: '',
        notification: false,
    })

    // delete button
    const [deleteStaff, setDeleteStaff] = useState([])
    const [deleteTerminal, setDeleteTerminal] = useState([])


    const addNewStaff = () => {
        setIsOpenAddStaff(true)
    }

    const addNewTerminal = () => {
        setIsOpenAddTerminal(true)
    }

    const onChangeTabs = (key) => {
        // console.log(key);
    }

    const [state, setState] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setState({selectedRowKeys})
        setDeleteTerminal(a.map(item => item.id));
        setDeleteStaff(a.map(item => item.id));
    };

    const {selectedRowKeys} = state;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const getTerminalData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/terminals/${terminalPaginationLimit}/${id}`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
        const {data} = response;
        const count = data.count;
        setTerminalTotal(count)
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * terminalPaginationLimit,
                created_time: moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss'),
                door_name: item.door_name,
                direction: item.direction,
                auth_type: item.auth_type,
                ip_address: item.ip_address,
                type: item.type,
                username: item.username,
                password: item.password,
            }
        ))
        setTerminalData(newData)
    }

    // get staff data
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");

    const [value, setValue] = React.useState("all");
    const onChange = e => {
        // console.log('radio checked', e.target.value);
        setValue(e.target.value);
        setMatn("");
        setDate1("");
        setDate2("");
    };

    function onChangeee(date, dateString) {
        // console.log(dateString);
        setDate1(dateString)
    }

    function onChangeee2(date2, dateString2) {
        // console.log(dateString2);
        setDate2(dateString2);
    }

    const [matn, setMatn] = useState("");
    const onChangeText = (e) => {
        // console.log(e.target.value)
        setMatn(e.target.value)
    }

    const headers = {'Content-Type': 'application/json'}

    useEffect(() => {
        // console.log(value)
        getStaffData(staffPaginationCurrent, value)
        setStaffPaginationCurrent(1);

    }, [value, setValue]);

    const getStaffData = async (id, api) => {
        const response = await axios.post(`${ip}/access-control-service/api/terminal/timemanagement/${api}/${staffPaginationLimit}/${id}`,
            {
                fullname: matn,
                fromDate: date1,
                toDate: date2,
                givenDate: date1
            },
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            , headers)
        // setMatn("");
        // setDate1("");
        // setDate2("");
        const {data} = response;
        const count = data.count;
        setStaffTotal(count)
        // console.log(data)

        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * staffPaginationLimit,
                user_type: item.user_type,
                rank: item.rank,
                late_time: item.late_time,
                early_go_time: item.early_go_time,
                all_fine_time: item.all_fine_time,
                absence_count: item.absence_count
            }
        ))
        setStaffData(newData)
    }
    const handleSearch = () => {
        getStaffData(staffPaginationCurrent, value)
    }


    const staffPaginationOnChange = (e = 1, option) => {
        getStaffData(e, value)
        setStaffPaginationCurrent(e)
        setStaffPaginationLimit(option)
    }
    useEffect(() => {
        getStaffData(staffPaginationCurrent, value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffPaginationLimit, staffPaginationCurrent])


    useEffect(() => {
        getTerminalData(terminalPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalPaginationLimit, terminalPaginationCurrent])


    // redirect
    useEffect(() => {
        // if (!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
    }, []);


    return (

        <div>
            <div className="working_hour_report">
                <div className='working_hour_report_header'>
                    <div className="acsess_content_top">
                        <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t('Ish vaqti hisoboti')}</p>
                    </div>
                </div>

                <div className={`working_hour_report_body ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                    {/*<Tabs onChange={onChangeTabs} type="card" defaultActiveKey="1">*/}

                    {/*<TabPane tab={t('Intizom boyicha hisobotlar')} key="2">*/}
                    <div className="access_control_setting_tab">
                        <div className='working_hour_report_item'>
                            <div className='access_control_setting_tab_item_body_working'>
                                <div className={`staf-table-navbar ${isDarkMode && 'darkModeLayautBg darkModeBorder'}`}>

                                       <div className="staf_table_navbar_inner_top">
                                           <Radio.Group onChange={onChange} value={value} className="radioCheck">
                                               <Radio value={"all"}
                                                      className={value === "all" ? "radio1 active" : "radio1"}
                                               >{t('Umumiy')}
                                               </Radio>
                                               <Radio value={"came"}
                                                      className={value === "came" ? "radio1 active" : "radio1"}
                                               >{t('Kelganlar')}
                                               </Radio>
                                               <Radio value={"absence"}
                                                      className={value === "absence" ? "radio1 active" : "radio1"}
                                               >{t('Kelmaganlar')}
                                               </Radio>
                                               <Radio value={"late"}
                                                      className={value === "late" ? "radio1 active" : "radio1"}
                                               >{t('Kechikkanlar')}</Radio>
                                               <Radio value={"earlygo"}
                                                      className={value === "earlygo" ? "radio1 active" : "radio1"}
                                               >{t('Barvaqt ketganlar')}</Radio>
                                               <Radio value={"exist"}
                                                      className={value === "exist" ? "radio1 active" : "radio1"}
                                               >{t('Hozirda mavjud hodimlar')}</Radio>
                                           </Radio.Group>
                                       </div>
                                       <div className="staf_table_navbar_inner_top_body">
                                           <div className="staf_table_navbar_inner_top_body_inner">
                                               <div className="staf_table_navbar_inner_top_body_inner_search">
                                                   <Input
                                                       placeholder={t('Izlash')}
                                                       className={`input ${isDarkMode && 'darkModeInputBackgraund '}`}
                                                       onChange={onChangeText}
                                                       value={matn}/>
                                               </div>
                                               <Space direction="gorizontal">
                                                   {
                                                       value !== "exist" ?
                                                           <DatePicker
                                                               className={`selectedDate ${isDarkMode && 'darkModeInputBackgraund'}`}
                                                               onChange={onChangeee}
                                                               placeholder={`${moment(new Date()).format("YYYY.MM.DD")}`}
                                                               value={date1 !== "" ? moment(date1) : ""}
                                                           />
                                                           : ""
                                                   }
                                                   {
                                                       value === "all" ?
                                                           <DatePicker
                                                               className={`selectedDate ${isDarkMode && 'darkModeInputBackgraund'}`}
                                                               onChange={onChangeee2}
                                                               placeholder={`${moment(new Date()).format("YYYY.MM.DD")}`}
                                                               value={date2 !== "" ? moment(date2) : ""}
                                                           />
                                                           : ""
                                                   }
                                               </Space>
                                               <button className="button ml-1" onClick={handleSearch}><AiOutlineSearch/></button>

                                           </div>

                                           <div className="access-control-pagination">
                                               <p className={`content_total ${isDarkMode && 'darkModeColor'}`}>{t('Jami')}: {staffTotal} </p>
                                               <WorkingHoursReportPagination
                                                   staffPaginationLimit={staffPaginationLimit}
                                                   staffPaginationCurrent={staffPaginationCurrent}
                                                   staffPaginationOnChange={staffPaginationOnChange}
                                                   accessTableTotal={staffTotal}
                                               />
                                           </div>
                                       </div>

                                </div>
                                <div className="access_control_setting_tab_item_body_table">
                                    <WorkingHoursReportTable
                                        isDarkMode={isDarkMode}
                                        staffData={staffData}
                                        rowSelection={rowSelection}
                                        setIsOpenAddStaff={setIsOpenAddStaff}
                                        setStaffTableIntialValues={setStaffTableIntialValues}
                                        value_check={value}
                                    />
                                </div>
                            </div>
                            <div className='access_control_setting_tab_item_footer_working_report'>
                                <div className='access_control_setting_tab_item_footer_buttons'>
                                    {/*<button onClick={addNewStaff} className='add_button'>*/}
                                    {/*    <MdOutlineAddCircleOutline size={24} style = {{marginRight: '5px'}}/>*/}
                                    {/*    {t("Xodim qo'shish")}*/}
                                    {/*</button>*/}
                                    {/*{*/}
                                    {/*    deleteStaff.length > 0 &&*/}
                                    {/*    <button onClick={handleDeliteStaff}>*/}
                                    {/*        <AiOutlineDelete size={22} style = {{marginRight: '5px'}}/>*/}
                                    {/*        {t("O’chirish")}*/}
                                    {/*    </button>*/}
                                    {/*}*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*</TabPane>*/}
                    {/*</Tabs>*/}

                </div>

            </div>

        </div>
    );
};

export default WorkingHoursReport;