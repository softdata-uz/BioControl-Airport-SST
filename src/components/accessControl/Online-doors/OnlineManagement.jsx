import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import managmentImg from "../../../images/newimages/managmentImg.svg";
import terminalImg1 from "../../../images/newimages/terminalImg/terminalImgone.svg";
import terminalImg2 from "../../../images/newimages/terminalImg/terminalimgtwo.svg";
import terminalImg3 from "../../../images/newimages/terminalImg/terminalimgthree.svg";
import terminalImg4 from "../../../images/newimages/terminalImg/terminalimgfour.svg";
import Modal from "react-modal";
import axios from "axios";
import {ip, socketToken} from "../../../ip";
import {terminalSocket} from "../../../ip";
import "bootstrap/dist/css/bootstrap.css";
import myImg from "../../../images/myImg.svg";
import warning from "../../../images/warning.svg";
import doorNext from "../../../images/doorNext.svg";
import recIcon from "../../../images/recognationIcon.svg";
import AddStaff from "../modals/add-staff/AddStaff";
import noIMG from "../../../images/noIMG.svg";
import {AiOutlineDelete} from 'react-icons/ai';
import socketIOClient from "socket.io-client";
import moment from "moment";
import "./onlineDoors.css";
import "./onlineManegment.css";
import {connect} from "react-redux";
import {getManagment, putManagment, getTheme} from "../../../redux/theme/themeActions";
import {Checkbox} from "antd";

