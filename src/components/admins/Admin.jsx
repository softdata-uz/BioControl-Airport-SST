import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {MdOutlineAddCircleOutline} from "react-icons/md";
import {AiOutlineDelete} from "react-icons/ai";
import axios from "axios";
import {ip} from "../../ip";
import Modal from "react-modal";
import {message} from "antd";

import './admin.css';
import AddAdminModal from "./addAdmin/AddAdminModal";
import AdminTable from "./adminTable/AdminTable";
import AdminPagination from "./adminPagination/AdminPagination";
import './addAdmin/addTerminal.css';

const Admin = () => {

    const isDarkMode = useSelector(state => state.theme.theme_data)
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const {t} = useTranslation()

    const [isOpenAddAdmin, setIsOpenAddAdmin] = useState(false)
    const [adminPaginationLimit, setAdminPaginationLimit] = useState(15)
    const [adminPaginationCurrent, setAdminPaginationCurrent] = useState(1);
    const [adminData, setAdminData] = useState([])
    const [adminTotal, setAdminTotal] = useState(null)
    const [deleteAdmin, setDeleteAdmin] = useState([]);
    const [adminSelectionState, setAdminSelectionState] = useState({selectedRowKeys: []})
    const [deleteModalOpenAdmin, setDeleteModalOpenAdmin] = useState(false);


    const [initialValues, setInitialValues] = useState({
        lastname: '',
        firstname: '',
        fathersname: '',
        department: '',
        role: '',
        image: '',
        created_time: '',
        login: '',
        password:'',
        id: '',
        key : ''
    });

    const getAdminData = async (id) => {
        const response = await axios.get(`${ip}/api/admin/${adminPaginationLimit}/${id}`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
        const {data} = response;
        const count = data.count;
        setAdminTotal(count);
        const newData = data?.data?.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * adminPaginationLimit,
                fathersname: item.fathersname,
                lastname: item.lastname,
                firstname: item.firstname,
                role: item.role,
                login: item.login,
                image: item.image,
                department: item.department,
            }
        ))
        setAdminData(newData);
    }

    const handleDeleteAdmin = () => {
        axios.delete(`${ip}/api/delete/admin`,
            {
                data: deleteAdmin,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success("Ma'lumotlar o'chirildi", 5);
                setDeleteAdmin([]);
                setAdminSelectionState({selectedRowKeys: []});
                getAdminData(adminPaginationCurrent);
                setDeleteModalOpenAdmin(false);
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }
    const onAdminSelectChange = (selectedRowKeys, a) => {
        setAdminSelectionState({selectedRowKeys});
        setDeleteAdmin(a.map(item => item.id));
    };

    const adminRowSelection = {
        selectedRowKeys : adminSelectionState?.selectedRowKeys,
        onChange: onAdminSelectChange,
    }

    const addNewAdmin = () => {
        setIsOpenAddAdmin(true)
    }

    const deleteEmployeeAdmin = () =>{
        setDeleteModalOpenAdmin(true);
    }

    const adminPaginationOnChange = (e = 1, option) => {
        getAdminData(e)
        setAdminPaginationCurrent(e)
        setAdminPaginationLimit(option)
    }

    const cencelDeleteAdmin = () => {
        setDeleteModalOpenAdmin(false);
        setAdminSelectionState({selectedRowKeys: []});
        setDeleteAdmin([]);
    }

    useEffect(() => {
        getAdminData(adminPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminPaginationLimit, adminPaginationCurrent])

    return (
        <div className="admin_content">
            <div className='access_control_setting_header'>
                <div className="acsess_content_top">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Adminlar")}</p>
                </div>
            </div>
            <div className="admin_content_body">
                <div className='admin_content_body_item'>
                    <AddAdminModal
                        isOpenAddAdmin={isOpenAddAdmin}
                        setIsOpenAddAdmin={setIsOpenAddAdmin}
                        initialValues={initialValues}
                        setInitialValues={setInitialValues}
                        getAdminData={getAdminData}
                        adminPaginationCurrent={adminPaginationCurrent}
                    />

                    <div className='access_control_setting_tab_item_body'>
                        <AdminTable
                            isDarkMode={isDarkMode}
                            adminData={adminData}
                            rowSelection={adminRowSelection}
                            setIsOpenAddAdmin={setIsOpenAddAdmin}
                            setInitialValues={setInitialValues}
                        />
                    </div>
                    <div className='access_control_setting_tab_item_footer'>
                        <div className='access_control_setting_tab_item_footer_buttons'>
                            <button onClick={addNewAdmin} className='add_button'>
                                <MdOutlineAddCircleOutline size={24} style={{marginRight: '5px'}}/>
                                {t("Admin qo'shish")}
                            </button>

                            {
                                deleteAdmin.length > 0 &&
                                <button className="delete_button" onClick={deleteEmployeeAdmin}>
                                    <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                    {t("O’chirish")}
                                </button>
                            }
                        </div>
                        <AdminPagination
                            adminPaginationLimit={adminPaginationLimit}
                            adminPaginationCurrent={adminPaginationCurrent}
                            adminTablePaginationOnChange={adminPaginationOnChange}
                            adminTotal={adminTotal}
                        />
                    </div>
                </div>

                <div className="delete_modal_all">
                    <Modal
                        isOpen={deleteModalOpenAdmin}
                        onRequestClose={cencelDeleteAdmin}
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
                                            onClick={cencelDeleteAdmin}>{t("Yo'q")}
                                    </button>
                                </div>
                                <div>
                                    <button type="button" className="delete_modal_button_right"
                                            onClick={() => handleDeleteAdmin()}>{t("Ha")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Admin;