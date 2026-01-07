import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {DatePicker, Form, Input, Select, Switch, TimePicker, TreeSelect} from 'antd';
import {useTranslation} from "react-i18next";
import moment from "moment";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

import './left.css';


import styled from "styled-components";
import axios from "axios";
import {ip} from "../../../../ip";
import {it} from "date-fns/locale";

const {SHOW_PARENT} = TreeSelect;
const {Option} = Select;
dayjs.extend(customParseFormat);


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
export const TreeSelectStyles = styled(TreeSelect)`
  .ant-select-selector {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  .ant-select-selection-item{
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  .ant-form-item-explain .ant-form-item-explain-connected{
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;


const Left = ({
                  staffTableIntialValues,
                  isOpenAddStaff,
                  setStaffTableIntialValues,
                  setDepartment,
                  department,
                  setDepartmentIndex,
                  departmentIndex,
                  setPositionIndex,
                  positionIndex,
                  indexDepartment,
                  optionsDoor,
                  setOptionsDoor,
                  workTime,
                  setWorkTime
              }) => {


    const {t} = useTranslation();

    const lang = localStorage.getItem('i18nextLng');
    const isDarkMode = useSelector(state => state.theme.theme_data)




    useEffect(() => {
        const getPositionsData = () => {
            axios.get(`${ip}/access-control-service/api/all-with-position/department`,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    const {data} = res;
                    // console.log("tree",   data)
                    const newData = data.data.map(item => ({
                        full_name: item.full_name,
                        id: item.id,
                    }))
                    setDepartment(newData);
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        getPositionsData();
    }, [])

    useEffect(() => {
        const getWorkTimeData = () => {
            axios.get(`${ip}/access-control-service/api/all/work-time-schedule`,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    const {data} = res;
                    // console.log("tree",   data)
                    const newData = data.data.map(item => ({
                        name: item.name,
                        id: item.id,
                    }))
                    setWorkTime(newData);
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        getWorkTimeData();
    }, [])




// bino nomi
    const [group, setGroup] = useState([]);

    useEffect(() => {
        axios.get(`${ip}/access-control-service/api/terminal/all-with-group`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res) => {
                setGroup(res?.data?.data)
            });
        axios.get(`${ip}/access-control-service/api/all-with-position/department`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res) => {
                setDepartment(res?.data?.data);
            });
    }, [isOpenAddStaff]);

    // console.log(staffTableIntialValues);


    const [doorIndex, setDoorIndex] = useState(null);
    // const optionsDoor = [];
    const doorId = [];
    const onChangeGroup = (e, a) => {
        setOptionsDoor([]);
        setDoorIndex(e);
        selectedDoor(e);
    };


    const selectedDoor = (doorIndex) =>{
        for (let i = 0; i < group[doorIndex]?.terminals?.length; i++) {
            doorId.push(group[doorIndex]?.terminals[i]?.ip_address);
            const newOption = {
                value: group[doorIndex]?.terminals[i]?.ip_address,
                key: group[doorIndex]?.terminals[i]?.ip_address,
                label: group[doorIndex]?.terminals[i]?.door_name
            };
            // Add the new object to the optionsDoor array
            setOptionsDoor(prevOptions => [...prevOptions, newOption]);
        }
    }

    // console.log(optionsDoor);


    const onChangeDoor = (e, a) => {
        // console.log(a)
        setOptionsDoor(a)
        setStaffTableIntialValues({
            ...staffTableIntialValues,
            door_ip: e,
        });
    };


    // bino nomi


    const changeDepartment = (e) => {
        setDepartmentIndex(e);
        setStaffTableIntialValues({
            ...staffTableIntialValues,
            rank: []
        });
    }



    const changePosition = (e) => {
        setPositionIndex(e);
    }


    return (
        <div className="access_control_add_staff_modal_body_item_left">
            <div className="access_control_add_staff_modal_body_item_left_inputs_fish">
                <Form.Item
                    label={t("F.I.SH")}
                    name="fullname"
                    rules={[
                        {
                            required: true,
                            message: t("F.I.SH kiriting"),
                        },
                    ]}
                >
                    <Input
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        size="large"
                        placeholder={t("Kiriting")}
                        style={{borderRadius: '5px', width: '100%'}}
                    />
                </Form.Item>
            </div>
            {/*<div className="access_control_add_staff_modal_body_item_left_inputs">*/}
            {/*    <Form.Item*/}
            {/*        label={t("Tabel raqami")}*/}
            {/*        name="tabel_number"*/}
            {/*        rules={[*/}
            {/*            {*/}
            {/*                required: true,*/}
            {/*                message: t("Tabel raqami kiriting!"),*/}
            {/*            },*/}
            {/*        ]}*/}
            {/*    >*/}
            {/*        <Input*/}
            {/*            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}*/}
            {/*            size="large"*/}
            {/*            placeholder={t("Kiriting")}*/}
            {/*            style={{borderRadius: '5px', width: '100%'}}*/}
            {/*        />*/}
            {/*    </Form.Item>*/}
                <Form.Item
                    label={t("Jinsi")}
                    name="gender"
                    rules={[
                        {
                            required: true,
                            message: t("Jinsni tanlang"),
                        },
                    ]}
                >
                    <SelectStyles
                        size="large"
                        placeholder={t("Kiriting")}
                    >
                        <Select.Option
                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                            disabled value="">
                            <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                        </Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="male">
                            {t("Erkak")}</Select.Option>
                        <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                       value="female">
                            {t("Ayol")}</Select.Option>
                    </SelectStyles>
                </Form.Item>

            {/*</div>*/}
            <Form.Item
                label={t("Bo'lim")}
                name="department"
                rules={[
                    {
                        required: true,
                        message: t("Bo'limni tanlang"),
                    },
                ]}
            >
                <SelectStyles
                    placeholder="Tanlang"
                    onChange={(e) => {
                        changeDepartment(e)
                    }}
                >
                    <Select.Option
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        disabled value="">
                        <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                    </Select.Option>
                    {
                        department && department?.map((item, index) => (
                            <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                           key={index}
                                           value={index}>
                                {t(item.full_name)}
                            </Select.Option>
                        ))
                    }
                </SelectStyles>
            </Form.Item>

            <Form.Item
                label={t("Lavozimi")}
                name="rank"
                rules={[
                    {
                        required: true,
                        message: t("Lavozimini tanlang"),
                    },
                ]}

            >
                <SelectStyles onChange={(e) => {
                    changePosition(e)
                }} placeholder={t("Tanlash")}>
                    <Select.Option
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} disabled value=''>
                        <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                    </Select.Option>
                    {
                        department[indexDepartment >= 0 && departmentIndex == null ? indexDepartment : departmentIndex]?.position?.map((item, index) => (
                            <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`} key={index} value={index}>
                                {t(item.full_name)}
                            </Select.Option>
                        ))
                    }
                </SelectStyles>
            </Form.Item>
            {/*</div>*/}


            <p className="access_time_label">{t('Bino nomi')}</p>
            <div className="access_control_add_staff_modal_body_item_left_input">

                <SelectStyles
                    className={`left_select ${isDarkMode && "darkModeColor"}`}
                    size="large"
                    style={{width: "100%"}}
                    placeholder={t("Tanlash")}
                    onChange={onChangeGroup}
                    value={group[doorIndex]?.[`name_${lang}`]}
                >
                    <Select.Option
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        disabled value="">
                        <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                    </Select.Option>
                    {group?.map((item, index) => {
                        return (
                            <Select.Option
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                key={index} value={index}>{item?.[`name_${lang}`]}</Select.Option>
                        )
                    })}
                </SelectStyles>

                <p className="access_time_label">{t('Ruxsat etilgan eshiklar')}</p>
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        placeholder={t('Tanlash')}
                        onChange={onChangeDoor}
                        options={optionsDoor}
                        // defaultValue={optionsDoor}
                        value={staffTableIntialValues.door_ip !== '' && optionsDoor.length === 0 ? staffTableIntialValues.door_ip : optionsDoor}
                    />
            </div>

            <p className="access_time_label">{t('Ruxsat etiladigan muddat')}</p>
            <div className="access_control_add_staff_modal_body_item_left_inputs">
                <Form.Item
                    // label={t(" ")}
                    name="valid_from_time"
                    rules={[
                        {
                            required: true,
                            message: t("Muddatni tanlang"),
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
                    />
                </Form.Item>
                <Form.Item
                    name="valid_to_time"
                    rules={[
                        {
                            required: true,
                            message: t("Muddatni tanlang"),
                        },
                    ]}
                >
                    <DatePicker
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        placeholder={`${moment(new Date()).startOf("day").add(10, "years").format("DD.MM.YYYY")}`}
                        size="large"
                        style={{borderRadius: '5px'}}
                    />
                </Form.Item>
            </div>
            <p className="access_time_label">{t('Ish vaqti')}</p>
            <div className="access_control_add_staff_modal_body_item_left_inputs">
                <Form.Item
                    name="work_time_from"
                    rules={[
                        {
                            required: true,
                            message: t("Vaqtni tanlang"),
                        },
                    ]}
                >
                    <TimePicker
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        placeholder="Vaqtni tanlang"
                        size="large"
                        style={{ borderRadius: '5px' }}
                        format="HH:mm" // Soat va daqiqani formatlash
                        // defaultValue={moment("09:00", "HH:mm")} // Default 18:00 vaqtini o‘rnatish
                    />
                </Form.Item>
                <Form.Item
                    name="work_time_to"
                    rules={[
                        {
                            required: true,
                            message: t("Vaqtni tanlang"),
                        },
                    ]}
                >
                    <TimePicker
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        placeholder="Vaqtni tanlang"
                        size="large"
                        style={{ borderRadius: '5px' }}
                        format="HH:mm" // Soat va daqiqani formatlash
                    />
                </Form.Item>
            </div>
            {/*<Form.Item*/}
            {/*    label={t("Ish vaqti")}*/}
            {/*    name="work_time_schedule_id"*/}
            {/*    rules={[*/}
            {/*        {*/}
            {/*            required: true,*/}
            {/*            message: t("Ish vaqti tanlang"),*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*>*/}
            {/*    <SelectStyles*/}
            {/*        placeholder={t("Tanlang")}*/}
            {/*    >*/}
            {/*        <Select.Option*/}
            {/*            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}*/}
            {/*            disabled value="">*/}
            {/*            <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>*/}
            {/*        </Select.Option>*/}
            {/*        {*/}
            {/*            workTime && workTime?.map((item, index) => (*/}
            {/*                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}*/}
            {/*                               key={index}*/}
            {/*                               value={item.id}>*/}
            {/*                    {t(item.name)}*/}
            {/*                </Select.Option>*/}
            {/*            ))*/}
            {/*        }*/}
            {/*    </SelectStyles>*/}
            {/*</Form.Item>*/}

        </div>
    )
};

export default Left;