const OnlineManagement = (props) => {

    const [openModal, setOpenmodal] = useState(false);
    const modalOpen = () => {
        setOpenmodal(!openModal);
    }

    const [terminalUsersData, setTerminalUsersData] = useState({
        "1": {},
        "2": {},
        "3": {},
        "4": {}
    });

    const viewerList = ["1", "2", "3", "4"];

    const timeOutObject = {};

    const getTerminalUserData = async (viewer) => {
        try {

            if (timeOutObject[viewer]) {
                clearTimeout(timeOutObject[viewer]);
            }

            const response = await axios.get(`${ip}/access-control-service/api/temp/${viewer}`, {
                headers: {
                    'x-access-token': localStorage.getItem('soft-ais-token')
                }
            });
            // setting fetched data to exact viewer
            setTerminalUsersData((prevData) => {
                const newData = {...prevData};
                newData[viewer] = response?.data?.data[0];
                return newData;
            });

            // clearing fetched data from exact viewer
            timeOutObject[viewer] = setTimeout(() => {
                setTerminalUsersData((prevData) => {
                    const newData = {...prevData};
                    newData[viewer] = {};
                    return newData;
                });
            }, 15000);

        } catch (error) {
            // console.log(error.response?.data);
        }
    };

    const getAllViewerData = async () => {
        for (const viewer of viewerList) {
            await getTerminalUserData(viewer);
        }
        ;
    }


    useEffect(() => {
        getAllViewerData();
        const socket = socketIOClient(terminalSocket, {
            extraHeaders: {
                'x-access-token': socketToken
            }
        });
        socket.on("terminal", data => {
            getTerminalUserData(data);
            // viewer id = 1, 2, 3, 4, ...
        });
    }, []);

    // terminal joylashuvi
    const [doorsState, setDoorsState] = useState({
        "1": true,
        "2": false,
        "3": false,
        "4": false
    });

    const makeDoorStateTrueToId = (viewerId) => {

        setDoorsState(prevData => {
            const newDoors = {...prevData};
            for (const door in newDoors) {
                if (Number(door) <= Number(viewerId)) newDoors[door] = true;
                else newDoors[door] = false;
            }
            return newDoors;
        })
    }

    const terminalImgsArray = [terminalImg1, terminalImg2, terminalImg3, terminalImg4];
    const checkDoorStatesBooleanValue = (viewerId) => {
        switch (+viewerId) {
            case 1: {
                return doorsState[1] && !doorsState[2] && !doorsState[3] && !doorsState[4];
            }
            case 2: {
                return doorsState[1] && doorsState[2] && !doorsState[3] && !doorsState[4];
            }
            case 3: {
                return doorsState[1] && doorsState[2] && doorsState[3] && !doorsState[4];
            }
            case 4: {
                return doorsState[1] && doorsState[2] && doorsState[3] && doorsState[4];
            }
            default:
                return false;
        }
    }

    const makeSomeTerminalViewerValueZero = async (count, terminalViewerList) => {

        for (let i = count + 1; i <= viewerList.length; i++) {

            try {
                if (terminalViewerList[i]?.length > 0) {
                    await axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${terminalViewerList[i][0]?.id}`,
                        {viewer: 0},
                        {
                            headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
                        });
                    getTerminalInViewer(i);
                }
            } catch (err) {
            }
        }
    }

    const [viewerId, setViewerId] = useState(0);
    const [terminalViwer, setTerminalViewer] = useState({
        "1": [],
        "2": [],
        "3": [],
        "4": []
    });


    const editOrig = async (terminalViewerList) => {
        const response = await axios.get(`${ip}/access-control-service/api/viewercount`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            });

        makeDoorStateTrueToId(response?.data[0]?.count);

        await makeSomeTerminalViewerValueZero(response?.data[0]?.count, terminalViewerList);
    }

    useEffect(() => editOrig(terminalViwer), []);

    const editingTerminals = (index) => {

        axios.put(`${ip}/access-control-service/api/viewer/${index}`,
            {count: index},
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(async (res) => {

                await editOrig(terminalViwer);
                // editOrig(terminalViwer1, terminalViwer2, terminalViwer3, terminalViwer4)
            })
            .catch(err => {
                console.log("Edit count = ", err?.response?.data);
            })
    }


    const getTerminalInViewer = async (viewer_index) => {
        try {
            const res = await axios.get(`${ip}/access-control-service/api/terminal/getterminal/${viewer_index}`,
                {
                    headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
                });
            setTerminalViewer(prevData => {
                const newData = {...prevData};
                newData[viewer_index] = res?.data;
                return newData;
            });
        } catch (err) {
        }
    }

    const getAllTerminalInViewer = async () => {
        for (const viewer of viewerList) {
            await getTerminalInViewer(viewer);
        }
        ;
    }

    useEffect(() => {
        getAllTerminalInViewer();
    }, [])

    const selectedTer = (item_Id) => {
        // console.log(viewerId)
        axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${item_Id}`,
            {viewer: viewerId},
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((response) => {
                getTerminalInViewer(viewerId);
                getTerminalUserData(viewerId);
            })
        modalOpen();
    }

    const deleteAddTerminal = (item_id) => {
        axios.put(`${ip}/access-control-service/api/terminal/updateviewergroup`, item_id,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then((res) => {
                getAllTerminalInViewer();
                cencel();
            })
    }

    const deleteTerminal = () => {
        deleteAddTerminal(deleteTerminalId);
    }

    const upDateViewer = (id) => {
        // console.log("mouse over " + id)
        localStorage.setItem("viewer_id", id);
        listTerminals();
        setViewerId(id);
        modalOpen();
    }

    // ter royxati.
    const [terminals, setTerminals] = useState([]);
    const listTerminals = () => {
        axios.get(`${ip}/access-control-service/api/viewerscreen/terminal`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then((res) => {
                setTerminals(res?.data);
            })
    }


    useEffect(() => listTerminals(), []);
    // ter royxati

    const [touch, setTouch] = useState(true);

    const [deleteViewer, setDeleteViewer] = useState([]);
    const [deleteTerminalId, setDeleteTerminalId] = useState([]);
    const changeTouch = (delete_id, terminal_id) => {
        setDeleteViewer(delete_id);
        setDeleteTerminalId(terminal_id);
        setTouch(!touch)
    }
    // online Door page value;
    const {t} = useTranslation();
    const navigate = useNavigate();
    const isDarkMode = useSelector(state => state.theme.theme_data);
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value);

    const [isOpenAddStaff, setIsOpenAddStaff] = useState(false);

    const addNewStaff = () => {
        // setIsOpenAddStaff(true);
        // navigate("/access-control-parkingSettingIndentification");
    }

    const Reject = (viewer) => {
        setTerminalUsersData((prevData) => {
            const newData = {...prevData};
            newData[viewer] = {};
            return newData;
        });
    }


    const openDoor = (ip_address) => {
        axios.get(`${ip}/access-control-service/api/terminal/open/${ip_address}`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(res => {
                // console.log(res.data)
            })
            .catch(err => {
                //
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    useEffect(() => {
        // if (!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // delete checkbox
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const onChange = (e) => {
        if (e.target.checked === true) {
            const uniqueIdsSet = new Set([...deleteTerminalId, e.target.value]);
            const uniqueIdsArray = Array.from(uniqueIdsSet);
            setDeleteTerminalId(uniqueIdsArray);
        } else {
            const filteredIds = deleteTerminalId.filter((existingId) => existingId !== e.target.value);
            setDeleteTerminalId(filteredIds);
        }
    };

    const cencel = () => {
        setDeleteModalOpen(!deleteModalOpen);
        setDeleteTerminalId([]);
    }

    const renderSwitchRank = (value) => {
        switch (+value) {
            case 1:
                return t("Oddiy xodim");
            case 2:
                return t("Direktor");
            case 3:
                return t("VIP");
            case 4:
                return t("Mehmon");
            default:
                return t('Bloklangan');
        }
    }

    const renderSwitchAuthType = (value) => {
        switch (+value) {
            case 1:
                return t("Yuz");
            case 2:
                return t("Barmoq izi");
            case 3:
                return t("ID karta");
            case 4:
                return t("Yuz va Barmoq izi");
            case 6:
                return t("Yuz va ID karta");
            case 8:
                return t("Barmoq izi va ID karta");
            default:
                return "";
        }
    }

    // delete checkbox

    return (
        <div>
            <div className="online_doors_content">
                <div className="online_managment_title">
                    <div className="content_top">
                        <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Eshiklar boshqaruvi")}</p>
                        <div className="content_button">
                            {deleteTerminalId?.length > 0 ?
                                <button type="button" className="deleteButton" onClick={() => setDeleteModalOpen(true)}>
                <span className="online_management_delete_button">
                  <div className="deleteButtonImg">
                    <AiOutlineDelete size="18px"/>
                  </div>
                  <span>{t("O’chirish")}</span>
                </span>
                                </button> : ''}
                            <span className={` ${isDarkMode && 'darkModeColor'}`}>{t("Terminallar joylashuvi")} :</span>
                            {
                                viewerList?.map((viewer_idx, index) =>
                                    <button type="button" key={index}
                                            className={checkDoorStatesBooleanValue(viewer_idx) ? "btn active changeB" : "btn changeB"}
                                            onClick={() => editingTerminals(viewer_idx)}>
                                        <img src={terminalImgsArray[index]}/>
                                    </button>
                                )
                            }

                        </div>
                    </div>
                </div>

                {/*<div className="online_doors_body">*/}

                {/*</div>*/}

                <div className={`online_doors_body ${isDarkMode && 'darkModeBackground'}`}>
                    {
                        viewerList?.map((viewer_idx, index) =>
                                doorsState[viewer_idx] ?
                                    terminalViwer[viewer_idx]?.length > 0 ?
                                        <div className={"dcdc"} key={index}>

                                            <div className={`online_doors_info_content ${isDarkMode && 'darkModeLayautBg'}`}
                                                // onClick={() => changeTouch(1, terminalViwer1[0]?.id)}
                                            >
                                                {/*<img src={cursor} className="cursorTouch">*/}
                                                <div
                                                    className={`online_doors_info_title ${isDarkMode && 'darkModeLayautBg'}`}>
                        <span className={`${isDarkMode && 'darkModeColor'}`}>
                          {terminalViwer[viewer_idx][0]?.door_name}
                        </span>
                                                </div>
                                                <div className="door_img_box">
                                                    {
                                                        terminalUsersData[viewer_idx]?.guest_user
                                                            ?
                                                            <div className="overflov_img">
                                                                <img className="doors_left_img"
                                                                     src={`${ip}/access-control-service/api/image/temp/${viewer_idx}/${Date.now()}`}
                                                                     alt=""/>
                                                                {/*<img className="doors_left_img" src={jjj} alt=""/>*/}
                                                            </div>
                                                            : <img className="doors_left_default" src={myImg} alt="img"/>
                                                    }
                                                    <div className="door_img_box_checkbox">
                                                        {/*<Checkbox value={terminalViwer1[0]?.id} onChange={() => changeTouch(1, terminalViwer1[0]?.id)}></Checkbox>*/}
                                                        <Checkbox
                                                            defaultValue={1}
                                                            value={terminalViwer[viewer_idx][0]?.id}
                                                            onChange={onChange}
                                                            // checked={deleteTerminalId.length > 0 ? true : false}
                                                        >
                                                        </Checkbox>
                                                    </div>
                                                </div>
                                                {
                                                    terminalUsersData[viewer_idx] && Object.keys(terminalUsersData[viewer_idx])?.length > 0 ? (terminalUsersData[viewer_idx]?.user_in_db?.fullname ?
                                                            <div className="doors_right">
                                                                <div className="doors_time_info">
                                                                    <p className="doors_time">{moment(terminalUsersData[viewer_idx]?.guest_user?.created_time).format("DD.MM.YYYY - HH:mm:ss")}</p>
                                                                    {/*<h1 className="doors_time">{moment( onlineImg && onlineImg.guest_user && onlineImg.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
                                                                </div>
                                                                <div className="box_right_top">
                                                                    <div className="right_top_info">
                                                                        <div className="label_box">
                                                                            <div
                                                                                className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
                                                                            </div>
                                                                            <div
                                                                                className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{terminalUsersData[viewer_idx]?.user_in_db?.fullname}
                                                                            </div>
                                                                        </div>
                                                                        <div className="label_box">
                                                                            <div
                                                                                className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
                                                                            </div>
                                                                            <div
                                                                                // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.user_in_db?.user_type == 1 ? t("Xodim") : onlineImg?.user_in_db?.user_type == 2 ? t("Mehmon") : t("Begona")}</div>
                                                                                className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{terminalUsersData[viewer_idx]?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</div>
                                                                        </div>
                                                                        <div className="label_box">
                                                                            <div
                                                                                className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
                                                                            </div>
                                                                            <div
                                                                                className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
                                                                                {
                                                                                    // renderSwitchRank(terminalUsersData[viewer_idx]?.user_in_db?.rank)
                                                                                    terminalUsersData[viewer_idx]?.user_in_db?.rank
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="img_box">
                                                                        <img className="door_user_img"
                                                                             src={`${ip}/access-control-service/${terminalUsersData[viewer_idx]?.user_in_db?.image}`}
                                                                             alt="img"/>
                                                                    </div>
                                                                </div>
                                                                <div className="label_box">
                                                                    <div
                                                                        className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
                                                                    </div>
                                                                    <div
                                                                        // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.guest_user?.auth_type}</div>
                                                                        className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
                                                                        {
                                                                            renderSwitchAuthType(terminalUsersData[viewer_idx]?.guest_user?.auth_type)
                                                                        }</div>
                                                                    {/*className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.user_in_db?.access_type}</div>*/}
                                                                </div>
                                                                {
                                                                    Number(terminalUsersData[viewer_idx]?.guest_user?.status) !== 1 ?
                                                                        <div className="limit_info">
                                                                            <div
                                                                                className="limit_info_top">
                                                                                <img
                                                                                    className="limit_info_top_img"
                                                                                    src={warning}
                                                                                    alt=""/>
                                                                                <h1 className="limit_top_title">{t("Xodimning kirish muddati tugagan!")}</h1>
                                                                            </div>
                                                                            <p className="limit_middle_title">{t("Ruxsat etilgan muddatni uzaytirish uchun")}</p>
                                                                            <div
                                                                                className="limit_info_bottom">
                                                                                <h3 className="limit_bottom_title">{t("Sozlamalarga o’ting")}</h3>
                                                                                <img
                                                                                    className="limit_bottom_title_img"
                                                                                    src={doorNext}
                                                                                    alt=""/>
                                                                            </div>
                                                                        </div> : ``
                                                                }
                                                            </div>
                                                            :
                                                            <div className="doords_right_no">
                                                                <div className="doors_time_info">
                                                                    <p className="doors_time">{moment(terminalUsersData[viewer_idx]?.guest_user?.created_time).format("DD.MM.YYYY - HH:mm:ss")}</p>
                                                                </div>
                                                                <div
                                                                    className="doords_right_not_allowed">
                                                                    <img className="doors_right_icon"
                                                                         src={recIcon} alt=""/>
                                                                    <h1 className={`not_allowed_title ${isDarkMode && 'darkModeColor'}`}>{t("Ma’lumot topilmadi")}</h1>
                                                                    <p className={`not_allowed_text ${isDarkMode && 'darkModeColor'}`}>{t("Ushbu shaxs ma’lumotlar bazasida aniqlanmadi")}</p>
                                                                    {/*<AddStaff*/}
                                                                    {/*    isOpenAddStaff={isOpenAddStaff}*/}
                                                                    {/*    setIsOpenAddStaff={setIsOpenAddStaff}*/}
                                                                    {/*/>*/}
                                                                    <div
                                                                        className="not_allowed_buttons">
                                                                        <button
                                                                            className="not_allowed_buttons_cancel"
                                                                            onClick={() => Reject(viewer_idx)}>{t("Bekor qilish")}</button>
                                                                        <button onClick={addNewStaff}
                                                                                className="not_allowed_buttons_registration_two">{t("Ro’yxatga olish")}</button>
                                                                        {/*<button className="not_allowed_buttons_registration"><Link to="">{t("Ro’yxatga olish")}</Link></button>*/}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => openDoor(terminalUsersData[viewer_idx]?.guest_user?.ip)}
                                                                        className="not_allowed_allow">{t("Ruxsat berish")}</button>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        <div className="doors_right">
                                                            {/*oddiy turgan xolatidagi page*/}
                                                            <div className="doors_time_info">

                                                                <p className="doors_time">{t("Aniqlash vaqti")}</p>

                                                                {/*<h1 className="doors_time">{moment( onlineImg && onlineImg.guest_user && onlineImg.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
                                                            </div>
                                                            <div className="box_right_top">
                                                                <div className="right_top_info">
                                                                    <div className="label_box">
                                                                        <div
                                                                            className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
                                                                        </div>
                                                                        <div
                                                                            className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
                                                                    </div>
                                                                    <div className="label_box">
                                                                        <div
                                                                            className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
                                                                        </div>
                                                                        <div
                                                                            className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
                                                                    </div>
                                                                    <div className="label_box">
                                                                        <div
                                                                            className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
                                                                        </div>
                                                                        <div
                                                                            className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
                                                                    </div>

                                                                </div>

                                                                <div className="img_box">
                                                                    <img className="no_my_img" src={noIMG} alt=""/>
                                                                </div>
                                                            </div>
                                                            <div className="label_box">
                                                                <div
                                                                    className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
                                                                </div>
                                                                <div
                                                                    className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
                                                            </div>
                                                        </div>
                                                }
                                            </div>

                                        </div>
                                        :
                                        <div
                                            // className={doorOne === true && doorTwo === false && doorThree === false && doorFour === false ? "online_doors_managment_one" : "online_doors_managment"}
                                            className={`online_doors_managment ${isDarkMode && 'darkModeLayautBg'}`}>
                                            <div className="online_doors_managment_body">
                                                <img src={managmentImg}/>
                                                <h2 className={`${isDarkMode && 'darkModeColor'}`}>{t("Iltimos eshikni tanlang")}</h2>
                                                <button type="button" className="online_doors_select_button"
                                                        onClick={() => upDateViewer(viewer_idx)}>
                                                    {t("Tanlash")}
                                                </button>
                                            </div>
                                        </div>
                                    : ""
                        )
                    }
                </div>

                <>
                    <Modal
                        isOpen={openModal}
                        onRequestClose={() => setOpenmodal(!openModal)}
                        // onRequestClose={() => setIsOpenAddCamera(cancel)}
                        contentLabel="My dialog"
                        className="mymodal"
                        overlayClassName="myoverlay"
                        closeTimeoutMS={0}
                    >

                        <div className="online_doors_modal">
                            <div className="online_doors_modal_title">
                                <h4>{t('Terminallar ro\'yxati')}</h4>
                            </div>
                            <div className="online_doors_modal_bodyOne">
                                {/*<div className="online_doors_modal_body">*/}
                                {terminals?.map((item, index) => {
                                    return (
                                        <div className="online_doors_modal_body_inner" key={index}
                                             onClick={() => selectedTer(item?.id)}>
                                            <div className="online_doors_modal_body_inner_in">
                                                <div className="imgbor"></div>
                                                <div className="online_doors_modal_body_inner_in_in">
                                                    <h5>{item?.door_name}</h5>
                                                    <span>{item?.direction === "Entry" ? t("Kirish eshigi") : t("Chiqish eshigi")}</span>
                                                </div>
                                            </div>
                                            <div className="linee">

                                            </div>
                                        </div>
                                    )
                                })}
                                {/*</div>*/}
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={deleteModalOpen}
                        onRequestClose={cencel}
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
                                            onClick={cencel}
                                    >{t("Yo'q")}</button>
                                </div>
                                <div>
                                    <button type="button" className="delete_modal_button_right"
                                            onClick={deleteTerminal}
                                    >{t("Ha")}</button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        count: state.theme.count,
        onlineManag: state.theme.onlineManag
    }
}

export default connect(mapStateToProps, {getManagment, putManagment, getTheme})(OnlineManagement);
// export default OnlineManagement


// import React, {useState, useEffect} from 'react';
// import {useTranslation} from "react-i18next";
// import {useNavigate} from "react-router-dom";
// import {useSelector} from "react-redux";
// import managmentImg from "../../../images/newimages/managmentImg.svg";
// import cursor from "../../../images/newimages/cursor.svg";
// import terminalImg1 from "../../../images/newimages/terminalImg/terminalImgone.svg";
// import terminalImg2 from "../../../images/newimages/terminalImg/terminalimgtwo.svg";
// import terminalImg3 from "../../../images/newimages/terminalImg/terminalimgthree.svg";
// import terminalImg4 from "../../../images/newimages/terminalImg/terminalimgfour.svg";
// import Modal from "react-modal";
// import axios from "axios";
// import {ip} from "../../../ip";
// import {terminalSocket} from "../../../ip";
// import "bootstrap/dist/css/bootstrap.css";
// import myImg from "../../../images/myImg.svg";
// import warning from "../../../images/warning.svg";
// import doorNext from "../../../images/doorNext.svg";
// import recIcon from "../../../images/recognationIcon.svg";
// import AddStaff from "../modals/add-staff/AddStaff";
// import noIMG from "../../../images/noIMG.svg";
// import delete_icon from "../../../images/newimages/deleteImg.svg";
// import {AiOutlineDelete} from 'react-icons/ai';
//
// import socketIOClient from "socket.io-client";
// import moment from "moment";
// import "./onlineDoors.css";
// import "./onlineManegment.css";
//
//
// import {connect} from "react-redux";
// import {getManagment, putManagment, getTheme} from "../../../redux/theme/themeActions";
//
// // drag and drop
// import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
// import {Checkbox} from "antd";
//
// const getItems = (count) =>
//     Array.from({length: count}, (v, k) => k).map((k) => ({
//         id: `item-${k}`,
//         content: `item ${k}`
//     }));
// const reorder = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
// };
// const grid = 4;
//
// const getItemStyle = (isDragging, draggableStyle) => ({
//     // some basic styles to make the items look a bit nicer
//     userSelect: "none",
//     padding: grid * 2,
//     margin: `0 0 ${grid}px 0`,
//
//     // change background colour if dragging
//     background: isDragging ? "lightgreen" : "grey",
//
//     // styles we need to apply on draggables
//     ...draggableStyle
// });
//
// const getListStyle = (isDraggingOver) => ({
//     // width: 550,
// });
//
// const OnlineManagement = (props) => {
//
//     // drag and frop
//
//     const [items, setItems] = React.useState(getItems(1));
//     const [items2, setItems2] = React.useState(getItems(1));
//     const [items3, setItems3] = React.useState(getItems(1));
//     const [items4, setItems4] = React.useState(getItems(1));
//
//
//     // drag pag1
//     const onDragEnd = (result) => {
//         if (!result.destination) {
//             return;
//         }
//         const reorderedItems = reorder(
//             items,
//             result.source.index,
//             result.destination.index
//         );
//         setItems(reorderedItems);
//     };
//     // drag pag2
//     const onDragEnd2 = (result) => {
//         if (!result.destination) {
//             return;
//         }
//         const reorderedItems = reorder(
//             items2,
//             result.source.index,
//             result.destination.index
//         );
//         setItems2(reorderedItems);
//     };
//     // drag pag3
//     const onDragEnd3 = (result) => {
//         if (!result.destination) {
//             return;
//         }
//         const reorderedItems = reorder(
//             items3,
//             result.source.index,
//             result.destination.index
//         );
//         setItems3(reorderedItems);
//     };
//     // drag pag4
//     const onDragEnd4 = (result) => {
//         if (!result.destination) {
//             return;
//         }
//         const reorderedItems = reorder(
//             items4,
//             result.source.index,
//             result.destination.index
//         );
//         setItems4(reorderedItems);
//     };
//     //// dragg ////
//
//
//     const [openModal, setOpenmodal] = useState(false);
//     const modalOpen = () => {
//         setOpenmodal(!openModal);
//     }
//
//     // terminal joylashuvi
//     const [doorOne, setDoorOne] = useState(true);
//     const [doorTwo, setDoorTwo] = useState(false);
//     const [doorThree, setDoorThree] = useState(false);
//     const [doorFour, setDoorFour] = useState(false);
//
//     function terminal1() {
//         setDoorOne(true);
//         setDoorTwo(false);
//         setDoorThree(false);
//         setDoorFour(false);
//     }
//
//     function terminal2() {
//         setDoorOne(true);
//         setDoorTwo(true);
//         setDoorThree(false);
//         setDoorFour(false);
//     }
//
//     function terminal3() {
//         setDoorOne(true);
//         setDoorTwo(true);
//         setDoorThree(true);
//         setDoorFour(false);
//     }
//
//     function terminal4() {
//         setDoorOne(true);
//         setDoorTwo(true);
//         setDoorThree(true);
//         setDoorFour(true);
//     }
//
//     const [viewerId, setViewerId] = useState(0);
//     const [terminalViwer1, setTerminalViewer1] = useState([]);
//     const [terminalViwer2, setTerminalViewer2] = useState([]);
//     const [terminalViwer3, setTerminalViewer3] = useState([]);
//     const [terminalViwer4, setTerminalViewer4] = useState([]);
//
//     const [count_id, setCountId] = useState(0);
//
//     const editOrig = (ter1, ter2, ter3, ter4) => {
//         axios.get(`${ip}/access-control-service/api/viewercount`,
//             { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//             )
//             .then((res) => {
//                 setCountId(res.data[0]?.count);
//                 if (res.data[0]?.count == 1) {
//                     terminal1();
//                 } else if (res.data[0]?.count == 2) {
//                     terminal2();
//                 } else if (res.data[0]?.count == 3) {
//                     terminal3();
//                 } else if (res.data[0]?.count == 4) {
//                     terminal4();
//                 }
//             }).catch(error => {
//         })
//
//         if (count_id == 1) {
//             if (ter4?.length > 0) {
//                 axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${ter4[0]?.id}`,
//                     {viewer: 0},
//                 { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                 )
//                     .then((res) => {
//                         getTerminalInViewer(4);
//                     })
//             }
//             if (ter3?.length > 0) {
//                 axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${ter3[0]?.id}`,
//                     {viewer: 0},
//                     { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                     )
//                     .then((res) => {
//                         getTerminalInViewer(3);
//                     })
//             }
//             if (ter2?.length > 0) {
//                 axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${ter2[0]?.id}`,
//                     {viewer: 0},
//                     { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                     )
//                     .then((res) => {
//                         getTerminalInViewer(2);
//                     })
//             }
//         } else if (count_id == 2) {
//             if (ter4?.length > 0) {
//                 axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${ter4[0]?.id}`,
//                     {viewer: 0},
//                     { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                 )
//                     .then((res) => {
//                         getTerminalInViewer(4);
//                     })
//             }
//             if (ter3?.length > 0) {
//                 axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${ter3[0]?.id}`,
//                     {viewer: 0},
//                     { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                     )
//                     .then((res) => {
//                         getTerminalInViewer(3);
//                     })
//             }
//         } else if (count_id == 3) {
//             // console.log("id count  3");
//             if (ter4?.length > 0) {
//                 axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${ter4[0]?.id}`,
//                     {viewer: 0},
//                     { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                     )
//                     .then((res) => {
//                         getTerminalInViewer(4);
//                     })
//
//             } else {
//             }
//         }
//
//     }
//
//     useEffect(() => editOrig(), []);
//
//     const editingTerminals = (index) => {
//         axios.put(`${ip}/access-control-service/api/viewer/${index}`,
//             {count: index},
//             { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//             )
//             .then((res) => {
//                 editOrig(terminalViwer1, terminalViwer2, terminalViwer3, terminalViwer4)
//             })
//     }
//
//
//     const getTerminalInViewer = (viewer_index) => {
//         axios.get(`${ip}/access-control-service/api/terminal/getterminal/${viewer_index}`,
//                 { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//                 )
//             .then(res => {
//                 if (viewer_index == 1) {
//                     setTerminalViewer1(res?.data);
//                 } else if (viewer_index == 2) {
//                     setTerminalViewer2(res?.data);
//                 } else if (viewer_index == 3) {
//                     setTerminalViewer3(res?.data);
//                 } else if (viewer_index == 4) {
//                     setTerminalViewer4(res?.data);
//                 }
//             })
//             .catch(err => {
//
//             })
//     }

//     useEffect(() => {
//         getTerminalInViewer(1);
//         getTerminalInViewer(2);
//         getTerminalInViewer(3);
//         getTerminalInViewer(4);
//     }, [])
//
//     const selectedTer = (item_Id) => {
//         // console.log(viewerId)
//         axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${item_Id}`,
//             {viewer: viewerId},
//             { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//             )
//             .then((response) => {
//                 getTerminalInViewer(viewerId);
//             })
//         modalOpen();
//     }
//
//     const deleteAddTerminal = (item_id) => {
//         axios.put(`${ip}/access-control-service/api/terminal/updateviewergroup`, item_id ,
//             {
//                 headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
//             }
//         )
//             .then((res) => {
//                 getTerminalInViewer(1);
//                 getTerminalInViewer(2);
//                 getTerminalInViewer(3);
//                 getTerminalInViewer(4);
//                 cencel();
//             })
//     }
//
//     const deleteTerminal = () => {
//         deleteAddTerminal(deleteTerminalId);
//     }
//
//     const upDateViewer = (id) => {
//         // console.log("mouse over " + id)
//         localStorage.setItem("viewer_id", id);
//         listTerminals();
//         setViewerId(id);
//         modalOpen();
//     }
//
//     // ter royxati.
//     const [terminals, setTerminals] = useState([]);
//     const listTerminals = () => {
//         axios.get(`${ip}/access-control-service/api/viewerscreen/terminal`,
//             { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//             )
//             .then((res) => {
//                 setTerminals(res.data);
//             })
//     }
//
//
//     useEffect(() => listTerminals(), []);
//     // ter royxati
//
//     const [touch, setTouch] = useState(true);
//
//     const [deleteViewer, setDeleteViewer] = useState([]);
//     const [deleteTerminalId, setDeleteTerminalId] = useState([]);
//     const changeTouch = (delete_id, terminal_id) => {
//         console.log(delete_id , terminal_id)
//         setDeleteViewer(delete_id);
//         setDeleteTerminalId(terminal_id);
//         setTouch(!touch)
//     }
//     // online Door page value;
//     const {t} = useTranslation();
//     const navigate = useNavigate();
//     const isDarkMode = useSelector(state => state.theme.theme_data);
//     const is_refresh_value = useSelector(state => state.theme.is_refresh_value);
//     const [onlineImg, setOnlineImg] = useState(null);
//     const [onlineImg2, setOnlineImg2] = useState(null);
//     const [onlineImg3, setOnlineImg3] = useState(null);
//     const [onlineImg4, setOnlineImg4] = useState(null);
//
//     const [isOpenAddStaff, setIsOpenAddStaff] = useState(false);
//
//     const addNewStaff = () => {
//         // setIsOpenAddStaff(true);
//         // navigate("/access-control-parkingSettingIndentification");
//     }
//
//
//     const listenDoorByIp = () => {
//         const socket = socketIOClient(terminalSocket);
//         socket.on("terminal1", data => {
//             setOnlineImg(data)
//             // console.log("1 - ", data);
//         });
//     }
//     const listenDoorByIp2 = () => {
//         const socket = socketIOClient(terminalSocket);
//         socket.on("terminal2", data => {
//             setOnlineImg2(data)
//             // console.log("2 - ", data)
//         });
//     }
//     const listenDoorByIp3 = () => {
//         const socket = socketIOClient(terminalSocket);
//         socket.on("terminal3", data => {
//             setOnlineImg3(data)
//             // console.log("3 - ", data)
//         });
//     }
//     const listenDoorByIp4 = () => {
//         const socket = socketIOClient(terminalSocket);
//         socket.on("terminal4", data => {
//             setOnlineImg4(data)
//             // console.log("4 - ", data)
//         });
//     }
//
//     useEffect(() => listenDoorByIp(), []);
//     useEffect(() => listenDoorByIp2(), []);
//     useEffect(() => listenDoorByIp3(), []);
//     useEffect(() => listenDoorByIp4(), []);
//
//     const reject = () => {
//         setOnlineImg(null)
//     }
//
//
//     const openDoor = () => {
//         axios.get(`${ip}/access-control-service/api/terminal/open/${onlineImg && onlineImg.guest_user && onlineImg.guest_user.ip}`,
//             { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
//         )
//             .then(res => {
//                 // console.log(res.data)
//             })
//             .catch(err => {
//                 //
//             })
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }
//
//     useEffect(() => {
//         if (!is_refresh_value) {
//             navigate('/face-control-search')
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])
//
//     const blob = new Blob([onlineImg && onlineImg.guest_user && onlineImg.guest_user.image]);
//     const url = URL.createObjectURL(blob);
//
//     const blob2 = new Blob([onlineImg2 && onlineImg2.guest_user && onlineImg2.guest_user.image]);
//     const url2 = URL.createObjectURL(blob2);
//
//     const blob3 = new Blob([onlineImg3 && onlineImg3.guest_user && onlineImg3.guest_user.image]);
//     const url3 = URL.createObjectURL(blob3);
//
//     const blob4 = new Blob([onlineImg4 && onlineImg4.guest_user && onlineImg4.guest_user.image]);
//     const url4 = URL.createObjectURL(blob4);
//     // online door page value
//
//
//     ///////////////////// Drag and Drop //////////////////////
//
// // delete checkbox
//     const [deleteModalOpen , setDeleteModalOpen] = useState(false);
//
//     const onChange = (e) => {
//         if (e.target.checked === true){
//             const uniqueIdsSet = new Set([...deleteTerminalId, e.target.value]);
//             const uniqueIdsArray = Array.from(uniqueIdsSet);
//             setDeleteTerminalId(uniqueIdsArray);
//         }
//         else {
//             const filteredIds = deleteTerminalId.filter((existingId) => existingId !== e.target.value);
//             setDeleteTerminalId(filteredIds);
//         }
//     };
//
//     // console.log(deleteTerminalId)
//
//     const cencel = () =>{
//         setDeleteModalOpen(!deleteModalOpen);
//         setDeleteTerminalId([]);
//     }
//
// // delete checkbox
//
//     return (
//         <div>
//             <div className="online_doors_content">
//                 <div className="online_managment_title">
//                     <div className="content_top">
//                         <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Eshiklar boshqaruvi")}</p>
//                         <div className="content_button">
//                            {deleteTerminalId.length > 0 ? <button type="button" className="deleteButton" onClick={()=>setDeleteModalOpen(true)}>
//                                 <span className="online_management_delete_button">
//                                        <div className="deleteButtonImg">
//                                            <AiOutlineDelete size="18px"/>
//                                        </div>
//                                        <span>{t("O’chirish")}</span>
//                                 </span>
//                             </button> : ''}
//
//                             <span  className={` ${isDarkMode && 'darkModeColor'}`}>{t("Terminallar joylashuvi")} :</span>
//
//                             <button type="button"
//                                     className={doorOne === true && doorTwo === false && doorThree === false && doorFour === false ? "btn active changeB" : "btn changeB"}
//                                     onClick={() => editingTerminals(1)}>
//                                 <img src={terminalImg1}/>
//                             </button>
//                             <button type="button"
//                                     className={doorOne === true && doorTwo === true && doorThree === false && doorFour === false ? "btn active changeB" : "btn changeB"}
//                                     onClick={() => editingTerminals(2)}>
//                                 <img src={terminalImg2}/>
//                             </button>
//                             <button type="button"
//                                     className={doorOne === true && doorTwo === true && doorThree === true && doorFour === false ? "btn active changeB" : "btn changeB"}
//                                     onClick={() => editingTerminals(3)}>
//                                 <img src={terminalImg3}/>
//                             </button>
//                             <button type="button"
//                                     className={doorOne === true && doorTwo === true && doorThree === true && doorFour === true ? "btn active changeB" : "btn changeB"}
//                                     onClick={() => editingTerminals(4)}>
//                                 <img src={terminalImg4}/>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/*<div className="online_doors_body">*/}
//
//                 {/*</div>*/}
//
//                 <div className={`online_doors_body ${isDarkMode && 'darkModeBackground'}`}>
//                     {
//                         terminalViwer1?.length > 0 ?
//                                         <div className={"dcdc"}>
//                                             {items.map((item, idx) => {
//                                                 return(
//                                                     <div className={`online_doors_info_content ${isDarkMode && 'darkModeLayautBg'}`}
//                                                         // onClick={() => changeTouch(1, terminalViwer1[0]?.id)}
//                                                     >
//                                                         {/*<img src={cursor} className="cursorTouch">*/}
//                                                         <div className={`online_doors_info_title ${isDarkMode && 'darkModeLayautBg'}`}>
//                                                                     <span className={`${isDarkMode && 'darkModeColor'}`}>
//                                                                         {terminalViwer1[0]?.door_name}
//                                                                     </span>
//                                                         </div>
//                                                         <div className="door_img_box">
//                                                             {
//                                                                 onlineImg
//                                                                     ?
//                                                                     <div className="overflov_img">
//                                                                         <img className="doors_left_img"
//                                                                              src={url} alt=""/>
//                                                                         {/*<img className="doors_left_img" src={jjj} alt=""/>*/}
//                                                                     </div>
//                                                                     : <img className="doors_left_default"
//                                                                            src={myImg} alt="img"/>
//                                                             }
//                                                             <div className="door_img_box_checkbox">
//                                                                 {/*<Checkbox value={terminalViwer1[0]?.id} onChange={() => changeTouch(1, terminalViwer1[0]?.id)}></Checkbox>*/}
//                                                                 <Checkbox
//                                                                           defaultValue={1}
//                                                                           value={terminalViwer1[0]?.id}
//                                                                           onChange={onChange}></Checkbox>
//                                                             </div>
//                                                         </div>
//                                                         {
//                                                             onlineImg ? (onlineImg.hasOwnProperty('user_in_db') ?
//                                                                     <div className="doors_right">
//                                                                         <div className="doors_time_info">
//                                                                             <p className="doors_time">{moment(new Date(onlineImg?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                             {/*<h1 className="doors_time">{moment( onlineImg && onlineImg.guest_user && onlineImg.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                         </div>
//                                                                         <div className="box_right_top">
//                                                                             <div className="right_top_info">
//                                                                                 <div className="label_box">
//                                                                                     <div
//                                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                     </div>
//                                                                                     <div
//                                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg && onlineImg.user_in_db && onlineImg.user_in_db.fullname}
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <div className="label_box">
//                                                                                     <div
//                                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                     </div>
//                                                                                     <div
//                                                                                         // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.user_in_db?.user_type == 1 ? t("Xodim") : onlineImg?.user_in_db?.user_type == 2 ? t("Mehmon") : t("Begona")}</div>
//                                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</div>
//                                                                                 </div>
//                                                                                 <div className="label_box">
//                                                                                     <div
//                                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                     </div>
//                                                                                     <div
//                                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                         {
//                                                                                             onlineImg?.user_in_db?.rank == 1 ? t("Oddiy xodim") :
//                                                                                                 onlineImg?.user_in_db?.rank == 2 ? t("Direktor") :
//                                                                                                     onlineImg?.user_in_db?.rank == 3 ? t("VIP") :
//                                                                                                         onlineImg?.user_in_db?.rank == 4 ? t("Mehmon") :
//                                                                                                             onlineImg?.user_in_db?.rank == 5 ? t("Bloklangan") : ''
//                                                                                         }
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="img_box">
//                                                                                 <img className="door_user_img"
//                                                                                      src={`${ip}/access-control-service/${onlineImg && onlineImg.user_in_db && onlineImg.user_in_db.id}.jpg`}
//                                                                                      alt="img"/>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="label_box">
//                                                                             <div
//                                                                                 className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                             </div>
//                                                                             <div
//                                                                                 // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.guest_user?.auth_type}</div>
//                                                                                 className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                 {onlineImg?.guest_user?.auth_type === "1" ? t("Yuz") :
//                                                                                     onlineImg?.guest_user?.auth_type === "2" ? t("Barmoq izi") :
//                                                                                         onlineImg?.guest_user?.auth_type === "3" ? t("ID karta") :
//                                                                                             onlineImg?.guest_user?.auth_type === "4" ? t("Yuz va Barmoq izi") :
//                                                                                                 onlineImg?.guest_user?.auth_type === "6" ? t("Yuz va ID karta") :
//                                                                                                     onlineImg?.guest_user?.auth_type === "8" ? t("Barmoq izi va ID karta") : ''
//
//                                                                                 }</div>
//                                                                             {/*className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg?.user_in_db?.access_type}</div>*/}
//                                                                         </div>
//                                                                         {
//                                                                             Number(onlineImg?.guest_user?.status) !== 1 ?
//                                                                                 <div className="limit_info">
//                                                                                     <div
//                                                                                         className="limit_info_top">
//                                                                                         <img
//                                                                                             className="limit_info_top_img"
//                                                                                             src={warning}
//                                                                                             alt=""/>
//                                                                                         <h1 className="limit_top_title">{t("Xodimning kirish muddati tugagan!")}</h1>
//                                                                                     </div>
//                                                                                     <p className="limit_middle_title">{t("Ruxsat etilgan muddatni uzaytirish uchun")}</p>
//                                                                                     <div
//                                                                                         className="limit_info_bottom">
//                                                                                         <h3 className="limit_bottom_title">{t("Sozlamalarga o’ting")}</h3>
//                                                                                         <img
//                                                                                             className="limit_bottom_title_img"
//                                                                                             src={doorNext}
//                                                                                             alt=""/>
//                                                                                     </div>
//                                                                                 </div> : ``
//                                                                         }
//                                                                     </div>
//                                                                     :
//                                                                     <div className="doords_right_no">
//                                                                         <div className="doors_time_info">
//                                                                             <p className="doors_time">{moment(new Date(onlineImg?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                         </div>
//                                                                         <div
//                                                                             className="doords_right_not_allowed">
//                                                                             <img className="doors_right_icon"
//                                                                                  src={recIcon} alt=""/>
//                                                                             <h1 className={`not_allowed_title ${isDarkMode && 'darkModeColor'}`}>{t("Ma’lumot topilmadi")}</h1>
//                                                                             <p className={`not_allowed_text ${isDarkMode && 'darkModeColor'}`}>{t("Ushbu shaxs ma’lumotlar bazasida aniqlanmadi")}</p>
//                                                                             <AddStaff
//                                                                                 isOpenAddStaff={isOpenAddStaff}
//                                                                                 setIsOpenAddStaff={setIsOpenAddStaff}
//                                                                             />
//                                                                             <div
//                                                                                 className="not_allowed_buttons">
//                                                                                 <button
//                                                                                     className="not_allowed_buttons_cancel"
//                                                                                     onClick={reject}>{t("Bekor qilish")}</button>
//                                                                                 <button onClick={addNewStaff}
//                                                                                         className="not_allowed_buttons_registration_two">{t("Ro’yxatga olish")}</button>
//                                                                                 {/*<button className="not_allowed_buttons_registration"><Link to="">{t("Ro’yxatga olish")}</Link></button>*/}
//                                                                             </div>
//                                                                             <button onClick={openDoor}
//                                                                                     className="not_allowed_allow">{t("Ruxsat berish")}</button>
//                                                                         </div>
//                                                                     </div>
//                                                                 )
//                                                                 :
//                                                                 <div className="doors_right">
//                                                                     {/*oddiy turgan xolatidagi page*/}
//                                                                     <div className="doors_time_info">
//
//                                                                         <p className="doors_time">{t("Aniqlash vaqti")}</p>
//
//                                                                         {/*<h1 className="doors_time">{moment( onlineImg && onlineImg.guest_user && onlineImg.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                     </div>
//                                                                     <div className="box_right_top">
//                                                                         <div className="right_top_info">
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//
//                                                                         </div>
//
//                                                                         <div className="img_box">
//                                                                             <img className="no_my_img"
//                                                                                  src={noIMG} alt=""/>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="label_box">
//                                                                         <div
//                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                         </div>
//                                                                         <div
//                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                     </div>
//                                                                 </div>
//                                                         }
//                                                     </div>
//                                                 )
//                                                 }
//                                             )}
//                                         </div>
//                             :
//                             <div
//                                 // className={doorOne === true && doorTwo === false && doorThree === false && doorFour === false ? "online_doors_managment_one" : "online_doors_managment"}
//                                 className={`online_doors_managment ${isDarkMode && 'darkModeLayautBg'}`}
//                             >
//                                 <div className="online_doors_managment_body">
//                                     <img src={managmentImg}/>
//                                     <h2 className={`${isDarkMode && 'darkModeColor'}`}>Iltimos eshikni tanlang</h2>
//                                     <button type="button" className="online_doors_select_button"
//                                             onClick={() => upDateViewer(1)}>
//                                         Tanlash
//                                     </button>
//                                 </div>
//                             </div>
//                     }
//
//                     {/*terminal - 2*/}
//
//                     {
//                         terminalViwer2?.length > 0 ?
//                             // terminalViwer["2"]?.length > 0  ?
//
//                                         <div className="dcdc">
//                                             {items2.map((item, idx) => {
//                                                 return(
//                                                     <div className={`online_doors_info_content ${isDarkMode && 'darkModeLayautBg'}`}
//                                                         // onClick={() => changeTouch(2, terminalViwer2[0]?.id)}
//                                                     >
//                                                         <div className={`online_doors_info_title ${isDarkMode && 'darkModeLayautBg'}`}>
//                                                                     <span className={`${isDarkMode && 'darkModeColor'}`}>
//                                                                         {terminalViwer2[0]?.door_name}
//                                                                     </span>
//                                                         </div>
//                                                         <div className="door_img_box">
//                                                             {
//                                                                 onlineImg2
//                                                                     ?
//                                                                     <div className="overflov_img">
//                                                                         <img className="doors_left_img"
//                                                                              src={url2} alt=""/>
//                                                                     </div>
//                                                                     : <img className="doors_left_default"
//                                                                            src={myImg} alt="img"/>
//                                                             }
//                                                             <div className="door_img_box_checkbox">
//                                                                 <Checkbox defaultValue={2} value={terminalViwer2[0]?.id} onChange={onChange}></Checkbox>
//                                                             </div>
//                                                         </div>
//                                                         {
//                                                             onlineImg2 ? (onlineImg2.hasOwnProperty('user_in_db') ?
//                                                                     <div className="doors_right">
//                                                                         <div className="doors_time_info">
//                                                                             <p className="doors_time">{moment(new Date(onlineImg2?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                             {/*<h1 className="doors_time">{moment( onlineImg2 && onlineImg2.guest_user && onlineImg2.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                         </div>
//                                                                         <div className="box_right_top">
//                                                                             <div className="right_top_info">
//                                                                                 <div className="label_box">
//                                                                                     <div
//                                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                     </div>
//                                                                                     <div
//                                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg2 && onlineImg2.user_in_db && onlineImg2.user_in_db.fullname}</div>
//                                                                                 </div>
//                                                                                 <div className="label_box">
//                                                                                     <div
//                                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                     </div>
//                                                                                     <div
//                                                                                         // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg2?.user_in_db?.user_type == 1 ? t("Xodim") : onlineImg2?.user_in_db?.user_type == 2 ? t("Mehmon") : t("Begona")}</div>
//                                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg2?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</div>
//                                                                                 </div>
//                                                                                 <div className="label_box">
//                                                                                     <div
//                                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                     </div>
//                                                                                     <div
//                                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                         {
//                                                                                             onlineImg2?.user_in_db?.rank == 1 ? t("Oddiy xodim") :
//                                                                                                 onlineImg2?.user_in_db?.rank == 2 ? t("Direktor") :
//                                                                                                     onlineImg2?.user_in_db?.rank == 3 ? t("VIP") :
//                                                                                                         onlineImg2?.user_in_db?.rank == 4 ? t("Mehmon") :
//                                                                                                             onlineImg2?.user_in_db?.rank == 5 ? t("Bloklangan") : ''
//                                                                                         }
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="img_box">
//                                                                                 <img className="door_user_img"
//                                                                                      src={`${ip}/access-control-service/${onlineImg2 && onlineImg2.user_in_db && onlineImg2.user_in_db.id}.jpg`}
//                                                                                      alt="img"/>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="label_box">
//                                                                             <div
//                                                                                 className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                             </div>
//                                                                             <div
//                                                                                 // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg2?.guest_user?.auth_type}</div>
//                                                                                 className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                 {onlineImg2?.guest_user?.auth_type === "1" ? t("Yuz") :
//                                                                                     onlineImg2?.guest_user?.auth_type === "2" ? t("Barmoq izi") :
//                                                                                         onlineImg2?.guest_user?.auth_type === "3" ? t("ID karta") :
//                                                                                             onlineImg2?.guest_user?.auth_type === "4" ? t("Yuz va Barmoq izi") :
//                                                                                                 onlineImg2?.guest_user?.auth_type === "6" ? t("Yuz va ID karta") :
//                                                                                                     onlineImg2?.guest_user?.auth_type === "8" ? t("Barmoq izi va ID karta") : ''
//
//                                                                                 }</div>
//                                                                             {/*className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg2?.user_in_db?.access_type}</div>*/}
//                                                                         </div>
//                                                                         {
//                                                                             Number(onlineImg2?.guest_user?.status) !== 1 ?
//                                                                                 <div className="limit_info">
//                                                                                     <div
//                                                                                         className="limit_info_top">
//                                                                                         <img
//                                                                                             className="limit_info_top_img"
//                                                                                             src={warning}
//                                                                                             alt=""/>
//                                                                                         <h1 className="limit_top_title">{t("Xodimning kirish muddati tugagan!")}</h1>
//                                                                                     </div>
//                                                                                     <p className="limit_middle_title">{t("Ruxsat etilgan muddatni uzaytirish uchun")}</p>
//                                                                                     <div
//                                                                                         className="limit_info_bottom">
//                                                                                         <h3 className="limit_bottom_title">{t("Sozlamalarga o’ting")}</h3>
//                                                                                         <img
//                                                                                             className="limit_bottom_title_img"
//                                                                                             src={doorNext}
//                                                                                             alt=""/>
//                                                                                     </div>
//                                                                                 </div> : ``
//                                                                         }
//                                                                     </div>
//                                                                     :
//                                                                     <div className="doords_right_no">
//                                                                         <div className="doors_time_info">
//                                                                             <p className="doors_time">{moment(new Date(onlineImg2?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                         </div>
//                                                                         <div
//                                                                             className="doords_right_not_allowed">
//                                                                             <img className="doors_right_icon"
//                                                                                  src={recIcon} alt=""/>
//                                                                             <h1 className={`not_allowed_title ${isDarkMode && 'darkModeColor'}`}>{t("Ma’lumot topilmadi")}</h1>
//                                                                             <p className={`not_allowed_text ${isDarkMode && 'darkModeColor'}`}>{t("Ushbu shaxs ma’lumotlar bazasida aniqlanmadi")}</p>
//                                                                             <AddStaff
//                                                                                 isOpenAddStaff={isOpenAddStaff}
//                                                                                 setIsOpenAddStaff={setIsOpenAddStaff}
//                                                                             />
//                                                                             <div
//                                                                                 className="not_allowed_buttons">
//                                                                                 <button
//                                                                                     className="not_allowed_buttons_cancel"
//                                                                                     onClick={reject}>{t("Bekor qilish")}</button>
//                                                                                 <button onClick={addNewStaff}
//                                                                                         className="not_allowed_buttons_registration_two">{t("Ro’yxatga olish")}</button>
//                                                                                 {/*<button className="not_allowed_buttons_registration"><Link to="">{t("Ro’yxatga olish")}</Link></button>*/}
//                                                                             </div>
//                                                                             <button onClick={openDoor}
//                                                                                     className="not_allowed_allow">{t("Ruxsat berish")}</button>
//                                                                         </div>
//                                                                     </div>
//                                                                 )
//                                                                 :
//                                                                 <div className="doors_right">
//                                                                     {/*oddiy turgan xolatidagi page*/}
//                                                                     <div className="doors_time_info">
//                                                                         <p className="doors_time">
//                                                                             {t("Aniqlash vaqti")}
//                                                                         </p>
//                                                                         {/*<h1 className="doors_time">{moment( onlineImg2 && onlineImg2.guest_user && onlineImg2.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                     </div>
//                                                                     <div className="box_right_top">
//                                                                         <div className="right_top_info">
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//
//                                                                         </div>
//
//                                                                         <div className="img_box">
//                                                                             <img className="no_my_img"
//                                                                                  src={noIMG} alt=""/>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="label_box">
//                                                                         <div
//                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                         </div>
//                                                                         <div
//                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                     </div>
//                                                                 </div>
//                                                         }
//                                                     </div>
//                                                 )
//                                             }
//
//                                             )}
//                                         </div>
//
//
//                             :
//                             <div
//                                 className={doorTwo === true ? `online_doors_managment ${isDarkMode && 'darkModeLayautBg'}`
//                                     : `online_doors_managment d-none ${isDarkMode && 'darkModeLayautBg'}`}>
//                                 <div className="online_doors_managment_body" >
//                                     <img src={managmentImg}/>
//                                     <h2 className={`${isDarkMode && 'darkModeColor'}`}>{t("Iltimos eshikni tanlang")}</h2>
//                                     <button type="button" className="online_doors_select_button"
//                                             onClick={() => upDateViewer(2)}
//                                     >
//                                         {t("Tanlash")}
//                                     </button>
//                                 </div>
//                             </div>
//                     }
//                     {/*teminal - 3*/}
//                     {
//                         terminalViwer3?.length > 0 ?
//                                         <div className="dcdc">
//                                             {items3.map((item, idx) => (
//                                                 <div className={`online_doors_info_content ${isDarkMode && 'darkModeLayautBg'}`}
//                                                      // onClick={() => changeTouch(3, terminalViwer3[0]?.id)}
//                                                 >
//                                                     <div className={`online_doors_info_title ${isDarkMode && 'darkModeLayautBg'}`}>
//                                                        <span className={`${isDarkMode && 'darkModeColor'}`}>
//                                                                         {terminalViwer3[0]?.door_name}
//                                                                     </span>
//                                                     </div>
//                                                     <div className="door_img_box">
//                                                         {
//                                                             onlineImg3
//                                                                 ?
//                                                                 <div
//                                                                     className="overflov_img">
//                                                                     <img
//                                                                         className="doors_left_img"
//                                                                         src={url3} alt=""/>
//                                                                 </div>
//                                                                 : <img
//                                                                     className="doors_left_default"
//                                                                     src={myImg} alt="img"/>
//                                                         }
//                                                         <div className="door_img_box_checkbox">
//                                                             <Checkbox defaultValue={3} value={terminalViwer3[0]?.id} onChange={onChange}></Checkbox>
//                                                         </div>
//                                                     </div>
//                                                     {
//                                                         onlineImg3 ? (onlineImg3.hasOwnProperty('user_in_db') ?
//                                                                 <div
//                                                                     className="doors_right">
//                                                                     <div
//                                                                         className="doors_time_info">
//                                                                         <p className="doors_time">{moment(new Date(onlineImg3?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                         {/*<h1 className="doors_time">{moment( onlineImg3 && onlineImg3.guest_user && onlineImg3.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                     </div>
//                                                                     <div
//                                                                         className="box_right_top">
//                                                                         <div
//                                                                             className="right_top_info">
//                                                                             <div
//                                                                                 className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg3 && onlineImg3.user_in_db && onlineImg3.user_in_db.fullname}</div>
//                                                                             </div>
//                                                                             <div
//                                                                                 className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg3?.user_in_db?.user_type == 1 ? t("Xodim") : onlineImg3?.user_in_db?.user_type == 2 ? t("Mehmon") : t("Begona")}</div>
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg3?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</div>
//                                                                             </div>
//                                                                             <div
//                                                                                 className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                     {
//                                                                                         onlineImg3?.user_in_db?.rank == 1 ? t("Oddiy xodim") :
//                                                                                             onlineImg3?.user_in_db?.rank == 2 ? t("Direktor") :
//                                                                                                 onlineImg3?.user_in_db?.rank == 3 ? t("VIP") :
//                                                                                                     onlineImg3?.user_in_db?.rank == 4 ? t("Mehmon") :
//                                                                                                         onlineImg3?.user_in_db?.rank == 5 ? t("Bloklangan") : ''
//                                                                                     }
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div
//                                                                             className="img_box">
//                                                                             <img
//                                                                                 className="door_user_img"
//                                                                                 src={`${ip}/access-control-service/${onlineImg3 && onlineImg3.user_in_db && onlineImg3.user_in_db.id}.jpg`}
//                                                                                 alt="img"/>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div
//                                                                         className="label_box">
//                                                                         <div
//                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                         </div>
//                                                                         <div
//                                                                             // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg3?.guest_user?.auth_type}</div>
//                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                             {onlineImg3?.guest_user?.auth_type === "1" ? t("Yuz") :
//                                                                                 onlineImg3?.guest_user?.auth_type === "2" ? t("Barmoq izi") :
//                                                                                     onlineImg3?.guest_user?.auth_type === "3" ? t("ID karta") :
//                                                                                         onlineImg3?.guest_user?.auth_type === "4" ? t("Yuz va Barmoq izi") :
//                                                                                             onlineImg3?.guest_user?.auth_type === "6" ? t("Yuz va ID karta") :
//                                                                                                 onlineImg3?.guest_user?.auth_type === "8" ? t("Barmoq izi va ID karta") : ''
//
//                                                                             }</div>
//                                                                         {/*className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg3?.user_in_db?.access_type}</div>*/}
//                                                                     </div>
//                                                                     {
//                                                                         Number(onlineImg3?.guest_user?.status) !== 1 ?
//                                                                             <div
//                                                                                 className="limit_info">
//                                                                                 <div
//                                                                                     className="limit_info_top">
//                                                                                     <img
//                                                                                         className="limit_info_top_img"
//                                                                                         src={warning}
//                                                                                         alt=""/>
//                                                                                     <h1 className="limit_top_title">{t("Xodimning kirish muddati tugagan!")}</h1>
//                                                                                 </div>
//                                                                                 <p className="limit_middle_title">{t("Ruxsat etilgan muddatni uzaytirish uchun")}</p>
//                                                                                 <div
//                                                                                     className="limit_info_bottom">
//                                                                                     <h3 className="limit_bottom_title">{t("Sozlamalarga o’ting")}</h3>
//                                                                                     <img
//                                                                                         className="limit_bottom_title_img"
//                                                                                         src={doorNext}
//                                                                                         alt=""/>
//                                                                                 </div>
//                                                                             </div> : ``
//                                                                     }
//                                                                 </div>
//                                                                 :
//                                                                 <div
//                                                                     className="doords_right_no">
//                                                                     <div
//                                                                         className="doors_time_info">
//                                                                         <p className="doors_time">{moment(new Date(onlineImg3?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                     </div>
//                                                                     <div
//                                                                         className="doords_right_not_allowed">
//                                                                         <img
//                                                                             className="doors_right_icon"
//                                                                             src={recIcon}
//                                                                             alt=""/>
//                                                                         <h1 className={`not_allowed_title ${isDarkMode && 'darkModeColor'}`}>{t("Ma’lumot topilmadi")}</h1>
//                                                                         <p className={`not_allowed_text ${isDarkMode && 'darkModeColor'}`}>{t("Ushbu shaxs ma’lumotlar bazasida aniqlanmadi")}</p>
//                                                                         <AddStaff
//                                                                             isOpenAddStaff={isOpenAddStaff}
//                                                                             setIsOpenAddStaff={setIsOpenAddStaff}
//                                                                         />
//                                                                         <div
//                                                                             className="not_allowed_buttons">
//                                                                             <button
//                                                                                 className="not_allowed_buttons_cancel"
//                                                                                 onClick={reject}>{t("Bekor qilish")}</button>
//                                                                             <button
//                                                                                 onClick={addNewStaff}
//                                                                                 className="not_allowed_buttons_registration_two">{t("Ro’yxatga olish")}</button>
//                                                                             {/*<button className="not_allowed_buttons_registration"><Link to="">{t("Ro’yxatga olish")}</Link></button>*/}
//                                                                         </div>
//                                                                         <button
//                                                                             onClick={openDoor}
//                                                                             className="not_allowed_allow">{t("Ruxsat berish")}</button>
//                                                                     </div>
//                                                                 </div>
//                                                             )
//                                                             :
//                                                             <div className="doors_right">
//                                                                 {/*oddiy turgan xolatidagi page*/}
//                                                                 <div
//                                                                     className="doors_time_info">
//                                                                     <p className="doors_time">
//                                                                         {t("Aniqlash vaqti")}
//                                                                     </p>
//                                                                     {/*<h1 className="doors_time">{moment( onlineImg3 && onlineImg3.guest_user && onlineImg3.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                 </div>
//                                                                 <div
//                                                                     className="box_right_top">
//                                                                     <div
//                                                                         className="right_top_info">
//                                                                         <div
//                                                                             className="label_box">
//                                                                             <div
//                                                                                 className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                             </div>
//                                                                             <div
//                                                                                 className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                         </div>
//                                                                         <div
//                                                                             className="label_box">
//                                                                             <div
//                                                                                 className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                             </div>
//                                                                             <div
//                                                                                 className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                         </div>
//                                                                         <div
//                                                                             className="label_box">
//                                                                             <div
//                                                                                 className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                             </div>
//                                                                             <div
//                                                                                 className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                         </div>
//
//                                                                     </div>
//
//                                                                     <div
//                                                                         className="img_box">
//                                                                         <img
//                                                                             className="no_my_img"
//                                                                             src={noIMG}
//                                                                             alt=""/>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="label_box">
//                                                                     <div
//                                                                         className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                     </div>
//                                                                     <div
//                                                                         className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                 </div>
//                                                             </div>
//                                                     }
//                                                 </div>
//                                             ))}
//                                         </div>
//
//                             :
//                             <div
//                                 className={doorThree === true ? `online_doors_managment ${isDarkMode && 'darkModeLayautBg'}`
//                                     : `online_doors_managment d-none ${isDarkMode && 'darkModeLayautBg'}`}>
//                                 <div className="online_doors_managment_body">
//                                     <img src={managmentImg}/>
//                                     <h2 className={`${isDarkMode && 'darkModeColor'}`}>Iltimos eshikni tanlang</h2>
//                                     <button type="button" className="online_doors_select_button"
//                                             onClick={() => upDateViewer(3)}>
//                                         Tanlash
//                                     </button>
//                                 </div>
//                             </div>
//                     }
//                     {/*terminal -4 */}
//                     {
//                         terminalViwer4?.length > 0 ?
//                                         <div className="dcdc">
//                                             {items4.map((item, idx) => (
//                                                             <div className={`online_doors_info_content ${isDarkMode && 'darkModeLayautBg'}`}
//                                                                  // onClick={() => changeTouch(4, terminalViwer4[0]?.id)}
//                                                             >
//                                                                 <div className={`online_doors_info_title ${isDarkMode && 'darkModeLayautBg'}`}>
//                                                                     <span className={`${isDarkMode && 'darkModeColor'}`}>
//                                                                         {terminalViwer4[0]?.door_name}
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="door_img_box">
//                                                                     {
//                                                                         onlineImg4
//                                                                             ?
//                                                                             <div className="overflov_img">
//                                                                                 <img className="doors_left_img"
//                                                                                      src={url4} alt=""/>
//                                                                             </div>
//                                                                             : <img className="doors_left_default"
//                                                                                    src={myImg} alt="img"/>
//                                                                     }
//                                                                     <div className="door_img_box_checkbox">
//                                                                         <Checkbox defaultValue={4} value={terminalViwer4[0]?.id} onChange={onChange}></Checkbox>
//                                                                     </div>
//                                                                 </div>
//                                                                 {
//                                                                     onlineImg4 ? (onlineImg4.hasOwnProperty('user_in_db') ?
//                                                                                 <div className="doors_right">
//                                                                                     <div className="doors_time_info">
//                                                                                         <p className="doors_time">{moment(new Date(onlineImg4?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                                         {/*<h1 className="doors_time">{moment( onlineImg4 && onlineImg4.guest_user && onlineImg4.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                                     </div>
//                                                                                     <div className="box_right_top">
//                                                                                         <div className="right_top_info">
//                                                                                             <div className="label_box">
//                                                                                                 <div
//                                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                                 </div>
//                                                                                                 <div
//                                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg4 && onlineImg4.user_in_db && onlineImg4.user_in_db.fullname}</div>
//                                                                                             </div>
//                                                                                             <div className="label_box">
//                                                                                                 <div
//                                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                                 </div>
//                                                                                                 <div
//                                                                                                     // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg4?.user_in_db?.user_type == 1 ? t("Xodim") : onlineImg4?.user_in_db?.user_type == 2 ? t("Mehmon") : t("Begona")}</div>
//                                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg4?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</div>
//                                                                                             </div>
//                                                                                             <div className="label_box">
//                                                                                                 <div
//                                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                                 </div>
//                                                                                                 <div
//                                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                                     {
//                                                                                                         onlineImg4?.user_in_db?.rank == 1 ? t("Oddiy xodim") :
//                                                                                                             onlineImg4?.user_in_db?.rank == 2 ? t("Direktor") :
//                                                                                                                 onlineImg4?.user_in_db?.rank == 3 ? t("VIP") :
//                                                                                                                     onlineImg4?.user_in_db?.rank == 4 ? t("Mehmon") :
//                                                                                                                         onlineImg4?.user_in_db?.rank == 5 ? t("Bloklangan") : ''
//                                                                                                     }
//                                                                                                 </div>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                         <div className="img_box">
//                                                                                             <img className="door_user_img"
//                                                                                                  src={`${ip}/access-control-service/${onlineImg4 && onlineImg4.user_in_db && onlineImg4.user_in_db.id}.jpg`}
//                                                                                                  alt="img"/>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                     <div className="label_box">
//                                                                                         <div
//                                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                                         </div>
//                                                                                         <div
//                                                                                             // className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg4?.guest_user?.auth_type}</div>
//                                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>
//                                                                                             {onlineImg4?.guest_user?.auth_type === "1" ? t("Yuz") :
//                                                                                                 onlineImg4?.guest_user?.auth_type === "2" ? t("Barmoq izi") :
//                                                                                                     onlineImg4?.guest_user?.auth_type === "3" ? t("ID karta") :
//                                                                                                         onlineImg4?.guest_user?.auth_type === "4" ? t("Yuz va Barmoq izi") :
//                                                                                                             onlineImg4?.guest_user?.auth_type === "6" ? t("Yuz va ID karta") :
//                                                                                                                 onlineImg4?.guest_user?.auth_type === "8" ? t("Barmoq izi va ID karta") : ''
//
//                                                                                             }</div>
//                                                                                         {/*className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}>{onlineImg4?.user_in_db?.access_type}</div>*/}
//                                                                                     </div>
//                                                                                     {
//                                                                                         Number(onlineImg4?.guest_user?.status) !== 1 ?
//                                                                                             <div className="limit_info">
//                                                                                                 <div
//                                                                                                     className="limit_info_top">
//                                                                                                     <img
//                                                                                                         className="limit_info_top_img"
//                                                                                                         src={warning}
//                                                                                                         alt=""/>
//                                                                                                     <h1 className="limit_top_title">{t("Xodimning kirish muddati tugagan!")}</h1>
//                                                                                                 </div>
//                                                                                                 <p className="limit_middle_title">{t("Ruxsat etilgan muddatni uzaytirish uchun")}</p>
//                                                                                                 <div
//                                                                                                     className="limit_info_bottom">
//                                                                                                     <h3 className="limit_bottom_title">{t("Sozlamalarga o’ting")}</h3>
//                                                                                                     <img
//                                                                                                         className="limit_bottom_title_img"
//                                                                                                         src={doorNext}
//                                                                                                         alt=""/>
//                                                                                                 </div>
//                                                                                             </div> : ``
//                                                                                     }
//                                                                                 </div>
//                                                                                 :
//                                                                                 <div className="doords_right_no">
//                                                                                     <div className="doors_time_info">
//                                                                                         <p className="doors_time">{moment(new Date(onlineImg4?.guest_user?.created_time)).format("DD.MM.YYYY - HH:mm:ss")}</p>
//                                                                                     </div>
//                                                                                     <div
//                                                                                         className="doords_right_not_allowed">
//                                                                                         <img className="doors_right_icon"
//                                                                                              src={recIcon} alt=""/>
//                                                                                         <h1 className={`not_allowed_title ${isDarkMode && 'darkModeColor'}`}>{t("Ma’lumot topilmadi")}</h1>
//                                                                                         <p className={`not_allowed_text ${isDarkMode && 'darkModeColor'}`}>{t("Ushbu shaxs ma’lumotlar bazasida aniqlanmadi")}</p>
//                                                                                         <AddStaff
//                                                                                             isOpenAddStaff={isOpenAddStaff}
//                                                                                             setIsOpenAddStaff={setIsOpenAddStaff}
//                                                                                         />
//                                                                                         <div
//                                                                                             className="not_allowed_buttons">
//                                                                                             <button
//                                                                                                 className="not_allowed_buttons_cancel"
//                                                                                                 onClick={reject}>{t("Bekor qilish")}</button>
//                                                                                             <button onClick={addNewStaff}
//                                                                                                     className="not_allowed_buttons_registration_two">{t("Ro’yxatga olish")}</button>
//                                                                                             {/*<button className="not_allowed_buttons_registration"><Link to="">{t("Ro’yxatga olish")}</Link></button>*/}
//                                                                                         </div>
//                                                                                         <button onClick={openDoor}
//                                                                                                 className="not_allowed_allow">{t("Ruxsat berish")}</button>
//                                                                                     </div>
//                                                                                 </div>
//                                                                         )
//                                                                         :
//                                                                         <div className="doors_right">
//                                                                             {/*oddiy turgan xolatidagi page*/}
//                                                                             <div className="doors_time_info">
//                                                                                 <p className="doors_time">
//                                                                                     {t("Aniqlash vaqti")}
//                                                                                 </p>
//                                                                                 {/*<h1 className="doors_time">{moment( onlineImg4 && onlineImg4.guest_user && onlineImg4.guest_user.created_time).format("DD.MM.YYYY  HH:mm:ss")}</h1>*/}
//                                                                             </div>
//                                                                             <div className="box_right_top">
//                                                                                 <div className="right_top_info">
//                                                                                     <div className="label_box">
//                                                                                         <div
//                                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:
//                                                                                         </div>
//                                                                                         <div
//                                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                                     </div>
//                                                                                     <div className="label_box">
//                                                                                         <div
//                                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:
//                                                                                         </div>
//                                                                                         <div
//                                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                                     </div>
//                                                                                     <div className="label_box">
//                                                                                         <div
//                                                                                             className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:
//                                                                                         </div>
//                                                                                         <div
//                                                                                             className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                                     </div>
//
//                                                                                 </div>
//
//                                                                                 <div className="img_box">
//                                                                                     <img className="no_my_img"
//                                                                                          src={noIMG} alt=""/>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className="label_box">
//                                                                                 <div
//                                                                                     className={`doors_right_label ${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:
//                                                                                 </div>
//                                                                                 <div
//                                                                                     className={`doors_right_box ${isDarkMode && 'darkModeColor'}`}></div>
//                                                                             </div>
//                                                                         </div>
//                                                                 }
//                                                             </div>
//                                             ))}
//                                         </div>
//                             :
//                             <div
//                                 className={doorFour === true ? `online_doors_managment ${isDarkMode && 'darkModeLayautBg'}`
//                                     : `online_doors_managment d-none ${isDarkMode && 'darkModeLayautBg'}`}>
//                                 <div className="online_doors_managment_body">
//                                     <img src={managmentImg}/>
//                                     <h2 className={`${isDarkMode && 'darkModeColor'}`}>Iltimos eshikni tanlang</h2>
//                                     <button type="button" className="online_doors_select_button"
//                                             onClick={() => upDateViewer(4)}
//                                     >
//                                         Tanlash
//                                     </button>
//                                 </div>
//                             </div>
//                     }
//                 </div>
//
//                 <>
//                     <Modal
//                         isOpen={openModal}
//                         onRequestClose={() => setOpenmodal(!openModal)}
//                         // onRequestClose={() => setIsOpenAddCamera(cancel)}
//                         contentLabel="My dialog"
//                         className="mymodal"
//                         overlayClassName="myoverlay"
//                         closeTimeoutMS={0}
//                     >
//
//                         <div className="online_doors_modal">
//                             <div className="online_doors_modal_title">
//                                 <h4>Terminallar ro'yxati</h4>
//                             </div>
//                             <div className="online_doors_modal_bodyOne">
//                                 {/*<div className="online_doors_modal_body">*/}
//                                     {terminals.map((item, index) => {
//                                         return (
//                                             <div className="online_doors_modal_body_inner" key={item.id}
//                                                 onClick={() => selectedTer(item.id)}>
//                                                 <div className="online_doors_modal_body_inner_in">
//                                                     <div className="imgbor"></div>
//                                                     <div className="online_doors_modal_body_inner_in_in">
//                                                         <h5>{item.door_name}</h5>
//                                                         <span>{item.direction === "Entry" ? "Kirish eshigi" : "Chiqish eshigi"}</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="linee">
//
//                                                 </div>
//                                             </div>
//                                         )
//                                     })}
//                                 {/*</div>*/}
//                             </div>
//                         </div>
//                     </Modal>
//                     <Modal
//                         isOpen={deleteModalOpen}
//                         onRequestClose={cencel}
//                         contentLabel="My dialog"
//                         className="mymodal"
//                         overlayClassName="myoverlay"
//                         closeTimeoutMS={0}
//                     >
//                         <div className="delete_modal">
//                             <h3>{t("Haqiqatdan ham o'chirasizmi ?")}</h3>
//                             <div className="delete_modal_button">
//                                 <div className="">
//                                     <button type="button" className="delete_modal_button_left"
//                                     onClick={cencel}
//                                     >{t("Yo'q")}</button>
//                                 </div>
//                                 <div>
//                                     <button type="button" className="delete_modal_button_right"
//                                     onClick={deleteTerminal}
//                                     >{t("Ha")}</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </Modal>
//                 </>
//             </div>
//         </div>
//     );
// };
//
// const mapStateToProps = (state) => {
//     return {
//         count: state.theme.count,
//         onlineManag: state.theme.onlineManag
//     }
// }
//
// export default connect(mapStateToProps, {getManagment, putManagment, getTheme})(OnlineManagement);
