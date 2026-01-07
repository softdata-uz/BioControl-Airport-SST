import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {AiFillCloseCircle} from 'react-icons/ai';
import {BiSearch} from "react-icons/bi";
import {ip} from "../../../ip";

import axios from "axios";

import Modal from "react-modal";

import './modalAddEmployee.css';

import {MdAddCircle} from "react-icons/md";
import ModalAddEmployeeTable from "../modalAddEmployee/modalAddEmployeeTable/ModalAddEmployeeTable";
import ModalAddEmployeePagination from "../modalAddEmployee/modalAddEmployeePagination/ModalAddEmployeePagination";

const ModalAddEmployee = (props) => {
    const {
        isOpenModalAddEmployee,
        setIsOpenModalAddEmployee,
        modalAddEmployeesData,
        setModalAddEmployeesData,
        hiringInitialValues,
        setHiringInitialValues,

    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);


    const [modalEmployeePaginationLimit, setModalEmployeePaginationLimit] = useState(12)
    const [modalEmployeePaginationCurrent, setModalEmployeePaginationCurrent] = useState(1);
    const [modalEmployeeTotal, setModalEmployeeTotal] = useState(null);
    const [searchedData, setSearchedData] = useState('');






    const getModalEmployeeData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/terminal/userslist/${modalEmployeePaginationLimit}/${id}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const count = data && data.count;
        setModalEmployeeTotal(count);
        const newData = data && data.data && data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * modalEmployeePaginationLimit,
                id: item.id,
                fullname: item.fullname,
                rank: item.rank
            }
        ))
        // setData(newData)
        setModalAddEmployeesData(newData)
    }

    const modalEmployeePaginationOnChange = (e = 1, option) => {
        getModalEmployeeData(e)
        setModalEmployeePaginationCurrent(e)
        setModalEmployeePaginationLimit(option)
    }

    useEffect(() => {
        getModalEmployeeData(modalEmployeePaginationCurrent)
    }, [modalEmployeePaginationLimit, modalEmployeePaginationCurrent , isOpenModalAddEmployee]);


    const onChangeInput = (e) => {
        setModalEmployeePaginationCurrent(1);
        setSearchedData(e.currentTarget.value);
    }

    const searchData = () => {
        getModalEmployeeData(modalEmployeePaginationCurrent)
    }

    const cencel = () =>{
        setIsOpenModalAddEmployee(!isOpenModalAddEmployee);
        setSearchedData('');
    }

    return (
        <Modal
            isOpen={isOpenModalAddEmployee}
            onRequestClose={cencel}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="modal_add_employee">
                <div className="modal_add_employee_header">
                    <div className="modal_add_employee_header_left">
                        <span>{t("Xodimlar")}</span>
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
                            modalAddEmployeesData={modalAddEmployeesData}
                            hiringInitialValues={hiringInitialValues}
                            setHiringInitialValues={setHiringInitialValues}
                            setIsOpenModalAddEmployee={setIsOpenModalAddEmployee}
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