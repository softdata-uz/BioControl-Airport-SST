import React, {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Modal from "react-modal";

import "./filterModal.css";
import {DatePicker, Form, Input, Radio, Select} from "antd";
import moment from "moment";


import styled from 'styled-components';
import axios from "axios";
import {ip} from "../../../../ip";
import {storage} from "../../../../services";

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

    const user = storage.local.get("user");
    const token = storage.local.get("token");

    const {t, i18n} = useTranslation();


    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [group , setGroup] = useState([]);
    useEffect(() => {
        if (!token) return;
        axios.get(`${ip}/access-control-service/api/terminal-group`, {
            headers: { 'x-access-token': token }
        })
            .then(res => {
                setGroup(res?.data?.data || []);
            })
            .catch(() => {
                setGroup([]);
            });
    }, [isOpenFilter, user?.role, token]);




    const optionsDoor = [];
    const doorId = [];
    for (let i = 0; i < group?.length; i++) {
        doorId.push(group[i]?.id);
        optionsDoor.push(
            {
                value: group[i]?.id,
                label: group[i]?.[`name_${i18n?.language}`]
            },
        );
    }


    const [selectedDoor , setSelectedDoor] = useState(false);
    const onChangeGroup = (e, a) => {
        setSelectedDoor(true);
        setFilterInitialValue({
            ...filterInitialValue,
            group_id: e,
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

    const [filterChang, setFilterChang] = useState([])
    const [staffFilter, setStaffFilter] = useState([]);
    useEffect(() => {
        const getStaffFilterData = () => {
            axios.get(`${ip}/access-control-service/api/all/department`,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    const { data } = res;
                    const newData = data.data.map(item => ({
                        id: item.id,
                        full_name: item.full_name,
                    }));
                    setStaffFilter(newData)
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        getStaffFilterData();
    }, []);
    const onChangeStaffFilter = (e) => {
        setFilterChang(e);
        setFilterInitialValue({
            ...filterInitialValue,
            department: e,
        });
    };

    const cancel = () => {
        setIsOpenFilter(!isOpenFilter);
        setFilterChang([])
        setFilterInitialValue({
            order_column: '',
            order_type: '',
            fullname: '',
            group_id : '',
            from_date: '',
            to_date: '',
            action: '',

            department: '',
            entering_door: '',
            entering_time: '',
            exiting_door: '',
            exiting_time: '',
            group_name_en: '',
            group_name_ru: '',
            group_name_uz: '',
            image: '',
            is_early_go: '',
            is_late: '',
            rank: '',
            report_date: ''
        });
        getReportData(filterInitialValue);
        setGroup([]);
        setSelectedDoor(false);


    };

    const onFinish = (value) => {
        if (selectedDoor === false){
            setFilterInitialValue({
                ...filterInitialValue,
                group_id : doorId
            })
        }
        getReportData(filterInitialValue);
        setIsOpenFilter(!isOpenFilter);
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
                            {t("Saralash")}
                        </div>
                        <div className="filter_car_input_lebel_groups">
                            <div className="car_input_lebel_right">
                                <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                    {t("Bino nomi")}:
                                </p>
                                <div className="input_wrapper">
                                    {/*<Select*/}
                                    {/*    mode="multiple"*/}
                                    {/*    style={{width: '100%'}}*/}
                                    {/*    options={optionsDoor}*/}
                                    {/*    value={filterInitialValue?.group_id}*/}
                                    {/*    onChange={onChangeGroup}*/}
                                    {/*    placeholder={t('Tanlang')}*/}
                                    {/*/>*/}

                                    <Select
                                        mode="multiple"
                                        style={{width: '100%'}}
                                        placeholder={t('Tanlang')}
                                        onChange={onChangeGroup}
                                        options={optionsDoor}
                                        // defaultValue={doorId}
                                        // value={filterInitialValue?.group_id !== '' ? filterInitialValue?.group_id : doorId}
                                        value = {
                                            filterInitialValue?.group_id?.length
                                                ? filterInitialValue.group_id
                                                : doorId
                                        }
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

                        <div className="" >
                            <p className={`input_label ${isDarkMode && "darkModeColor"}`}>
                                {t("Bo'lim")}:
                            </p>
                            <div className="input_wrapper">
                            <SelectStyles
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                defaultValue="all"
                                placeholder={t("Tanlash")}
                                value={filterChang}
                                onChange={onChangeStaffFilter}
                                options={staffFilter?.map((item) => ({
                                    value: item.id,
                                    label: item.full_name
                                }))}
                            />
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
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={onChangeDateFrom}
                                        size="large"
                                        style={{width: "100%", borderRadius: "5px"}}
                                        // showTime
                                        value={!filterInitialValue.from_date ? "" : moment(filterInitialValue.from_date)}
                                    />
                                    <DatePicker
                                        className={`left_input ${isDarkMode && "darkModeInputBackgraund"}`}
                                        placeholder={`${moment(new Date()).format("YYYY.DD.MM")}`}
                                        onChange={onChangeDateTo}
                                        size="large"
                                        style={{width: "100%", borderRadius: "5px"}}
                                        // showTime
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
