import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Modal from "react-modal";

import "./filterModal.css";
import {DatePicker, Form, Input, Radio, Select} from "antd";
import moment from "moment";


import styled from 'styled-components';
import axios from "axios";
import {ip} from "../../../../ip";

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

const FilterModal = (props) => {
    const {
        isOpenFilter,
        setIsOpenFilter,
        filterInitialValue,
        setFilterInitialValue,
        getReportData,
        setReportData,
        reportPaginationLimit,
        reportPaginationCurrent,
        setReportTotal,
        setHomeName,
        homeName
    } = props;

    const {t} = useTranslation();
    const lang = localStorage.getItem('i18nextLng');
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [group , setGroup] = useState([]);
    const [position , setPosition] = useState([]);
    useEffect(()=>{
        axios.get(`${ip}/access-control-service/api/terminal/all-with-group`,
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res)=>{
                setGroup(res?.data?.data)
            });
        axios.get(`${ip}/access-control-service/api/all/position`,
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res)=>{
                setPosition(res?.data?.data);
            });
    },[isOpenFilter]);

    const [doorIndex, setDoorIndex] = useState(null);


    const onChangeGroup = (e, a) => {
        setDoorIndex(e);
        setHomeName(true);
    };

    const optionsDoor = [];
    const doorId = [];
    for (let i = 0; i < group[doorIndex]?.terminals?.length; i++) {
        doorId.push(group[doorIndex]?.terminals[i]?.ip_address);
        optionsDoor.push(
            {
                value: group[doorIndex]?.terminals[i]?.ip_address,
                label: group[doorIndex]?.terminals[i]?.door_name
            },
        );
    }

    // console.log(optionsDoor);

    const [selectedDoor , setSelectedDoor] = useState(false);
    const onChangeDoor = (e , a) =>{
        setSelectedDoor(true);
        setFilterInitialValue({
            ...filterInitialValue,
            doors: e,
        });
    };

    const optionsPosition = [];
    for (let i = 0; i < position?.length; i++) {
        optionsPosition.push(
            {
                value: position[i]?.id,
                label: position[i]?.full_name
            },
        );
    }
    const onChangePosition = (e , a) => {
        setFilterInitialValue({
            ...filterInitialValue,
            position: e,
        });
    };

    const optionsAction = [];
    optionsAction.push(
        {value: 1, label: "Erta kelgan"},
        {value: 2, label: "Kech kelgan"},
        {value: 3, label: "Erta ketgan"},
        {value: 4, label: "Kech ketgan"}
    );

    const onChangeAction = (e , a) => {
        setFilterInitialValue({
            ...filterInitialValue,
            action: e,
        });
    };

    const onChangeReportType = (e , a) => {
        // console.log(e)
        setFilterInitialValue({
            ...filterInitialValue,
            report_type: e,
        });
    };

    const onChangeDateFrom = (e, a) => {
        setFilterInitialValue({
            ...filterInitialValue,
            from_date: a
        });
    };

    const onChangeDateTo = (e, a) => {
        setFilterInitialValue({
            ...filterInitialValue,
            to_date: a
        });
    };

    const cancel = () => {
        setIsOpenFilter(!isOpenFilter);
        setFilterInitialValue({
            order_column : '',
            order_type : '',
            fullname : '',
            doors : '',
            position : '',
            from_date : '',
            to_date : '',
            action : '',
            report_type : ''
        });
        getReportData(filterInitialValue);
        setPosition([]);
        setGroup([]);
        setDoorIndex(null);
    };

    console.log(doorId);
    const onFinish = (value) => {
        if (selectedDoor === false){
            setFilterInitialValue({
                ...filterInitialValue,
                doors : doorId
            })
        }
        getReportData(filterInitialValue);
        setIsOpenFilter(!isOpenFilter);

        //  axios.post(`${ip}/access-control-service/api/history-log/${reportPaginationLimit}/${reportPaginationCurrent}`,
        //     filterInitialValue,
        //     {
        //         headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
        //     }
        // )
        //      .then((res)=>{
        //          getReportData(reportPaginationCurrent);
        //          setIsOpenFilter(!isOpenFilter);
        //      })
    }

    const onFinishFailed = (error) => {
        console.log(error);
    };


    return (
        <div>
            <Modal
                isOpen={isOpenFilter}
                onRequestClose={() => setIsOpenFilter(!isOpenFilter)}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                {/*<Form*/}
                {/*    name="basic"*/}
                {/*    layout="vertical"*/}
                {/*    initialValues={filterInitialValue}*/}
                {/*    requiredMark="optional"*/}
                {/*    onFinish={onFinish}*/}
                {/*    onFinishFailed={onFinishFailed}*/}
                {/*    autoComplete="off"*/}
                {/*>*/}
                    <div className={`filter_car_modal ${isDarkMode && 'darkModeCard'}`}>
                        <div className={`filter_car_modal_tile ${isDarkMode && 'darkModeColor'}`}>
                            Saralash
                        </div>
                        <div className="filter_car_input_lebel_groups">
                            <div className="car_input_lebel_right">
                                <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                    {t("Bino nomi")}:
                                </p>
                                <div className="input_wrapper">
                                    <SelectStyles
                                        className={`left_select ${isDarkMode && "darkModeColor"}`}
                                        size="large"
                                        style={{width: "100%"}}
                                        placeholder={"Tanlang"}
                                        onChange={onChangeGroup}
                                        value={group[doorIndex]?.[`name_${lang}`]}
                                    >
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            disabled value="">
                                            <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                                        </Select.Option>
                                        {group?.map((item,index)=>{
                                            return(
                                                <Select.Option
                                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                    value={index}>{item?.[`name_${lang}`]}</Select.Option>
                                            )
                                        })}

                                    </SelectStyles>
                                </div>
                            </div>
                            <div className="car_input_lebel_right">
                                <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                    {t("Eshik")}:
                                </p>
                                <div className="input_wrapper">
                                    <Select
                                        mode="tags"
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t('Tanlang')}
                                        onChange={onChangeDoor}
                                        options={optionsDoor}
                                        value={filterInitialValue.doors !== '' ? filterInitialValue.doors : []}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="filter_car_input_lebel_groups">
                            <div className="car_input_lebel_right">
                                <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                    {t("Lavozimi")}:
                                </p>
                                <div className="input_wrapper">
                                        <Select
                                            mode="tags"
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder={t('Tanlang')}
                                            onChange={onChangePosition}
                                            options={optionsPosition}
                                            value={filterInitialValue.position !== '' ? filterInitialValue.position : []}
                                        />

                                </div>
                            </div>
                            <div className="car_input_lebel_right">
                                <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                    {t("Holati")}:
                                </p>
                                <div className="input_wrapper">
                                    <Select
                                        mode="tags"
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t('Tanlang')}
                                        onChange={onChangeAction}
                                        options={optionsAction}
                                        value={filterInitialValue.action !== '' ? filterInitialValue.action : []}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="filter_car_input_lebel_groups">
                            <div className="car_input_lebel_right">
                                <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                    {t("Hisobot turi")}:
                                </p>
                                <div className="input_wrapper">
                                    <SelectStyles
                                        className={`left_select ${isDarkMode && "darkModeColor"}`}
                                        size="large"
                                        style={{width: "100%"}}
                                        placeholder={"Tanlang"}
                                        onChange={onChangeReportType}
                                        value={filterInitialValue.report_type}
                                    >
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            disabled value="">
                                            <span style={{color: "#767E9D"}}>{t("Tanlash")}</span>
                                        </Select.Option>
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={1}>{t("Odatiy")}</Select.Option>
                                        <Select.Option
                                            className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                            value={2}>{t("Batafsil")}</Select.Option>
                                    </SelectStyles>
                                </div>
                            </div>
                        </div>


                        <div className="filter_car_modal_inputs">
                            <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                {t("Sana")}:
                            </p>
                            <div className="filter_car_modal_inputs_line">
                                <div className="filter_car_input_lebel_groups">
                                    <DatePicker
                                        className={`left_input ${isDarkMode && "darkModeInputBackgraund"}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM, 00:00:00")}`}
                                        onChange={onChangeDateFrom}
                                        size="large"
                                        style={{width: "100%", borderRadius: "5px"}}
                                        showTime
                                        value={!filterInitialValue.from_date ? "" : moment(filterInitialValue.from_date)}
                                    />
                                    <DatePicker
                                        className={`left_input ${isDarkMode && "darkModeInputBackgraund"}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM, 23:59:59")}`}
                                        onChange={onChangeDateTo}
                                        size="large"
                                        style={{width: "100%", borderRadius: "5px"}}
                                        showTime
                                        value={!filterInitialValue.to_date ? "" : moment(filterInitialValue.to_date)}
                                    />
                                </div>
                            </div>
                        </div>



                        <div className="add_camera_buttons">
                            <button
                                type="button"
                                onClick={cancel}
                                className="add_camera_buttons_cancle"
                            >
                                {t("Bekor qilish")}
                            </button>
                            <button type="submit" className="add_camera_buttons_save" onClick={onFinish}>
                                {t("Saqlash")}
                            </button>
                        </div>
                    </div>
                {/*</Form>*/}
            </Modal>
        </div>
    );
};

export default FilterModal;
