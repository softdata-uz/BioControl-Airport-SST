import React, {useEffect, useState} from 'react';

import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiOutlineSearch, AiOutlineCaretDown} from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdAddCircle} from 'react-icons/io';
import NetworkTable from "./networkTable/NetworkTable";
import NetworkPagination from "./networkPagination/NetworkPagination";
import {RiDeleteBin6Line} from 'react-icons/ri';

import './departmentNetwork.css';
import NetworkAdd from "./addModal/NetworkAdd";
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment";
import {message} from "antd";
import Modal from "react-modal";

const DepartmentNetwork = () => {
    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);
    const [isOpennetwork , setIsOpennetwork] = useState(false);
    const [networkPaginationLimit, setnetworkPaginationLimit] = useState(10)
    const [networkPaginationCurrent, setnetworkPaginationCurrent] = useState(1);
    const [networkTotal, setnetworkTotal] = useState(null);
    const networkPaginationOnChange = (e = 1, option) => {
        getNetworkData(e)
        setnetworkPaginationCurrent(e)
        setnetworkPaginationLimit(option)
    }
    const [deletenetwork, setDeletenetwork] = useState([])
    const [networkSelectionState, setnetworkSelectionState] = useState({selectedRowKeys: []})
    const [network, setnetwork] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setnetwork({selectedRowKeys})
        setDeletenetwork(a.map(item => item.id));
    };
    const {selectedRowKeys} = network;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    const [initialValuesNetwork , setInitialValuesNetwork] = useState({
        full_name: '',
        short_name: '',
        status: '',
        company_id: '',
        manager_fullname:'',
        user_id : '',
        // sign: ''
    });
    const [searchedDataNetwork, setSearchedDataNetwork] = useState('');
    const [networkData, setNetworkData] = useState([])
    const getNetworkData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/department/${networkPaginationLimit}/${id}`,
            {
                params: {searched_data: searchedDataNetwork},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
        const {data} = response;
        const count = data.count;
        setnetworkTotal(count)
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * networkPaginationLimit,
                created_time: moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss'),
                short_name: item.short_name,
                company:item.company,
                company_id:item.company_id,
                full_name:item.full_name,
                status:item.status,
                id:item.id,
                manager_fullname:item.manager_fullname,
                user_id : item.user_id,
                // sign: item.sign
            }
        ))
        setNetworkData(newData);
    }
    // console.log(networkData)
    useEffect(() => {
        getNetworkData(networkPaginationCurrent);
    }, [networkPaginationLimit, networkPaginationCurrent, searchedDataNetwork]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeletenetwork([]);
        setnetworkSelectionState({selectedRowKeys: []});
        setnetwork({selectedRowKeys: []});
    }
    const handleDeleteNetwork = () => {
        axios.delete(`${ip}/access-control-service/api/delete/department`,
            {
                data: deletenetwork,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success(t("Ma'lumotlar o'chirildi"), 5);
                setDeletenetwork([]);
                setnetworkSelectionState({selectedRowKeys : []});
                setnetwork({selectedRowKeys : []});
                setDeleteModalOpen(false);
                getNetworkData(networkPaginationCurrent);
            })
            .catch(err => {

            })
    }

    return (
        <div className="network">
            <div className="network_header">
                <div className="network_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Tashkilot tuzilmasi / Bo‘lim")}
                    </p>
                </div>
            </div>
                <div className="network_body">
                    <div className="network_body_title">
                        <div className="network_body_title_search">
                            <AiOutlineSearch/>
                            <input placeholder={t("Izlash")}
                                   onChange={(e) => {
                                       setnetworkPaginationCurrent(1);
                                       setSearchedDataNetwork(e.currentTarget.value);
                                   }}
                            />
                        </div>

                        <div className="network_body_title_right">
                            {deletenetwork.length > 0 &&
                            <div className="network_body_title_right_delete" onClick={() => setDeleteModalOpen(true)}>
                                <RiDeleteBin6Line size={"18px"}/><span>{t('O‘chirish')}</span>
                            </div>}
                            <div className="network_body_title_right_add" onClick={() => setIsOpennetwork(true)}>
                                <IoMdAddCircle size={"18px"}/><span>{t('Yangi qo\'shish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="network_body_table">
                        <div className="network_body_table_inner">
                            <NetworkTable
                                rowSelection={rowSelection}
                                networkData={networkData}
                                setInitialValuesNetwork={setInitialValuesNetwork}
                                setIsOpennetwork={setIsOpennetwork}
                            />
                        </div>

                        <div className="network_body_table_pagination">
                            <NetworkPagination
                                networkPaginationLimit={networkPaginationLimit}
                                networkPaginationCurrent={networkPaginationCurrent}
                                networkPaginationOnChange={networkPaginationOnChange}
                                networkTotal={networkTotal}
                            />
                        </div>
                    </div>
                </div>
            <NetworkAdd
                isOpennetwork={isOpennetwork}
                setIsOpennetwork={setIsOpennetwork}
                initialValuesNetwork={initialValuesNetwork}
                setInitialValuesNetwork={setInitialValuesNetwork}
                networkPaginationCurrent={networkPaginationCurrent}
                getNetworkData={getNetworkData}
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
                                        onClick={() => handleDeleteNetwork()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
        </div>
        </div>
    );
};

export default DepartmentNetwork;