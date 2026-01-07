import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ip} from "../../../ip";
import axios from "axios";
import moment from "moment";
import 'antd/dist/antd.css';
import filter from '../../../images/parkingModul/tabler-icon-adjustments-horizontal.png';
import exel from '../../../images/exel.svg';
import pdf from '../../../images/pdf.svg';
import ReportPagination from "./ReportPagination";
import FilterModal from "./FilterModal/FilterModal";
import FilterModalNew from "./FilterModal/FilterModalNew";
import './report.css';
import ReportTable from "./ReportTable";
import TerminalImgModal from "./terminalEnterExit/TerminalImgModal";
import TerminalImgExitModal from "./terminalEnterExit/TerminalImgExitModal";
import {IoSearch} from "react-icons/io5";


const Report = () => {

    const isDarkMode = useSelector(state => state.theme.theme_data);
    const {t} = useTranslation();

    const [reportData, setReportData] = useState();

    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [isOpenEnterImg, setIsOpenEnterImg] = useState(null)
    const [isOpenExitImg, setIsOpenExitImg] = useState(null);

    const [reportTotal, setReportTotal] = useState(null);
    const [reportPaginationLimit, setReportPaginationLimit] = useState(11);
    const [reportPaginationCurrent, setReportPaginationCurrent] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [filterInitialValue, setFilterInitialValue] = useState({
        fullname: '',
        group_id: '',
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
    })
    const [homeName, setHomeName] = useState(false);
    const getReportData = async (paramsObj) => {
        const response = await axios.post(`${ip}/access-control-service/api/history-log/${reportPaginationLimit}/${reportPaginationCurrent}`,
            paramsObj,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        );
        const {data} = response;
        const count = data.count;
        setReportTotal(count);
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * reportPaginationLimit,
                department: item.department,
                entering_door: item.entering_door,
                entering_time: item.entering_time,
                exiting_door: item.exiting_door,
                exiting_time: item.exiting_time,
                fullname: item.fullname,
                group_name_en: item.group_name_en,
                group_name_ru: item.group_name_ru,
                group_name_uz: item.group_name_uz,
                image: item.image,
                is_at_work: item.is_at_work,
                is_early_go: item.is_early_go,
                is_late: item.is_late,
                rank: item.rank,
                report_date: item.report_date
            }
        ))
        setReportData(newData);
    }


    const getReport = (type, paramsObj) => {
        axios.get(`${ip}/access-control-service/api/report/${type}`,
            {
                params: {filter: JSON.stringify(paramsObj)},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
            .then((res) => {
                setLoading(false);
                setLoadingPdf(false);
            })
    }

    const reportPaginationOnchange = (e = 1, option) => {
        setReportPaginationCurrent(e)
        setReportPaginationLimit(option)
    }

    useEffect(() => {
        getReportData(filterInitialValue);
    }, [
        reportPaginationLimit,
        reportPaginationCurrent,
        homeName,
        filterInitialValue.fullname,
        filterInitialValue.order_type,
        filterInitialValue.order_column,
    ]);

    const handlclicFilter = () => {
        setIsOpenFilter(true);
    }

    // for search input
    const [searchTerm, setSearchTerm] = useState('');

    let searchTimeout;

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        // Clear any existing search timeout
        clearTimeout(searchTimeout);

        // Set a new search timeout of 500ms
        searchTimeout = setTimeout(() => {
            performSearch(value);
        }, 1000);
    };

    const performSearch = (value) => {
        setFilterInitialValue({
            ...filterInitialValue,
            fullname: value
        });
        setReportPaginationCurrent(1);
    };
    // for search input



    // excel pdf example

    const downloadReportExcel = async () => {
        try {
            const response = await axios.post(
                `${ip}/access-control-service/api/report/excel`,
                filterInitialValue,
                {
                    headers: {'x-access-token': localStorage.getItem('soft-ais-token'),},
                    responseType: 'blob', // Important for handling binary data
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading the report:', error);
        }
    };

    const downloadReport = async () => {
        axios.post(`${ip}/access-control-service/api/report/pdf`,
            filterInitialValue,
            {
                headers: { 'x-access-token': localStorage.getItem('soft-ais-token')},
                responseType: 'blob'
            }
        )
            .then((res) => {
                const blob = new Blob([res.data], { type: 'application/pdf' });
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

    // excel pdf example


    return (
        <>
            <div className={`reportControl ${isDarkMode && 'darkModeLayautBg '}`}>
                <div className="report_content_top">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t('Hisobot')}
                    </p>

                    <div className='report_content_top_right'>
                        <div className={`report_content_top_search  ${isDarkMode && 'darkModeInputBackgraund'}`}>
                            <IoSearch className={`${isDarkMode && 'darkModeColor'}`}/>
                            <input
                                className={` ${isDarkMode && 'darkModeInputBackgraund'}`}
                                onChange={handleSearch}
                                value={searchTerm}
                                type={"text"}
                                placeholder={t('Izlash')}
                            />
                        </div>

                        <div onClick={handlclicFilter} className={`report_content_top_filter ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>
                            <img className={`${isDarkMode && 'filter_icon'} `} src={filter}/>
                            <p className={`${isDarkMode && ' darkModeColor '}`}>{t('Filterlash')}</p>
                        </div>

                        <div className="download_buttons">

                            <button
                                onClick={downloadReportExcel}
                                className={`download_btn ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>
                                <div className="downloadLink_excel_pdf">
                                    <img src={exel} />
                                    {t('Yuklash')}
                                </div>
                            </button>

                            <button
                                onClick={downloadReport}
                                className={`download_btn_pdf ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>
                                <div className="downloadLink_excel_pdf">
                                    <img src={pdf} />
                                    {t('Yuklash')}
                                </div>
                            </button>

                            {/*<a className="downloadLink"*/}
                            {/*   href={`${ip}/access-control-service/api/report/excel?filter=${JSON.stringify(filterInitialValue)}`}>*/}
                            {/*    <button onClick={() => getReport('excel', filterInitialValue)}*/}
                            {/*            className={`download_btn ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>*/}
                            {/*        <div className="downloadLink_excel_pdf"><img src={exel}/>{t('Yuklash')}</div>*/}
                            {/*    </button>*/}
                            {/*</a>*/}
                            {/*<a className="downloadLink"*/}
                            {/*   href={`${ip}/access-control-service/api/report/pdf?filter=${Buffer.from(JSON.stringify(filterInitialValue)).toString("base64")}`}*/}
                            {/*   target={reportTotal > 0 ? "_blank" : ""}>*/}
                            {/*    <button onClick={() => getReport('pdf', filterInitialValue)}*/}
                            {/*            className={`download_btn_pdf ${isDarkMode && 'darkModeBackground darkModeColor darkModeBorder'}`}>*/}
                            {/*        <div><img src={pdf}/>{t('Yuklash')}</div>*/}
                            {/*    </button>*/}
                            {/*</a>*/}

                        </div>
                    </div>
                </div>

                <div className={`report_content ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>
                    <div className="report_content_table">
                        {isOpenEnterImg &&
                            <TerminalImgModal
                                isOpenEnterImg={isOpenEnterImg}
                                setIsOpenEnterImg={setIsOpenEnterImg}
                            />
                        }
                        {isOpenExitImg &&
                            <TerminalImgExitModal
                                isOpenExitImg={isOpenExitImg}
                                setIsOpenExitImg={setIsOpenExitImg}
                            />
                        }
                        <ReportTable
                            reportData={reportData}
                            filterInitialValue={filterInitialValue}
                            setFilterInitialValue={setFilterInitialValue}
                            isOpenEnterImg={isOpenEnterImg}
                            setIsOpenEnterImg={setIsOpenEnterImg}
                            setIsOpenExitImg={setIsOpenExitImg}
                        />
                    </div>
                </div>

                <div className="report_content_pagination_one">
                    <div className="report_content_pagination">
                        <p className={`content_total ${isDarkMode && 'darkModeColor'}`}>{t('Jami')}: {reportTotal}</p>
                        <ReportPagination
                            reportPaginationLimit={reportPaginationLimit}
                            reportPaginationCurrent={reportPaginationCurrent}
                            reportPaginationOnchange={reportPaginationOnchange}
                            reportTotal={reportTotal}
                        />
                    </div>
                </div>

                {/*<FilterModal*/}
                {/*    isOpenFilter={isOpenFilter}*/}
                {/*    setIsOpenFilter={setIsOpenFilter}*/}
                {/*    filterInitialValue={filterInitialValue}*/}
                {/*    setFilterInitialValue={setFilterInitialValue}*/}
                {/*    reportPaginationLimit={reportPaginationLimit}*/}
                {/*    reportPaginationCurrent={reportPaginationCurrent}*/}
                {/*    setReportData={setReportData}*/}
                {/*    getReportData={getReportData}*/}
                {/*    setReportTotal={setReportTotal}*/}
                {/*    setHomeName={setHomeName}*/}
                {/*/> */}
                <FilterModalNew
                    isOpenFilter={isOpenFilter}
                    setIsOpenFilter={setIsOpenFilter}
                    filterInitialValue={filterInitialValue}
                    setFilterInitialValue={setFilterInitialValue}
                    reportPaginationLimit={reportPaginationLimit}
                    reportPaginationCurrent={reportPaginationCurrent}
                    setReportData={setReportData}
                    getReportData={getReportData}
                    setReportTotal={setReportTotal}
                    setHomeName={setHomeName}
                />
            </div>
        </>

    );
};

export default Report;