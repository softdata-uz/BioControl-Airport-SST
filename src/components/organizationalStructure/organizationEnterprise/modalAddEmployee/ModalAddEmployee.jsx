import React, {useEffect, useState} from 'react';
import Modal from "react-modal";

import './modalAddEmployee.css';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiFillCloseCircle} from 'react-icons/ai';
import {BiSearch} from "react-icons/bi";
import {MdAddCircle} from "react-icons/md";
import ModalAddEmployeeTable from "./modalAddEmployeeTable/ModalAddEmployeeTable";
import ModalAddEmployeePagination from "./modalAddEmployeePagination/ModalAddEmployeePagination";
import axios from "axios";
import {ip} from "../../../../ip";

const ModalAddEmployee = (props) => {
    const {
        modalAddEmployee,
        setModalAddEmployee,
        setUserId
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [modalEmployeePaginationLimit, setModalEmployeePaginationLimit] = useState(12)
    const [modalEmployeePaginationCurrent, setModalEmployeePaginationCurrent] = useState(1);
    const [modalEmployeeTotal, setModalEmployeeTotal] = useState(null);

    const modalEmployeePaginationOnChange = (e = 1, option) => {
        getModalEmployeeData(e)
        setModalEmployeePaginationCurrent(e)
        setModalEmployeePaginationLimit(option)
    }

    const [deleteModalEmployee, setDeleteModalEmployee] = useState([])
    const [modalEmployeeSelectionState, setModalEmployeeSelectionState] = useState({selectedRowKeys: []})

    const [modalEmployee, setModalEmployee] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setModalEmployee({selectedRowKeys})
        setDeleteModalEmployee(a.map(item => item.id));
    };

    const {selectedRowKeys} = modalEmployee;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const [data, setData] = useState([]);
    const [searchedData, setSearchedData] = useState('');

    const getModalEmployeeData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/terminal/userslist/${modalEmployeePaginationLimit}/${id}`,
            {
                params: {
                    searched_data: searchedData,
                    rank: 2
                },
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const count = data && data.count;
        setModalEmployeeTotal(count);
        // console.log(response)
        const newData = data && data.data && data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * modalEmployeePaginationLimit,
                id: item.id,
                fullname: item.fullname,
                rank: item.rank
            }
        ))
        setData(newData)
    }

    useEffect(() => {
        getModalEmployeeData(modalEmployeePaginationCurrent)
    }, [modalEmployeePaginationLimit, modalEmployeePaginationCurrent, modalAddEmployee]);


    const onChangeInput = (e) => {
        setModalEmployeePaginationCurrent(1);
        setSearchedData(e.currentTarget.value);
    }

    const searchData = () => {
        getModalEmployeeData(modalEmployeePaginationCurrent)
    }

    const cencel = () => {
        setModalAddEmployee(!modalAddEmployee);
        setSearchedData('');
    }


    return (
        <Modal
            isOpen={modalAddEmployee}
            onRequestClose={cencel}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="modal_add_employee">
                <div className="modal_add_employee_header">
                    <div className="modal_add_employee_header_left">
                        <span>{t("Rahbarlar")}</span>
                        <div className="modal_add_employee_header_left_total">{modalEmployeeTotal}</div>
                    </div>
                    <div style={{cursor: "pointer"}} onClick={cencel}><AiFillCloseCircle
                        size={"20px"}/></div>
                </div>
                <div className="modal_add_employee_line"></div>
                <div className="modal_add_employee_search">
                    <div className="modal_add_employee_search_left">
                        <BiSearch size={"20px"}/>
                        <input placeholder={t("Izlash")} onChange={onChangeInput}/>
                    </div>
                    <div className="modal_add_employee_search_right" onClick={searchData}>
                        {/*<MdAddCircle size={"20px"}/>*/}
                        <span>{t("Qidirish")}</span>
                    </div>
                </div>
                {/*<div className="modal_add_employee_management">*/}
                {/*    <div className="modal_add_employee_management_inner">{t("Rahbariyat")}</div>*/}
                {/*</div>*/}
                <div className="modal_add_employee_body">
                    <div className="modal_add_employee_body_table">
                        <ModalAddEmployeeTable
                            data={data}
                            rowSelection={rowSelection}
                            setUserId={setUserId}
                            setModalAddEmployee={setModalAddEmployee}
                        />
                    </div>
                    <div className="modal_add_employee_body_pagination">
                        <ModalAddEmployeePagination
                            modalEmployeePaginationLimit={modalEmployeePaginationLimit}
                            modalEmployeePaginationCurrent={modalEmployeePaginationCurrent}
                            modalEmployeeTotal={modalEmployeeTotal}
                            modalEmployeePaginationOnChange={modalEmployeePaginationOnChange}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddEmployee;