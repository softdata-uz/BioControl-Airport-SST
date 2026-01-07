import React, {useEffect, useState} from 'react';
import {ip} from '../../../ip';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {DatePicker, Input, Select} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {AiOutlineClear, AiOutlineSearch} from "react-icons/ai";
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import moment from "moment";
import './acsessControl.css';

import AcsessTable from "./AcsessTable";
import AccessControlSearchPagination from './Pagination';
import exel from "../../../images/exel.svg";
import pdf from "../../../images/pdf.svg";

import styled from "styled-components";


export const SelectStyles = styled(Select)`
    .ant-select-selector {
        background: ${({theme}) => theme.body} !important;
        color: ${({theme}) => theme.text} !important;
        transition: background 0.2s ease-in, color 0.2s ease-in;
    }

    .ant-select-selection-item {
        color: ${({theme}) => theme.text} !important;
    }
`;

export const InputStyles = styled(Input)`
    .ant-input {
        background: ${({theme}) => theme.body} !important;
        color: ${({theme}) => theme.text} !important;
        transition: background 0.2s ease-in, color 0.2s ease-in;
    }
`;


const AcsessControlTable = () => {

    const isDarkMode = useSelector(state => state.theme.theme_data)
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const [accessTablePaginationLimit, setAccessTablePaginationLimit] = useState(15)
    const [accessTablePaginationCurrent, setAccessTablePaginationCurrent] = useState(1)
    const [accessTableData, setAccessTableData] = useState([])
    const [accessTableTotal, setAccessTableTotal] = useState(null)
    const navigate = useNavigate()
    const {t} = useTranslation()

    const [name, setName] = useState('');
    const [deviceName, setDeviceName] = useState([]);
    const [userType, setUserType] = useState('all');
    const [position, setPosition] = useState([]);
    const [direction, setDirection] = useState('all');
    const [authType, setAuthType] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [allowedDoor, setAllowedDoor] = useState([]);
    const [positions, setPositions] = useState([]);

    const [department, setDepartment] = useState([]);
    const [departmentValue, setDepartmentValue] = useState([]);


    const authTypeData = [[
        {value: 1, name: "Yuz"},
        {value: 2, name: "Barmoq izi"},
        {value: 3, name: "ID karta"},
        {value: 4, name: "Yuz va Barmoq izi"},
        {value: 6, name: "Yuz va ID karta"},
        {value: 8, name: "Barmoq izi va ID karta"},
    ]]


    useEffect(() => {
        const getPositionsData = () => {
            axios.get(`${ip}/access-control-service/api/all/position/`,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    const {data} = res;
                    // console.log("tree666",   data)
                    const newData = data.data.map(item => ({
                        full_name: item.full_name,
                        id: item.id,
                    }))
                    setPositions(newData)
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        getPositionsData();
    }, [])

    useEffect(() => {
        const getDepartmentData = () => {
            axios.get(`${ip}/access-control-service/api/all/department`,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    const {data} = res;
                    const newData = data.data.map(item => ({
                        id: item.id,
                        full_name: item.full_name,
                    }))
                    setDepartment(newData)
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        getDepartmentData();
    }, [])


    const onChangeName = (e) => {
        setName(e.target.value);
    };
    const onChangeDeviceName = (e) => {
        setDeviceName(e)
    };
    const onChangeUserType = (e) => {
        setUserType(e)
    };

    const onChangeDepartment = (e) => {
        setDepartmentValue(e)
    };
    const onChangePosition = (e) => {
        setPosition(e)
    };

    const onChangeAuthType = (e) => {
        setAuthType(e)
    }

    const onChangeDirection = (e) => {
        setDirection(e)
    }

    const onChangeDateFrom = (e, a) => {
        setDateFrom(a);
    };

    const onChangeDateTo = (e, a) => {
        setDateTo(a);
    };

    const fetchAccessTable = async (id) => {
        const response = await axios.post(`${ip}/access-control-service/api/history/${accessTablePaginationLimit}/${id}`, {
            fullname: name,
            device_name: deviceName,
            department: departmentValue,
            rank: position,
            user_type: userType,
            auth_type: authType,
            direction: direction,
            fromDate: dateFrom,
            toDate: dateTo,
        }, {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
        const {data} = response;
        const count = data.count;
        setAccessTableTotal(count)
        const newData = data.data.map((item, index) => ({
            ...item,
            key: index + 1 + (data.current_page - 1) * accessTablePaginationLimit,
            created_time: moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss'),
            direction: item.direction,
            door_name: item.door_name,
            user_type: item.user_type,
            department: item.department,
            rank: item.rank,
            auth_type: item.auth_type
        }))
        setAccessTableData(newData)
    }

    const accessTablePaginationOnChange = (e = 1, option) => {
        fetchAccessTable(e)
        setAccessTablePaginationCurrent(e)
        setAccessTablePaginationLimit(option)
    }

    const clear = () => {
        setName('')
        setDeviceName([])
        setPosition([])
        setUserType('all')
        setAuthType([])
        setDirection('all')
        setDateFrom('')
        setDateTo('')
        setAccessTableTotal(null)
        setAccessTableData(null)
    }

    useEffect(() => {
        fetchAccessTable(accessTablePaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessTablePaginationLimit, accessTablePaginationCurrent])

    useEffect(() => {
        // if (!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const getData = () => {
            axios.get(`${ip}/access-control-service/api/adduser/terminal`, {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
                .then(res => {
                    const {data} = res;
                    setAllowedDoor(data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        getData()
    }, [])

    const getReport = (type, paramsObj) => {
        axios.get(`${ip}/access-control-service/api/report/history/${type}`,
            {
                params: {filter: JSON.stringify(paramsObj)},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
            .then((res) => {
                // setLoading(false);
                // setLoadingPdf(false);
            })
    }


    // excel pdf
    const downloadReportExcel = async () => {
        const response = await axios.post(
            `${ip}/access-control-service/api/report/history/excel`,
            {
                fullname: name,
                device_name: deviceName,
                department: departmentValue,
                rank: position,
                user_type: userType,
                auth_type: authType,
                direction: direction,
                fromDate: dateFrom,
                toDate: dateTo,
            },
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token'),},
                responseType: 'blob', // Important for handling binary data
            }
        )
        // console.log("res : " + response)
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const downloadReport = async () => {
        axios.post(`${ip}/access-control-service/api/report/history/pdf`,
            {
                fullname: name,
                device_name: deviceName,
                department: departmentValue,
                rank: position,
                user_type: userType,
                auth_type: authType,
                direction: direction,
                fromDate: dateFrom,
                toDate: dateTo
            },
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')},
                responseType: 'blob'
            }
        )
            .then((res) => {
                const blob = new Blob([res.data], {type: 'application/pdf'});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'report.pdf'; // File name
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => {
                console.error('Error downloading the PDF report:', error);
            });
    }


    // excel pdf

    return (<>
            <div className={`accsessControl ${isDarkMode && 'darkModeLayautBg '}`}>

                <div className="acsess_content_top_list">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t('Jadval')}</p>
                    <div className='access-control-pagination_list'>

                        <div className="download_buttons">
                            <button
                                onClick={downloadReportExcel}
                                className={`download_btn ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>
                                <div className="downloadLink_excel_pdf">
                                    <img src={exel}/>
                                    {t('Yuklash')}
                                </div>
                            </button>
                            <button
                                onClick={downloadReport}
                                className={`download_btn_pdf ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>
                                <div className="downloadLink_excel_pdf">
                                    <img src={pdf}/>
                                    {t('Yuklash')}
                                </div>
                            </button>
                        </div>

                        <p className={`content_total ${isDarkMode && 'darkModeColor'}`}>{t('Jami')}: {accessTableTotal} </p>
                        <AccessControlSearchPagination
                            accessTablePaginationLimit={accessTablePaginationLimit}
                            accessTablePaginationCurrent={accessTablePaginationCurrent}
                            accessTablePaginationOnChange={accessTablePaginationOnChange}
                            accessTableTotal={accessTableTotal}
                        />
                    </div>
                </div>

                <div className={`acsess_content ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                    <div className={`acsess_left ${isDarkMode && ' darkModeBorder'}`}>
                        <div className="acsess_left_inputs">
                            <div className="form_input_wrapper">
                                <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Ism')}</p>
                                <div className="input_wrappe">
                                    <Input
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                        onChange={onChangeName}
                                        value={name}
                                        type="text"
                                        size="large"
                                        // style={{marginRight: "10px", borderRadius: '5px'}}
                                        placeholder={t('Kiriting')}
                                    />
                                </div>
                            </div>

                            <div className="access_control_table_inline_inputs">
                                <div className="form_input_wrapper">
                                    <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Toifasi')}</p>
                                    <div className="input_wrapper">
                                        <SelectStyles
                                            className={`left_select ${isDarkMode && 'darkModeInputBackgraund'}`}
                                            // size="large"
                                            style={{width: "100%"}}
                                            // placeholder={"Kiriting"}
                                            onChange={onChangeUserType}
                                            value={userType}
                                            defaultValue={userType}
                                        >
                                            <Select.Option
                                                style={{color: "#767E9D"}}
                                                className={`all ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                value="all"
                                            >{t('Hammasi')}
                                            </Select.Option>
                                            <Select.Option
                                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                value="1">{t("Xodim")}</Select.Option>
                                            <Select.Option
                                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                value="2">{t("Begona")}</Select.Option>
                                        </SelectStyles>
                                    </div>
                                </div>

                            </div>

                            <div className="form_input_wrapper">
                                <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t("Bo'lim")}</p>
                                <div className="input_wrapper">
                                    <SelectStyles
                                        mode="multiple"
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        defaultValue="all"
                                        placeholder={t("Tanlash")}
                                        value={departmentValue}
                                        onChange={onChangeDepartment}
                                        options={department?.map((item) => ({
                                            value: item.id,
                                            label: item.full_name
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="form_input_wrapper">
                                <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Lavozimi')}</p>
                                <div className="input_wrapper">
                                    <SelectStyles
                                        mode="multiple"
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        defaultValue="all"
                                        placeholder={t("Tanlash")}
                                        value={position}
                                        onChange={onChangePosition}
                                        options={positions?.map((item) => ({
                                            value: item.id,
                                            label: item.full_name
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="form_input_wrapper">
                                <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t("Tasdiq turi")}</p>
                                <div className="input_wrapper acsec_c">
                                    {/*<div className="multiple_select">*/}
                                    <SelectStyles
                                        mode="multiple"
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        // defaultValue="all"
                                        placeholder={t("Tanlash")}
                                        value={authType}
                                        onChange={onChangeAuthType}
                                        options={authTypeData[0]?.map((item) => ({
                                            value: item.value,
                                            label: item.name
                                        }))}
                                    />
                                    {/*</div>*/}

                                </div>
                            </div>

                            <div className="form_input_wrapper">
                                <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Eshik')}</p>
                                <div className="input_wrapper">
                                    <SelectStyles
                                        mode="multiple"
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        // defaultValue="all"
                                        placeholder={t("Tanlash")}
                                        value={deviceName}
                                        onChange={onChangeDeviceName}
                                        options={allowedDoor?.map((item) => ({
                                            value: item.ip_address,
                                            label: item.door_name
                                        }))}
                                    />

                                    {/*<SelectStyles*/}
                                    {/*    className={`left_select `}*/}
                                    {/*    style={{width: "100%"}}*/}
                                    {/*    size="large"*/}
                                    {/*    defaultValue={'all'}*/}
                                    {/*    onChange={onChangeDeviceName}*/}
                                    {/*>*/}
                                    {/*    <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}*/}
                                    {/*                   value="all">{t('Hammasi')}</Select.Option>*/}
                                    {/*    {allowedDoor.map((item, index) => (*/}
                                    {/*        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}*/}
                                    {/*                       key={index}>{item.door_name}</Select.Option>))}*/}
                                    {/*</SelectStyles>*/}
                                </div>
                            </div>

                            <div className="form_input_wrapper">
                                <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t("Yo'nalishi")}</p>
                                <div className="input_wrapper">
                                    <SelectStyles
                                        className={`left_select`}
                                        onChange={onChangeDirection}
                                        style={{width: "100%",}}
                                        size="large"
                                        defaultValue={direction}
                                        value={direction}
                                    >
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value="all">{t('Hammasi')}</Select.Option>
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value="Entry">{t("Kirish")}</Select.Option>
                                        <Select.Option
                                            className={`${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value="Exit">{t("Chiqish")}</Select.Option>
                                    </SelectStyles>
                                </div>
                            </div>

                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Muddat')}:</p>
                            <div className="form_input_wrapper2">
                                <div className="input_wrapper">
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM, 00:00:00")}`}
                                        onChange={onChangeDateFrom}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        showTime
                                        value={dateFrom !== "" ? moment(dateFrom) : ""}
                                    />
                                </div>
                                <div className="input_wrapper"
                                    // style={{marginTop: "5px"}}
                                >
                                    <DatePicker
                                        className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM, 26:59:59")}`}
                                        onChange={onChangeDateTo}
                                        size="large"
                                        style={{width: "100%", borderRadius: '5px'}}
                                        showTime
                                        value={dateTo !== "" ? moment(dateTo) : ""}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="form_input_wrapper add_clear_button" style={{marginTop: "5px"}}>
                            <div className="input_wrapper">
                                <button
                                    type="button"
                                    className="soft_btn"
                                    onClick={() => fetchAccessTable(1)}
                                    icon={<SearchOutlined/>}
                                    size="large"
                                    style={{width: "100%"}}
                                >
                                    <AiOutlineSearch size={22} style={{marginRight: '5px'}}/>
                                    {t("Qidirish")}
                                </button>
                            </div>

                            <div className="input_wrapper">
                                <button
                                    type="button"
                                    className="clear_button"
                                    onClick={clear}
                                >
                                    <AiOutlineClear size={24} style={{marginRight: '5px'}}/>
                                    {t("Filterni tozalash")}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`acsess_right ${isDarkMode && 'darkModeBackground darkModeBorder'} `}>
                        <AcsessTable
                            // isDarkMode={isDarkMode}
                            accessTableData={accessTableData}

                        />
                    </div>
                </div>
            </div>
        </>

    );
};

export default AcsessControlTable;
