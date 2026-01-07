import React, {useEffect, useState} from 'react';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import allWorkers from '../../../images/metroBiocontrol/allWorkers.svg';
import mans from '../../../images/metroBiocontrol/mans.svg';
import woman from '../../../images/metroBiocontrol/woman.svg';
import airplain from '../../../images/metroBiocontrol/airplain.svg';
import xizmatdagi from '../../../images/metroBiocontrol/xizmatsafar.svg';
import man from '../../../images/metroBiocontrol/man.svg';

import './accessDashboard.css';
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";


const AccessDashboard = () => {

    const isDarkMode = useSelector(state => state.theme.theme_data)
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const {t} = useTranslation()



    const [dashData, setDashData]= useState()

    const getDashData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/terminal/dashboard`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })

        setDashData(response?.data)
    }

    // console.log(dashData)

    useEffect(() => {
        getDashData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="info_content">
                <div className='access_control_setting_header'>
                    <div className="acsess_content_top">
                        <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Dashboard")}</p>
                    </div>
                </div>
                <div className="dashboard_info_content">
                    <div className="dashboard_top_items">
                        <div className="dashboard_top_items_inner">
                            <div className="dashboard_top_inner_img">
                                <img src={allWorkers} alt=""/>
                            </div>
                            <div className="dashboard_top_inner_info">
                                <p>Umumiy xodimlar soni</p>
                                <h4>{dashData?.all_count}</h4>
                            </div>
                        </div>
                        <div className="dashboard_top_items_inner">
                            <div className="dashboard_top_inner_img">
                                <img src={mans} alt=""/>
                            </div>
                            <div className="dashboard_top_inner_info">
                                <p>Erkak xodimlar</p>
                                <h4>{dashData?.male_count}</h4>
                            </div>
                        </div>
                        <div className="dashboard_top_items_inner">
                            <div className="dashboard_top_inner_img">
                                <img src={woman} alt=""/>
                            </div>
                            <div className="dashboard_top_inner_info">
                                <p>Ayol xodimlar</p>
                                <h4>{dashData?.female_count}</h4>
                            </div>
                        </div>
                        <div className="dashboard_top_items_inner">
                            <div className="dashboard_top_inner_img">
                                <img src={airplain} alt=""/>
                            </div>
                            <div className="dashboard_top_inner_info">
                                <p>Mehnat ta'tilidagilar</p>
                                <h4>{dashData?.labour_holiday_staff_count}</h4>
                            </div>
                        </div>
                        <div className="dashboard_top_items_inner">
                            <div className="dashboard_top_inner_img">
                                <img src={xizmatdagi} alt=""/>
                            </div>
                            <div className="dashboard_top_inner_info">
                                <p>Xizmat safaridagilar</p>
                                <h4>{dashData?.service_trip_staff_count}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard_top_items_bottom">
                        <div className="dashboard_info_content_right"></div>
                        <div className="dashboard_info_content_left">
                            <div className="dashboard_left">
                                <div className="dashboard_left_items">
                                    <div className="dashboard_left_top_title">
                                        <div className="title_vertcal_line"></div>
                                        <div className="dashboard_left_title">
                                            Tibbiy ko‘rik muddati yaqin
                                        </div>
                                    </div>

                                    <div className="dashboard_left_cards">
                                        <div className="dashboard_card_left">
                                            <div className="dashboard_card_left_inner">
                                                <img src={man} alt=""/>
                                                <div className="card_left_inner_user_info">
                                                    <h4>Istamov Xurshid Hazratqul o‘g‘li</h4>
                                                    <div className="card_left_inner_user_position">
                                                        <span>Lavozim:</span>
                                                        Yetakchi mutaxassis
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dashboard_card_right">
                                            <CircularProgressbar
                                                value={80} text={`${8}`}
                                                styles={buildStyles({
                                                    textSize: '16px',
                                                    textColor: '#000',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#EB4143',
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div className="dashboard_left_cards">
                                        <div className="dashboard_card_left">
                                            <div className="dashboard_card_left_inner">
                                                <img src={man} alt=""/>
                                                <div className="card_left_inner_user_info">
                                                    <h4>Istamov Xurshid Hazratqul o‘g‘li</h4>
                                                    <div className="card_left_inner_user_position">
                                                        <span>Lavozim:</span>
                                                        Yetakchi mutaxassis
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dashboard_card_right">
                                            <CircularProgressbar
                                                value={80} text={`${8}`}
                                                styles={buildStyles({
                                                    textSize: '16px',
                                                    textColor: '#000',
                                                    trailColor: '#d6d6d6',
                                                    backgroundColor: '#EB4143',
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="more_wiev_button">
                                    <button>Ko‘proq ko‘rish</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDashboard;