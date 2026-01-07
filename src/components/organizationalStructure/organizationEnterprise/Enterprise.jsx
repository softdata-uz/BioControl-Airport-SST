import React, {useEffect, useState} from 'react';

import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiOutlineSearch, AiOutlineCaretDown} from 'react-icons/ai';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {IoMdAddCircleOutline, IoMdAddCircle} from 'react-icons/io';
import EnterpriseTable from "./enterpriseTable/EnterpriseTable";
import EnterprisePagination from "./enterprisePagination/EnterprisePagination";

import './enterprise.css';
import EnterpriseAdd from "./addModal/EnterpriseAdd";
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment";
import {message} from "antd";
import Modal from "react-modal";

const Enterprise = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [isOpenEnterprise, setIsOpenEnterprise] = useState(false);

    const [enterprisePaginationLimit, setEnterprisePaginationLimit] = useState(10)
    const [enterprisePaginationCurrent, setEnterprisePaginationCurrent] = useState(1);
    const [enterpriseTotal, setEnterpriseTotal] = useState(null);

    const enterprisePaginationOnChange = (e = 1, option) => {
        getEnterpriseData(e)
        setEnterprisePaginationCurrent(e)
        setEnterprisePaginationLimit(option)
    }

    const [deleteEnterprise, setDeleteEnterprise] = useState([])
    const [enterpriseSelectionState, setEnterpriseSelectionState] = useState({selectedRowKeys: []})
    const [enterprise, setEnterprise] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setEnterprise({selectedRowKeys})
        setDeleteEnterprise(a.map(item => item.id));
    };

    const {selectedRowKeys} = enterprise;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const [initialValues , setInitialValues] = useState({
        date_of_birth: '',
        director_fullname: '',
        email: '',
        full_name: '',
        short_name: '',
        status: '',
        tel: '',
        user_id:'',
        address:''
    })
    const [searchedData, setSearchedData] = useState('');
    const [enterpriseData, setEnterpriseData] = useState([])
    const getEnterpriseData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/company/${enterprisePaginationLimit}/${id}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
        const {data} = response;
        const count = data.count;
        setEnterpriseTotal(count);
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * enterprisePaginationLimit,
                created_time: moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss'),
                date_of_birth: moment(item.date_of_birth),
                director_fullname: item.director_fullname,
                email: item.email,
                id: item.id,
                full_name: item.full_name,
                short_name: item.short_name,
                status: item.status,
                tel: item.tel,
                user_id : item.user_id,
                address:''
            }
        ))
        setEnterpriseData(newData)
    }



    useEffect(() => {
        getEnterpriseData(enterprisePaginationCurrent);
    }, [enterprisePaginationLimit, enterprisePaginationCurrent, searchedData]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeleteEnterprise([]);
        setEnterpriseSelectionState({selectedRowKeys: []});
        setEnterprise({selectedRowKeys: []});
    }

    const handleDeleteEnterprise = () => {
        axios.delete(`${ip}/access-control-service/api/delete/company`,
            {
                data: deleteEnterprise,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success(t("Ma'lumotlar o'chirildi"), 5);
                setDeleteEnterprise([]);
                setEnterpriseSelectionState({selectedRowKeys : []});
                setEnterprise({selectedRowKeys : []});
                setDeleteModalOpen(false);
                getEnterpriseData(enterprisePaginationCurrent);
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }




    return (
        <div className="enterprise">
            <div className="enterprise_header">
                <div className="enterprise_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Tashkilot tuzilmasi / Tashkilot (korxona)")}
                    </p>
                </div>
            </div>
            <div className="enterprise_body">
                <div className="enterprise_body_title">
                    <div className="enterprise_body_title_search">
                        <AiOutlineSearch/>
                        <input placeholder={t("Izlash")}
                               onChange={(e) => {
                                   setEnterprisePaginationCurrent(1);
                                   setSearchedData(e.currentTarget.value);
                               }}
                        />
                    </div>

                    <div className="enterprise_body_title_right">
                        {deleteEnterprise.length > 0 &&
                            <div className="enterprise_body_title_right_delete" onClick={() => setDeleteModalOpen(true)}>
                                <RiDeleteBin6Line size={"18px"}/><span>{t('O‘chirish')}</span>
                            </div>}
                        <div className="enterprise_body_title_right_add" onClick={() => setIsOpenEnterprise(true)}>
                            <IoMdAddCircle size={"18px"}/><span>{t('Yangi qo\'shish')}</span>
                        </div>
                    </div>
                </div>

                <div className="enterprise_body_table">
                    <div className="enterprise_body_table_inner">
                        <EnterpriseTable
                            rowSelection={rowSelection}
                            enterpriseData={enterpriseData}
                            setInitialValues={setInitialValues}
                            setIsOpenEnterprise={setIsOpenEnterprise}
                            setDeleteEnterprise={setDeleteEnterprise}
                            setDeleteModalOpen={setDeleteModalOpen}
                        />
                    </div>

                    <div className="enterprise_body_table_pagination">
                        <EnterprisePagination
                            enterprisePaginationLimit={enterprisePaginationLimit}
                            enterprisePaginationCurrent={enterprisePaginationCurrent}
                            enterprisePaginationOnChange={enterprisePaginationOnChange}
                            enterpriseTotal={enterpriseTotal}
                        />
                    </div>
                </div>
            </div>
            <EnterpriseAdd
                isOpenEnterprise={isOpenEnterprise}
                setIsOpenEnterprise={setIsOpenEnterprise}
                getEnterpriseData={getEnterpriseData}
                enterprisePaginationCurrent={enterprisePaginationCurrent}
                initialValues={initialValues}
                setInitialValues={setInitialValues}
            />
            <div className="delete_modal_all">
                <Modal
                    isOpen={deleteModalOpen}
                    onRequestClose={cencelDelete}
                    contentLabel="My dialog"
                    className="mymodal"
                    overlayClassName="myoverlay"
                    closeTimeoutMS={0}
                >
                    <div className="delete_modal">
                        <h3>{t("Haqiqatdan ham o'chirasizmi ?")}</h3>
                        <div className="delete_modal_button">
                            <div className="">
                                <button type="button" className="delete_modal_button_left"
                                        onClick={cencelDelete}>{t("Yo'q")}
                                </button>
                            </div>
                            <div>
                                <button type="button" className="delete_modal_button_right"
                                        onClick={() => handleDeleteEnterprise()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Enterprise;