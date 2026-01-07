import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {DatePicker} from 'antd';
import Carousel, {consts} from 'react-elastic-carousel';
import {ip} from '../../../ip';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import moment from "moment";
import axios from 'axios';

import MiniChart from './miniCharts/index';
import BodyChart from './bodyChart/BodyChart';
import PieChart from './pieChart/PieChart';
import LineChart from './lineChart/LineChart';
import './analysis.css';


const FaceControlAnalysis = () => {

    function myArrow({type, onClick, isEdge}) {
        const pointer = type === consts.PREV ? '' : ''
        return (
            <button className="nexprev" onClick={onClick} disabled={isEdge}>
                {pointer}
            </button>
        )
    }

    const {t} = useTranslation()
    const navigate = useNavigate()
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const isDarkMode = useSelector(state => state.theme.theme_data)
    const [active, setActive] = useState('daily')
    const [date, setDate] = useState(new Date())
    const [data, setData] = useState(null)
    const [population, setPopulation] = useState(null)

    const DayMY = moment(new Date()).format('DD.MM.YYYY');

    useEffect(() => {
        axios.post(`${ip}/face-detection-service/api/face/analytics/${active}`, {
                second_date: date
            },
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
            .then((res) => {
                setData(res.data)
                setPopulation([
                    res.data.age_0_10,
                    res.data.age_11_17,
                    res.data.age_18_25,
                    res.data.age_26_40,
                    res.data.age_41_60,
                    res.data.age_61, []
                ])
            })
            .catch(err => {
            })
    }, [date, active])

    useEffect(() => {
        // if (!is_refresh_value) {
        //     return navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const topData = [
        // {
        //     title: `KIRISH "NAVRUZ BOG'I"`,
        //     mainPercent: data && data.door_1,
        //     littlePercent: '0.21%',
        //     data: data ? data.data && data.data.map(item => item.door_1) : [],
        //     category: data ? data.data && data.data.map(item => item.part): [],
        //     color: "#11d2c2"
        // },
    ]

    const colorArray = ["#11d2c2", "#000", "#29B85D", "#B12929", "#0a38c1"]
    const lang = localStorage.getItem('i18nextLng');

    data?.door.map((item, index) => topData.push({
        title_uz: `${item?.name_uz}`,
        title_ru: `${item?.name_ru}`,
        title_en: `${item?.name_en}`,
        mainPercent: item?.count,
        littlePercent: '0.21%',
        data: data ? data.data && data.data.map(item => item.door[index]) : [],
        category: data ? data.data && data.data.map(item => item.part) : [],
        color: colorArray[(index) % colorArray.length]
    }))

    const breakPoints = [
        {width: 1, itemsToShow: 1},
        {width: 500, itemsToShow: 2},
        {width: 768, itemsToShow: 3},
        {width: 1100, itemsToShow: 3},
        {width: 1500, itemsToShow: 4},
    ];

    return (
        <div className={`analysis-container ${isDarkMode && 'darkModeLayautBg'}`}>
            <div className="analysis_header">
                <div style={{marginRight: '20px'}} className="content_top">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t('Statistika')}</p>
                </div>
                <div className="buttons_analysis">
                    <div className='anaylsis-button-group'>
                        <DatePicker
                            className={` ${isDarkMode && 'darkModeInputBackgraund'}`}
                            placeholder={DayMY} onChange={value => setDate(value)}
                                    style={{borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'}}/>
                        <button onClick={() => setActive('daily')}
                                className={`${active === 'daily' ? 'analysis-active-button'
                                    : `${isDarkMode && 'darkModeBackground darkModeBorder'}`}`}>{t('Kun')}</button>
                        <button onClick={() => setActive('week')}
                                className={`${active === 'week' ? 'analysis-active-button'
                                    : `${isDarkMode && 'darkModeBackground darkModeBorder'}`}`}>{t('Hafta')}</button>
                        <button onClick={() => setActive('month')}
                                className={`${active === 'month' ? 'analysis-active-button'
                                    : `${isDarkMode && 'darkModeBackground darkModeBorder'}`}`}>{t("Oy")}</button>
                        <button onClick={() => setActive('year')}
                                className={`${active === 'year' ? 'analysis-active-button'
                                    : `${isDarkMode && 'darkModeBackground darkModeBorder'}`}`}>{t("Yil")}</button>
                    </div>
                </div>
            </div>

            <div className='analysis-top'>
                <Carousel breakPoints={breakPoints} renderArrow={myArrow} autoplay >
                    {
                        topData.map((item, index) => (
                            <div key={index}
                                 className={`analysis-top-item ${isDarkMode && 'darkModeCard darkModeBorder'}`}>

                                <div className="doors_title">
                                    <h2 className={`${isDarkMode && 'darkModeColor'}`}>{lang === 'uz' ? item.title_uz : lang === 'ru' ? item.title_ru : item.title_en}</h2>
                                </div>

                                <div className='analysis-top-item-text'>
                                    <p className={`${isDarkMode && 'darkModeColor'}`}>{item.mainPercent}</p>
                                    <p style={{opacity: 0}}>{item.littlePercent}</p>
                                </div>
                                <div>
                                    <MiniChart data={item}/>
                                </div>
                            </div>
                        ))
                    }
                </Carousel>
            </div>

            <div className={`analysis-body ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                <div className='analysis-body-text-block'>
                    <h2 className={`analysis-body-title ${isDarkMode && 'darkModeColor'}`}>{t("Umumiy ma'lumot beruvchi diagramma")}</h2>
                    <p className={`${isDarkMode && 'darkModeColor'}`}>{t("Jami odamlar soni")}
                        : <i className={`${isDarkMode && 'darkModeColor'}`}>{data ? data.human_count : 0}</i>
                    </p>
                </div>
                <div className='analysis-body-chart-block'>
                    <BodyChart data={data}/>
                </div>
            </div>


            <div className='analysis-footer'>
                <div className={`analysis-footer-left ${isDarkMode && 'darkModeCard '}`}>
                    <h2 className={`analysis-footer-title ${isDarkMode && 'darkModeColor'}`}
                        style={{marginBottom: '20px'}}>{t("Yosh bo'yicha ko'rsatkichlar")}</h2>
                    <PieChart data={population}/>
                </div>

                <div className={`analysis-footer-right ${isDarkMode && 'darkModeCard '}`}>
                    <div className="gender_top">
                        <h2 className={` ${isDarkMode && 'darkModeColor'}`}>{t("Jins bo'yicha ko'rsatkichlar")}</h2>
                        <div className="man_woman">
                            <div className="manWoman">
                                <div className="man_square"></div>
                                <p className={` ${isDarkMode && 'darkModeColor'}`}>{t("Erkaklar")} -</p>
                                <div className={`gender_count ${isDarkMode && 'darkModeColor'}`}>
                                    {data && data.male_count}
                                </div>
                            </div>

                            <div className="manWoman">
                                <div className="woman_square"></div>
                                <p className={` ${isDarkMode && 'darkModeColor'}`}>{t("Ayollar")} -</p>
                                <div className={`gender_count ${isDarkMode && 'darkModeColor'}`}>
                                    {data && data.female_count}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='analysis_footer_lineChart'>
                        <LineChart data={data}/>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default FaceControlAnalysis
