import React, {useEffect, useState} from "react";
import {DatePicker, Input, Select, Space, Switch,} from "antd";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {ip} from "../../../ip";
import {AiOutlineClear, AiOutlineSearch} from 'react-icons/ai'
import axios from "axios";
import moment from "moment";

import Cart from './cart/Cart';
import FaceControlPagination from "./pagination/Pagination";
import "./faceControlSearch.css";


import styled from "styled-components";

export const SelectStyles = styled(Select)`
  .ant-select-selector {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;



export default function FaceControlSearch() {

    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const isDarkMode = useSelector(state => state.theme.theme_data)
    const navigate = useNavigate();
    const {t} = useTranslation();
    const lang = localStorage.getItem('i18nextLng') || 'uz'

    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [gender, setGender] = useState('all');
    const [mask, setMask] = useState('all');
    const [mood, setMood] = useState('all')
    const [glasses, setGlasses] = useState('all');
    const [beard, setBeard] = useState('all');
    const [group, setGroup] = useState([])
    const [camera, setCamera] = useState([])
    const [cameraIP, setCameraIP] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [cameraWithGroup, setCameraWithGroup] = useState([]);
    const [faceControlData, setFaceControlData] = useState(null);
    const [faceControlPaginationLimit, setFaceControlPaginationLimit] = useState(24);
    const [faceControlPaginationCurrent, setFaceControlPaginationCurrent] = useState(1);
    const [faceControlTotal, setFaceControlTotal] = useState(null);


    const fetchFaceControlData = async (id) => {
        // console.log({group, camera})

        const response = await axios.get(`${ip}/face-detection-service/api/faces/search/${faceControlPaginationLimit}/${id}`, {
            params: {
                fromDate: dateFrom,
                toDate: dateTo,
                fromAge: ageFrom,
                toAge: ageTo,
                gender,
                mask,
                beard,
                glasses,
                mood,
                // group,
                camera,
                ip: cameraIP.map(item => item.ip_address)
            },
            headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
        })
        // console.log(cameraIP)

        const {data} = response;
        const count = data.count;
        setFaceControlTotal(count)
        setFaceControlData(data.data)
    }
    // console.log(cameraIP)
    // console.log(camera)
    const getCameraWithGroup = async () => {
        const result = await axios.get(`${ip}/face-detection-service/api/camerawithgroup/${lang}`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = result;
        setCameraWithGroup(data);
    }



    const onChangeAgeFrom = (e) => {
        setAgeFrom(e.target.value);
    };

    const onChangeAgeTo = (e) => {
        setAgeTo(e.target.value);
    };

    const onChangeGender = (e) => {
        setGender(e);
    };


    const onChangeMask = (e) => {
        setMask(e);
    };

    const onChangeBeard = (e) => {
        setBeard(e);
    };

    const onChangeGlasses = (e) => {
        if (e === 'all') {
            setGlasses(e)
        } else if (e === '1') {
            setGlasses([1])
        } else if (e === '10') {
            setGlasses([0, 10])
        } else {
            setGlasses([14])
        }
    };

    // console.log(camera)

    const onChangeGroup = (e) => {
        const newElements = cameraWithGroup.filter((item) => {
            return e.includes(item?.id);
        });
        setGroup(newElements.map((item)=>

            item?.id

        ))
        const list = [];

        newElements.forEach((item) => {
            item.cameras.forEach((innerItem) => {
                list.push(innerItem);
            });
        });
        setCameraIP(list)
    }

    console.log({cameraIP})
    const onChangeCameraOptions = (e) => {
        console.log(e)
      setCamera(e)
    }

    const onChangeMood = e => {
        if (e === 'all') {
            setMood('all')
        } else {
            setMood([e])
        }
    }

    const onChangeDateFrom = (e, a) => {
        setDateFrom(a);
    };

    const onChangeDateTo = (e, a) => {
        setDateTo(a);
    };



    const faceControlPaginationOnChange = (e = 1, option) => {
        fetchFaceControlData(e)
        setFaceControlPaginationCurrent(e)
        setFaceControlPaginationLimit(option)
    }

    const clear = () => {
        setAgeFrom('')
        setAgeTo('')
        setGender('all')
        setMask('all')
        setMood('all')
        setGlasses('all')
        setBeard('all')
        onChangeGroup(0)
        onChangeCameraOptions('all')
        setGroup(0)
        setCamera('all')
        setDateFrom('')
        setDateTo('')
        setFaceControlTotal(null)
        setFaceControlData(null)
    }


    useEffect(() => {
        getCameraWithGroup()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang])

    useEffect(() => {
        getCameraWithGroup()
        fetchFaceControlData(faceControlPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [faceControlPaginationLimit, faceControlPaginationCurrent, lang])



    useEffect(() => {
        // if (!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);






    return (
        <>
            <div className="face_control_search">
                <div className="face_control_search_header">
                    <div className="content_top">
                        <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t('tasvirlar')}</p>
                    </div>
                    <div className="content_top_selects_pagrnations">
                        <div className="content_pagination">
                            <p className={`content_total ${isDarkMode && 'darkModeColor'}`}>{t('Jami')}: {faceControlTotal}</p>
                            <FaceControlPagination
                                accessTablePaginationLimit={faceControlPaginationLimit}
                                accessTablePaginationCurrent={faceControlPaginationCurrent}
                                accessTablePaginationOnChange={faceControlPaginationOnChange}
                                accessTableTotal={faceControlTotal}
                            />
                        </div>
                    </div>
                </div>

                <div className={`content ${isDarkMode && 'darkModeBackground'}`}>

                    <div className={`content_inputs ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                        <div className="content_tabs">

                                <div className="face_control_inputs">
                                    <div className="face_control_search_inline_inputs">
                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Yoshi')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <Input
                                                    className={`left_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                    onChange={onChangeAgeFrom}
                                                    value={ageFrom}
                                                    type="number"
                                                    size="large"
                                                    style={{marginRight: "2px", borderRadius: '5px'}}
                                                    placeholder={t('dan')}
                                                />
                                                <Input
                                                    className={`left_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                    onChange={onChangeAgeTo}
                                                    value={ageTo}
                                                    type="number"
                                                    si

                                                    ze="large"
                                                    style={{borderRadius: '5px'}}
                                                    placeholder={t('gacha')}
                                                />
                                            </div>
                                        </div>

                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Jinsi')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <SelectStyles
                                                    className={`face_search_inputs`}
                                                    onChange={onChangeGender}
                                                    style={{width: "100%",}}
                                                    size="large"
                                                    defaultValue={gender}
                                                    value={gender}
                                                >
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="all">{t('Hammasi')}
                                                    </Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="1">{t('Erkak')}
                                                    </Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="2">{t('Ayol')}
                                                    </Select.Option>
                                                </SelectStyles>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="face_control_search_inline_inputs">
                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Niqob')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <SelectStyles
                                                    className="left_select"
                                                    onChange={onChangeMask}
                                                    style={{width: "100%"}}
                                                    size="large"
                                                    defaultValue={mask}
                                                    value={mask}
                                                >
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="all">{t('Hammasi')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="2">{t("Niqobsiz")}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="3">{t('Niqobli')}</Select.Option>

                                                </SelectStyles>
                                            </div>
                                        </div>

                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Kayfiyat')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <SelectStyles
                                                    className="left_select"
                                                    onChange={onChangeMood}
                                                    style={{width: "100%"}}
                                                    size="large"
                                                    defaultValue={mood}
                                                    value={mood}
                                                >
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="all">{t('Hammasi')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="2">{t('Jilmaygan')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="3">{t('Jahldor')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="4">{t('Xafa')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="5">{t('Jirkangan')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="6">{t("Qo’rqqan")}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="7">{t('Hayratda')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="8">{t("E’tiborsiz")}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="9">{t("Kulgan")}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="11">{t('Xursand')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="12">{t('Ikkilangan')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="13">{t('Baqirgan')}</Select.Option>
                                                </SelectStyles>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="face_control_search_inline_inputs">
                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t("Ko’zoynak")}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <SelectStyles
                                                    className="left_select"
                                                    onChange={onChangeGlasses}
                                                    style={{width: "100%"}}
                                                    size="large"
                                                    defaultValue={glasses}
                                                    // value={glasses}
                                                >
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="all">{t('Hammasi')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="1">{t("Ko’rishni_tuzatish")}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="14">{t('Quyoshdan_himoya')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="10">{t('Kozoynaksiz')}</Select.Option>
                                                </SelectStyles>
                                            </div>
                                        </div>
                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Soqol')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <SelectStyles
                                                    className="left_select"
                                                    onChange={onChangeBeard}
                                                    style={{width: "100%"}}
                                                    size="large"
                                                    defaultValue={beard}
                                                    value={beard}
                                                >
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="all">{t('Hammasi')}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="2">{t("Soqolsiz")}</Select.Option>
                                                    <Select.Option
                                                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                        value="3">{t('Soqolli')}</Select.Option>
                                                </SelectStyles>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="face_control_search_inline_inputs">
                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Guruh')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                    <SelectStyles
                                                        mode="multiple"
                                                        allowClear
                                                        style={{
                                                            width: '100%',
                                                        }}
                                                        placeholder={t("Tanlash")}
                                                        onChange={onChangeGroup}
                                                        options={cameraWithGroup.map((item) =>({
                                                            value: item.id,
                                                            label: item.name
                                                        }))}
                                                    />

                                            </div>
                                        </div>
                                        <div className="form_input_wrapper">
                                            <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Kamera')}:</p>
                                            <div className="input_wrapper face_search_inputs">
                                                <SelectStyles
                                                    mode="multiple"
                                                    allowClear
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder={t("Tanlash")}
                                                    onChange={onChangeCameraOptions}
                                                    options={cameraIP.map((item)=>({
                                                        value: item.ip_address,
                                                        label: item.name
                                                    }))}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="form_input_wrapper">
                                        <p className={`input_label ${isDarkMode && 'darkModeColor'}`}>{t('Muddat')}:</p>
                                        <div className="input_wrapper">
                                            <DatePicker
                                                className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                                placeholder={`${moment(new Date()).format(
                                                    "YYYY.DD.MM, 00:00:00"
                                                )}`}
                                                onChange={onChangeDateFrom}
                                                size="large"
                                                style={{width: "100%", borderRadius: '5px'}}
                                                showTime
                                                value={dateFrom !== "" ? moment(dateFrom) : ""}
                                            />
                                        </div>
                                        <div className="input_wrapper" style={{marginTop: "5px"}}>
                                            <DatePicker
                                                className={`left_input ${isDarkMode && 'darkModeInputBackgraund'}`}
                                                placeholder={`${moment(new Date()).format(
                                                    "YYYY.DD.MM, 23:59:59"
                                                )}`}
                                                onChange={onChangeDateTo}
                                                size="large"
                                                style={{width: "100%", borderRadius: '5px'}}
                                                showTime
                                                value={dateTo !== "" ? moment(dateTo) : ""}
                                            />
                                        </div>
                                    </div>
                                </div>

                        </div>


                        <div className="form_input_wrapper add_clear_button" style={{marginBottom: 10}}>

                            <div className="input_wrapper">
                                <button
                                    type="button"
                                    className="soft_btn"
                                    onClick={() => fetchFaceControlData(1)}
                                >
                                    <AiOutlineSearch size={24} style={{marginRight: '5px'}}/>
                                    {t('Qidirish')}
                                </button>
                            </div>

                            <div className="input_wrapper">
                                <button
                                    type="button"
                                    className="clear_button"
                                    onClick={clear}
                                >
                                    <AiOutlineClear size={24} style={{marginRight: '5px'}}/>
                                    {t('Filterni tozalash')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`content_right ${isDarkMode && 'darkModeBackground darkModeBorder'} `}>
                        <div className="my_content">
                            <div className="my_cart_wrapper">
                                {
                                    faceControlData && faceControlData.map(item => (
                                        <Cart key={item.id} item={item} isDarkMode={isDarkMode}/>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
