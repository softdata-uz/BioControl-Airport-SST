import React, {useEffect, useState} from 'react';

import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiOutlineSearch, AiOutlineCaretDown} from 'react-icons/ai';
import {IoMdAddCircleOutline, IoMdAddCircle} from 'react-icons/io';
import NetworkTable from "./networkTable/NetworkTable";
import NetworkPagination from "./networkPagination/NetworkPagination";
import {RiDeleteBin6Line} from 'react-icons/ri';

import NetworkAdd from "./addModal/NetworkAdd";
import axios from "axios";
import {ip} from "../../../ip";
import moment from "moment";
import {message} from "antd";
import './network.css';
import Modal from "react-modal";



const Network = () => {

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [isOpencategory , setIsOpencategory] = useState(false);

    const [categoryPaginationLimit, setcategoryPaginationLimit] = useState(10)
    const [categoryPaginationCurrent, setcategoryPaginationCurrent] = useState(1);
    const [categoryTotal, setcategoryTotal] = useState(null);

    const categoryPaginationOnChange = (e = 1, option) => {
        getCategoryData(e)
        setcategoryPaginationCurrent(e)
        setcategoryPaginationLimit(option)
    }
    
    const [deletecategory, setDeletecategory] = useState([])
    const [categorySelectionState, setcategorySelectionState] = useState({selectedRowKeys: []})

    const [category, setcategory] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setcategory({selectedRowKeys})
        setDeletecategory(a.map(item => item.id));
    };

    const {selectedRowKeys} = category;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const [changePage , setChangePage] = useState("category");

    const [initialValuesCategory , setInitialValuesCategory] = useState({
        full_name: '',
        short_name: '',
        status: '',
        department_id: ''
    })
    const [searchedDataCategory, setSearchedDataCategory] = useState('');
    const [categoryData, setCategoryData] = useState([])
    const getCategoryData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/section_area/${categoryPaginationLimit}/${id}`,
            {
                params: {searched_data: searchedDataCategory},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
        const {data} = response;
        const count = data.count;
        setcategoryTotal(count)
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * categoryPaginationLimit,
                created_time: moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss'),
                short_name: item.short_name,
                full_name:item.full_name,
                status:item.status,
                department:item.department,
                department_id:item.department_id,
                id:item.id
            }
        ))
        setCategoryData(newData);
    }
    // console.log(categoryData)
    useEffect(() => {
        getCategoryData(categoryPaginationCurrent);
    }, [categoryPaginationLimit, categoryPaginationCurrent, searchedDataCategory]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setDeletecategory([]);
        setcategorySelectionState({selectedRowKeys: []});
        setcategory({selectedRowKeys: []});
    }
    const handleDeleteCategory = () => {
        axios.delete(`${ip}/access-control-service/api/delete/section_area`,
            {
                data: deletecategory,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success(t("Ma'lumotlar o'chirildi"), 5);
                setDeletecategory([]);
                setcategorySelectionState({selectedRowKeys : []});
                setcategory({selectedRowKeys : []});
                setDeleteModalOpen(false);
                getCategoryData(categoryPaginationCurrent);
            })
            .catch(err => {

            })
    }


    return (
        <div className="category">
            <div className="category_header">
                <div className="category_header_title">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("Tashkilot tuzilmasi / Tarmoq")}
                    </p>
                </div>
            </div>
                <div className="category_body">
                    <div className="category_body_title">
                        <div className="category_body_title_left">
                            <div className="category_body_title_search">
                                <AiOutlineSearch/>
                                <input placeholder={t("Izlash")}
                                       onChange={(e) => {
                                           setcategoryPaginationCurrent(1);
                                           setSearchedDataCategory(e.currentTarget.value);
                                       }}
                                />
                            </div>

                        </div>

                        <div className="category_body_title_right">
                            {deletecategory.length > 0 &&
                            <div className="category_body_title_right_delete" onClick={() => setDeleteModalOpen(true)}>
                                <RiDeleteBin6Line size={"18px"}/><span>{t('O‘chirish')}</span>
                            </div>}
                            <div className="category_body_title_right_add" onClick={() => setIsOpencategory(true)}>
                                <IoMdAddCircle size={"18px"}/><span>{t('Yangi qo\'shish')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="category_body_table">
                        <div className="category_body_table_inner">
                            <NetworkTable
                                rowSelection={rowSelection}
                                categoryData={categoryData}
                                setInitialValuesCategory={setInitialValuesCategory}
                                setIsOpencategory={setIsOpencategory}
                            />
                        </div>

                        <div className="category_body_table_pagination">
                            <NetworkPagination
                                categoryPaginationLimit={categoryPaginationLimit}
                                categoryPaginationCurrent={categoryPaginationCurrent}
                                categoryPaginationOnChange={categoryPaginationOnChange}
                                categoryTotal={categoryTotal}
                            />
                        </div>
                    </div>
                </div>
            <NetworkAdd
                isOpencategory={isOpencategory}
                setIsOpencategory={setIsOpencategory}
                initialValuesCategory={initialValuesCategory}
                setInitialValuesCategory={setInitialValuesCategory}
                categoryPaginationCurrent={categoryPaginationCurrent}
                getCategoryData={getCategoryData}
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
                                        onClick={() => handleDeleteCategory()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Network;