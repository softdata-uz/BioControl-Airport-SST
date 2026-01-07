import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Tabs, message, Form, Select} from 'antd';
import {MdOutlineAddCircleOutline} from 'react-icons/md';
import {AiOutlineDelete} from 'react-icons/ai';
import {ip} from '../../../ip';
import {useTranslation} from "react-i18next";
import axios from "axios";
import moment from 'moment';

import TerminalTable from './table/TerminalTable'
import StaffTable from './table/StaffTable'
import TerminalPagination from './paginations/TerminalPagination';
import StaffPagination from './paginations/StaffPagination';
import AddStaff from '../modals/add-staff/AddStaff';
import AddTerminalModal from "./Terminal-modal/AddTerminalModal";
import {connect} from "react-redux";
import {getTheme} from "../../../redux";
import AddNewGroupTable from "../AddNewGroup/AddNewGroupTable";
import AddNewGroup from "../AddNewGroup/AddNewGroup";
import Modal from "react-modal";
import './setting.css';
import {SelectStyles} from "../modals/add-staff/Left";
import {IoSearch} from "react-icons/io5";
import {storage} from "../../../services";


const {TabPane} = Tabs;

const AccessControlSetting = (props) => {

    const user = storage.local.get("user");

    const isDarkMode = useSelector(state => state.theme.theme_data)
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const {t} = useTranslation()
    const navigate = useNavigate()

    // add new staff modal state
    const [isOpenAddStaff, setIsOpenAddStaff] = useState(false)

    // add new terminal modal state
    const [isOpenAddTerminal, setIsOpenAddTerminal] = useState(false)

    // terminal
    const [terminalPaginationLimit, setTerminalPaginationLimit] = useState(15)
    const [terminalPaginationCurrent, setTerminalPaginationCurrent] = useState(1)
    const [terminalData, setTerminalData] = useState([])
    const [terminalTotal, setTerminalTotal] = useState(null);
    const [activeTerminal, setActiveTerminal] = useState(null)
    const [inactiveTerminal, setInactiveTerminal] = useState(null)

    // staff
    const [staffPaginationLimit, setStaffPaginationLimit] = useState(14)
    const [staffPaginationCurrent, setStaffPaginationCurrent] = useState(1)
    const [staffData, setStaffData] = useState([])
    const [staffTotal, setStaffTotal] = useState(null)
    const [selectedCard, setSelectedCard] = useState([]);
    const [card, setCard] = useState([]);
    const [fingerPrint, setFingerPrint] = useState([]);
    const [editTitle, setEditTitle] = useState(false);
    const [filterChang, setFilterChang] = useState([])
    const [staffFilter, setStaffFilter] = useState([]);



    const [ terminalSelectionState, setTerminalSelectionState] = useState({selectedRowKeys: []})
    const [staffSelectionState, setStaffSelectionState] = useState({selectedRowKeys: []});
    // delete button
    const [deleteStaff, setDeleteStaff] = useState([])
    const [deleteTerminal, setDeleteTerminal] = useState([])

    const [imageState, setImageState] = useState({
        initial: true,
        uploaded: false,
        requested: false,
    })

    // console.log(imageState)


    // admin

    const [staffTableIntialValues, setStaffTableIntialValues] = useState({
        fullname: '',
        gender: '',
        // tabel_number : '',
        department : '',
        user_type: '',
        rank: '',
        door_ip: [],
        access_type: '',
        valid_from_time: moment().startOf("day"),
        valid_to_time:  moment().startOf("day").add(10, "years"),
        work_time_schedule_id: '',
        image: '',
        notification: false,
        cards: [],
        fingerPrint: [],
        edit: false,
        terminal_photo: '',
        work_time_to : moment("18:00", "HH:mm"),
        work_time_from : moment("09:00", "HH:mm")
    })




    const editCancel = () => {
        setStaffTableIntialValues({
            id: '',
            fullname: '',
            gender: '',
            // tabel_number : '',
            department : '',
            user_type: '',
            rank: '',
            door_ip: [],
            access_type: '',
            valid_from_time: moment().startOf("day"),
            valid_to_time:  moment().startOf("day").add(10, "years"),
            work_time_schedule_id: '',
            image: '',
            notification: false,
            edit: false,
            work_time_to : moment("18:00", "HH:mm"),
            work_time_from : moment("09:00", "HH:mm")
        })
        setImageState({
            initial: true,
            uploaded: false,
            requested: false
        })
    };

    const [terminalTableIntialValues, setTerminalTableIntialValues] = useState({
        door_name: '',
        direction: '',
        auth_type: '',
        group_id: '',
        api:'',
        ip_address: '',
        type: '',
        username: '',
        password: '',
    })


    const [searchedData, setSearchedData] = useState('');
    // console.log(searchedData)

    const addNewStaff = () => {
        setIsOpenAddStaff(true)
        setSelectedCard([])
        setCard([])
        setFingerPrint([])
        editCancel()
    }

    const addNewTerminal = () => {
        setIsOpenAddTerminal(true)
    }


    const onChangeTabs = (key) => {
        // console.log(key);
    }

    const [groupIntialValues, setGroupInitialValues] = useState({
        name_uz: '',
        name_ru: '',
        name_en: '',
    })

    const [deleteGroup, setDeleteGroup] = useState([])
    const [show, setShow] = useState(false);
    const [languageGroup, setLanguageGroup] = useState([{}]);



    const onTerminalSelectChange = (selectedRowKeys, a) => {
        setTerminalSelectionState({selectedRowKeys})
        setDeleteTerminal(a.map(item => item.id));
    };

    const onStaffSelectChange = (selectedRowKeys, a) => {
        setStaffSelectionState({selectedRowKeys})
        setDeleteStaff(a.map(item => item.id));
    };



    const terminalRowSelection = {
        selectedRowKeys : terminalSelectionState?.selectedRowKeys,
        onChange: onTerminalSelectChange,
    }
    const staffRowSelection = {
        selectedRowKeys : staffSelectionState?.selectedRowKeys,
        onChange: onStaffSelectChange,
    }



    const getTerminalData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/terminals/${terminalPaginationLimit}/${id}`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
        const {data} = response;
        const count = data.count;
        setTerminalTotal(count)
        const active_count = data.active_count;
        setActiveTerminal(active_count)
        const inactive_count = data.inactive_count;
        setInactiveTerminal(inactive_count)
        const newData = data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * terminalPaginationLimit,
                created_time: moment(item.created_time).format('DD.MM.YYYY, HH:mm:ss'),
                door_name: item.door_name,
                direction: item.direction,
                auth_type: item.auth_type,
                ip_address: item.ip_address,
                type: item.type,
                username: item.username,
                password: item.password,
                status: item.status,
            }
        ))
        setTerminalData(newData)
    }
    // console.log(terminalData)

    // get staff data
    const getStaffData = async (id) => {
        const response = await axios.post(`${ip}/access-control-service/api/terminal/getusers/${staffPaginationLimit}/${id}`,
            {
               searched_data: searchedData,
               department: filterChang,
            },
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })

        const {data} = response;
        // console.log("staff get", data)
        const count = data.count;
        setStaffTotal(count)
        const newData = data?.data?.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * staffPaginationLimit,
                valid_from_time: moment(item.valid_from_time),
                valid_to_time: moment(item.valid_to_time),
                work_time_from : moment(item.work_time_from , "HH:mm"),
                work_time_to : moment(item.work_time_to , "HH:mm"),
                direction: item.direction,
                door_name: item.door_name,
                user_type: item.user_type,
                rank: item.rank,
                work_time_schedule_id: item.work_time_schedule_id,
            }
        ))
        // newData?.sort((a, b) => a.fullname.localeCompare(b.fullname));
        setStaffData(newData);
    }


    useEffect(() => {
        const getStaffFilterData = () => {
            axios.get(`${ip}/access-control-service/api/all/department`,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    const { data } = res;
                    const newData = data.data.map(item => ({
                        id: item.id,
                        full_name: item.full_name,
                    }))
                    setStaffFilter(newData)
                })
                .catch(err => {
                    console.log(err?.response?.data)
                })
        }
        getStaffFilterData();
    }, [])

    // console.log(staffFilter)
    const onChangeStaffFilter = (e) => {
        setFilterChang(e)
    };



    // console.log(adminData)

    const [terminalIPList, setTerminalIPList] = useState([]);


    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalOpenTerminal, setDeleteModalOpenTerminal] = useState(false);
    const cencelDelete = () => {
        setDeleteModalOpen(false);
        setStaffSelectionState({selectedRowKeys: []});
        setDeleteStaff([]);
    }
    const cencelDeleteTerminal = () => {
        setDeleteModalOpenTerminal(false);
        setTerminalSelectionState({selectedRowKeys: []});
        setDeleteTerminal([]);
    }

    const deleteEmployee = () =>{
        setDeleteModalOpen(true);
    }
    const deleteEmployeeTerminal = () =>{
        setDeleteModalOpenTerminal(true);
    }


    const handleDeliteStaff = () => {
        axios.delete(`${ip}/access-control-service/api/terminal/deleteusers`,
            {
                data: deleteStaff,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            },
        )
            .then(res => {
                message.success("Ma'lumotlar o'chirildi", 5);
                setDeleteStaff([]);
                setStaffSelectionState({selectedRowKeys: []});
                getStaffData(staffPaginationCurrent);
                setDeleteModalOpen(false);
            })
            .catch(err => {
                console.log(err?.response?.data)
            })
    }


    const handleDeleteterminal = () => {
        axios.delete(`${ip}/access-control-service/api/terminal/delete`,
            {
                data: deleteTerminal,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                message.success("Ma'lumotlar o'chirildi", 5);
                setDeleteTerminal([]);
                setTerminalSelectionState({selectedRowKeys: []});
                getTerminalData(terminalPaginationCurrent);
                setDeleteModalOpenTerminal(false);
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }


    const getCameraGroup = async () => {
        const response = await axios.get(`${ip}/access-control-service/api/terminal-group`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const newData = data && data.data.map((item, index) => (
            {
                ...item,
                key: 1000 * index + 1,
                name_uz: item.name_uz,
                name_ru: item.name_ru,
                name_en: item.name_en,
            }
        ))
        setLanguageGroup(newData);
    }

    const handleDeleteGroup = () => {
        axios.delete(`${ip}/access-control-service/api/delete/terminal-group`,
            {
                data: deleteGroup,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                getCameraGroup();
                setDeleteGroup([]);
            })
            .catch(err => {
                console.log(err?.response?.data)
            })
    }


    const terminalPaginationOnChange = (e = 1, option) => {
        getTerminalData(e)
        setTerminalPaginationCurrent(e)
        setTerminalPaginationLimit(option)
    }

    const staffPaginationOnChange = (e = 1, option) => {
        getStaffData(e)
        setStaffPaginationCurrent(e)
        setStaffPaginationLimit(option)
    }


    useEffect(() => {
        getTerminalData(terminalPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminalPaginationLimit, terminalPaginationCurrent])

    useEffect(() => {
        getStaffData(staffPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staffPaginationLimit, staffPaginationCurrent, searchedData])




    // redirect
    useEffect(() => {
        getCameraGroup()
        // if (!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='access_control_setting'>

            <div className='access_control_setting_header'>
                <div className="acsess_content_top">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Kirishni boshqarish sozlamalar")}</p>
                </div>
            </div>

            <div className={`access_control_setting_body ${isDarkMode && 'darkModeBackground darkModeBorder'}`}>

                <Tabs onChange={onChangeTabs} type="card" defaultActiveKey="1">

                    {user.role === 'operator' ? "" :
                        <TabPane tab={t("Terminal parametrlari")} key="1">

                            <div className="face_control_setting_tab">
                                <div className='access_control_setting_tab_item'>
                                    <AddTerminalModal
                                        isOpenAddTerminal={isOpenAddTerminal}
                                        setIsOpenAddTerminal={setIsOpenAddTerminal}
                                        terminalTableIntialValues={terminalTableIntialValues}
                                        setTerminalTableIntialValues={setTerminalTableIntialValues}
                                        getTerminalData={getTerminalData}
                                        terminalPaginationCurrent={terminalPaginationCurrent}
                                        languageGroup={languageGroup}
                                    />
                                    <div className='access_control_setting_tab_item_body'>
                                        <TerminalTable
                                            isDarkMode={isDarkMode}
                                            terminalData={terminalData}
                                            setIsOpenAddTerminal={setIsOpenAddTerminal}
                                            setTerminalTableIntialValues={setTerminalTableIntialValues}
                                            rowSelection={terminalRowSelection}
                                        />
                                    </div>
                                    <div className='access_control_setting_tab_item_footer'>
                                        <div className='access_control_setting_tab_item_footer_buttons'>
                                            <button onClick={addNewTerminal} className='add_button'>
                                                <MdOutlineAddCircleOutline size={24} style={{marginRight: '5px'}}/>
                                                {t("Terminal qo'shish")}
                                            </button>

                                            {
                                                deleteTerminal.length > 0 &&
                                                <button className="delete_button" onClick={deleteEmployeeTerminal}>
                                                    <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                                    {t("O’chirish")}
                                                </button>
                                            }
                                        </div>

                                        <div className="counts_pagination">
                                            <div className="active_inactive_counts">
                                                <div className="active_inactive">
                                                    {t("Faol")} {activeTerminal} ,
                                                </div>
                                                <div className="active_inactive">
                                                    {t("Nofaol")} {inactiveTerminal}
                                                </div>
                                            </div>

                                            <div>
                                                <TerminalPagination
                                                    accessTablePaginationLimit={terminalPaginationLimit}
                                                    accessTablePaginationCurrent={terminalPaginationCurrent}
                                                    accessTablePaginationOnChange={terminalPaginationOnChange}
                                                    accessTableTotal={terminalTotal}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="camera_groups">
                                    <div className="camera_groups_add_new_group_table">
                                        <AddNewGroupTable
                                            languageGroup={languageGroup}
                                            setLanguageGroup={setLanguageGroup}
                                            isDarkMode={isDarkMode}
                                            setDeleteGroup={setDeleteGroup}
                                            setGroupInitialValues={setGroupInitialValues}
                                            setShow={setShow}

                                        />
                                    </div>

                                    <div className="add_new_group_content">
                                        {
                                            !show ?
                                                <div className="add_new_group">

                                                    {
                                                        deleteGroup.length > 0 ?
                                                            <button onClick={handleDeleteGroup}
                                                                    className="group_delite_button">
                                                                <AiOutlineDelete size={22}/>
                                                                {t("O’chirish")}
                                                            </button>
                                                            :
                                                            <button onClick={() => setShow(true)}
                                                                    className="camera_groups_button">
                                                                <MdOutlineAddCircleOutline size={24}
                                                                                           style={{marginRight: '5px'}}/>
                                                                {t("Bino qo'shish")}
                                                            </button>
                                                    }
                                                </div>
                                                :
                                                <AddNewGroup
                                                    groupIntialValues={groupIntialValues}
                                                    setGroupInitialValues={setGroupInitialValues}
                                                    show={show}
                                                    setShow={setShow}
                                                    cameraPaginationCurrent={terminalPaginationCurrent}
                                                    getCameraGroup={getCameraGroup}
                                                    languageGroup={languageGroup}
                                                />
                                        }
                                    </div>

                                </div>
                            </div>

                        </TabPane>
                    }

                    <TabPane tab={t("Xodimlar")} key="2">
                        <span className="filter_select">

                             <div className='access_report_content_top_right'>
                                            <div className={`report_content_top_search  ${isDarkMode && 'darkModeInputBackgraund'}`}>
                                                <IoSearch className={`${isDarkMode && 'darkModeColor'}`}/>
                                                <input
                                                    className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                    onChange={(e) => {
                                                        setStaffPaginationCurrent(1);
                                                        setSearchedData(e.currentTarget.value);
                                                    }}
                                                    type='search'
                                                    placeholder={t('Izlash')}
                                                />
                                            </div>
                             </div>

                             <SelectStyles
                                 mode="multiple"
                                 allowClear
                                 style={{
                                     width: '100%',
                                 }}
                                 defaultValue="all"
                                 placeholder={t("Tanlash")}
                                 value={filterChang}
                                 onChange={onChangeStaffFilter}
                                 options={staffFilter?.map((item) => ({
                                     value: item.id,
                                     label: item.full_name
                                 }))}
                             />

                            <button className='select_search_button' onClick={() => getStaffData(1)} >
                                {t('Izlash')}
                            </button>
                        </span>
                        <AddStaff
                            isOpenAddStaff={isOpenAddStaff}
                            setIsOpenAddStaff={setIsOpenAddStaff}
                            staffTableIntialValues={staffTableIntialValues}
                            setStaffTableIntialValues={setStaffTableIntialValues}
                            getStaffData={getStaffData}
                            staffPaginationCurrent={staffPaginationCurrent}
                            selectedCard={selectedCard}
                            setSelectedCard={setSelectedCard}
                            card={card}
                            setCard={setCard}
                            fingerPrint={fingerPrint}
                            setFingerPrint={setFingerPrint}
                            editTitle={editTitle}
                            setTerminalIPList={setTerminalIPList}
                            terminalIPList={terminalIPList}
                            imageState={imageState}
                            setImageState={setImageState}
                        />
                        <div className="access_control_setting_tab">
                            <div className='access_control_setting_tab_item'>
                                <div className='access_control_setting_tab_item_body'>
                                    <StaffTable
                                        isDarkMode={isDarkMode}
                                        staffData={staffData}
                                        rowSelection={staffRowSelection}
                                        setIsOpenAddStaff={setIsOpenAddStaff}
                                        setStaffTableIntialValues={setStaffTableIntialValues}
                                        setCard={setCard}
                                        setFingerPrint={setFingerPrint}
                                        setEditTitle={setEditTitle}
                                    />
                                </div>
                                <div className='access_control_setting_tab_item_footer'>
                                    <div className='access_control_setting_tab_item_footer_buttons'>
                                        {user.role === 'operator' ? "" :
                                        <button onClick={addNewStaff} className='add_button'>
                                            <MdOutlineAddCircleOutline size={24} style={{marginRight: '5px'}}/>
                                            {t("Xodim qo'shish")}
                                        </button>
                                        }
                                        {user.role === 'operator' ? "" :
                                            (
                                                    deleteStaff.length > 0 &&
                                                        <button style={{marginRight: 5}} className="delete_button"
                                                                onClick={deleteEmployee}>
                                                            <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                                                            {t("O’chirish")}
                                                        </button>
                                            )
                                        }
                                    </div>


                                    <div className="access-control-pagination">
                                        <p className={`content_total ${isDarkMode && 'darkModeColor'}`}>{t('Jami')}: {staffTotal} </p>
                                        <StaffPagination
                                            staffPaginationLimit={staffPaginationLimit}
                                            staffPaginationCurrent={staffPaginationCurrent}
                                            staffPaginationOnChange={staffPaginationOnChange}
                                            accessTableTotal={staffTotal}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </TabPane>


                </Tabs>

            </div>
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
                                        onClick={() => handleDeliteStaff()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            <div className="delete_modal_all">
                <Modal
                    isOpen={deleteModalOpenTerminal}
                    onRequestClose={cencelDeleteTerminal}
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
                                        onClick={cencelDeleteTerminal}>{t("Yo'q")}
                                </button>
                            </div>
                            <div>
                                <button type="button" className="delete_modal_button_right"
                                        onClick={() => handleDeleteterminal()}>{t("Ha")}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
};
const mapStateToProps = (state) => {
    return {
        onlineManag: state.theme.onlineManag
    }
}

export default connect(mapStateToProps, {getTheme})(AccessControlSetting);