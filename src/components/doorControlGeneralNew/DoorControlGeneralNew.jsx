import React, {useEffect, useState} from 'react';

import logo from '../../images/doorControlGeneralImgNew/LogoNew.png';
import grid1 from '../../images/doorControlGeneralImgNew/Rectangle 619 (1).png';
import grid2 from '../../images/doorControlGeneralImgNew/Grid style.png';
import grid3 from '../../images/doorControlGeneralImgNew/Grid style (1).png';
import grid4 from '../../images/doorControlGeneralImgNew/Grid style (2).png';
import featuredIcon from '../../images/doorControlGeneralImgNew/Featured icon.png';
import userImg from '../../images/doorControlGeneralImgNew/Group (10).png';
import loginIcon from '../../images/doorControlGeneralImgNew/log-in-02.png';
import user2 from '../../images/doorControlGeneralImgNew/eldor.jpg';
import userError from '../../images/doorControlGeneralImgNew/userError.png';
import box from '../../images/doorControlGeneralImgNew/menu.png';
import deleteIcon from '../../images/doorControlGeneralImgNew/deleteIcon.png';
import {Checkbox, Tooltip} from "antd";
import AddDoorModal from "./addModal/AddDoorModal";
import DeleteDoorModal from "./deleteModal/DeleteDoorModal";
import './doorControlGeneralNew.css';
import axios from "axios";
import {ip, terminalSocket} from "../../ip";
import socketIOClient from "socket.io-client";
import terminalImg1 from "../../images/doorControlGeneralImgNew/Rectangle 619 (1).png";
import terminalImg2 from "../../images/doorControlGeneralImgNew/Grid style.png";
import terminalImg3 from "../../images/doorControlGeneralImgNew/Grid style (1).png";
import terminalImg4 from "../../images/doorControlGeneralImgNew/Grid style (2).png";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {connect, useSelector} from "react-redux";
import {getManagment, getTheme, putManagment} from "../../redux/theme/themeActions";
import moment from "moment";

const DoorControlGeneralNew = (props) => {

    const {} = props;

    const token = "sRCCRrP6x9ui2g+vE50KLCE3EoKIbJoSNA/1/q6AB/NOkcOw4yOIrpeLlh8DzrDi8Syt4fB7+/qZnSmikHNAeQ==";
    // const token = localStorage.getItem('soft-ais-token');

    // get real time
    const [currentTime, setCurrentTime] = useState("");
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formattedTime = `${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${now.getFullYear()}, ${now
                .toLocaleTimeString("en-GB", {hour12: false})}`;
            setCurrentTime(formattedTime);
        };
        updateTime(); // Birinchi marta chaqiramiz
        const intervalId = setInterval(updateTime, 1000); // Har 1 soniyada yangilanadi
        return () => clearInterval(intervalId); // Komponent o'chirilsa intervalni to'xtatadi
    }, []);
    // get real time

    const onChangeCheck = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);


    // old code
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
                    'x-access-token': token
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
            return () => clearInterval(timeOutObject[viewer]);
        } catch (error) {
            // console.log(error.response?.data);
        }
    };

    const getAllViewerData = async () => {
        for (const viewer of viewerList) {
            await getTerminalUserData(viewer);
        };
    }


    useEffect(() => {
        getAllViewerData();
        const socket = socketIOClient(terminalSocket, {
            extraHeaders: {'x-access-token': token}
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
                            headers: {'x-access-token': token}
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
    const [doorCount , setDoorCount] = useState(null)
    const editOrig = async (terminalViewerList) => {
        const response = await axios.get(`${ip}/access-control-service/api/viewercount`,
            {
                headers: {'x-access-token': token}
            });
        makeDoorStateTrueToId(response?.data[0]?.count);
        // console.log(response?.data[0]?.count)
        setDoorCount(response?.data[0]?.count)
        await makeSomeTerminalViewerValueZero(response?.data[0]?.count, terminalViewerList);
    }

    useEffect(() => editOrig(terminalViwer), []);

    const editingTerminals = (index) => {
        axios.put(`${ip}/access-control-service/api/viewer/${index}`,
            {count: index},
            {headers: {'x-access-token': token}}
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
                    headers: {'x-access-token': token}
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


    const deleteAddTerminal = (item_id) => {
        axios.put(`${ip}/access-control-service/api/terminal/updateviewergroup`, item_id,
            {
                headers: {'x-access-token': token}
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
            {headers: {'x-access-token': token}}
        )
            .then((res) => {
                setTerminals(res?.data);
            })
    }


    useEffect(() => {
        listTerminals()
    }, []);
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
    // const navigate = useNavigate();
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
            {headers: {'x-access-token': token}}
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
        //     // navigate('/face-control-search')
        //     window.location.href = "/face-control-search";
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // delete checkbox
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedCards, setSelectedCards] = useState([]);
    const onChange = (e, id) => {
        if (e.target.checked === true) {
            const uniqueIdsSet = new Set([...deleteTerminalId, e.target.value]);
            const uniqueIdsArray = Array.from(uniqueIdsSet);
            setDeleteTerminalId(uniqueIdsArray);
        } else {
            const filteredIds = deleteTerminalId.filter((existingId) => existingId !== e.target.value);
            setDeleteTerminalId(filteredIds);
        }
        setSelectedCards((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((cardId) => cardId !== id) // Agar tanlangan bo'lsa, o'chiradi
                : [...prevSelected, id] // Aks holda, qo'shadi
        );
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

    // old code

    return (
        <div className="door_control">
            <div className="door_control_header">
                <div className="door_control_header_inner">
                    <div className="door_control_header_inner_left">
                        <img src={logo}/>
                    </div>
                    <div className="door_control_header_inner_right">
                        {deleteTerminalId?.length > 0 ?
                            <div className="door_control_header_inner_right_delete"
                                 onClick={() => setDeleteModalOpen(true)}>
                                <img src={deleteIcon}/>O'chirish
                            </div> : ""}
                        <div className="door_control_header_inner_right_grid">
                            <div className="door_control_header_inner_right_grid_Text">
                                <p>Joylashuv:</p>
                            </div>
                            <div className="door_control_header_inner_right_grid_grids">
                                {
                                    viewerList?.map((viewer_idx, index) =>
                                        <div
                                            className={checkDoorStatesBooleanValue(viewer_idx) ?
                                                "door_control_header_inner_right_grid_grids_inner grid_active"
                                                : "door_control_header_inner_right_grid_grids_inner"}
                                            key={index}
                                            onClick={() => editingTerminals(viewer_idx)}
                                        >
                                            <img src={terminalImgsArray[index]}/>
                                        </div>
                                    )
                                }
                                {/*<div className="door_control_header_inner_right_grid_grids_inner"><img src={grid1}/></div>*/}
                                {/*<div className="door_control_header_inner_right_grid_grids_inner"><img src={grid2}/></div>*/}
                                {/*<div className="door_control_header_inner_right_grid_grids_inner grid_active"><img src={grid3}/></div>*/}
                                {/*<div className="door_control_header_inner_right_grid_grids_inner"><img src={grid4}/></div>*/}
                            </div>
                        </div>
                        <div className="door_control_header_inner_right_time">{currentTime}</div>
                        <Link to='/login'>
                            <div className="door_control_header_inner_right_button">
                                <img src={loginIcon}/>Tizimga kirish
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="door_control_body">
                {doorCount === 1 ?
                    <div className="door_control_body_inner_oneness">
                        {
                            viewerList?.map((viewer_idx, index) =>
                                doorsState[viewer_idx] ?
                                    terminalViwer[viewer_idx]?.length > 0 ?
                                        <div
                                            className={selectedCards.includes(terminalViwer[viewer_idx][0]?.id) ?
                                                "door_control_body_inner_card card_red_border" : "door_control_body_inner_card"}>
                                            <div className="door_control_body_inner_card_inner">
                                                <div className="door_control_body_inner_card_inner_left">
                                                    {/*{*/}
                                                    {/*    terminalUsersData[viewer_idx]?.guest_user*/}
                                                    {/*        ?*/}
                                                    {/*        <img*/}
                                                    {/*            src={`${ip}/access-control-service/api/image/temp/${viewer_idx}/${Date.now()}`}*/}
                                                    {/*            alt=""/>*/}
                                                    {/*        :*/}
                                                    {/*        // <div className="door_control_body_inner_card_inner_left_notUser">*/}
                                                    {/*        //     <img src={userError}/>*/}
                                                    {/*        //     <div className="door_control_body_inner_card_inner_left_notUser_text">*/}
                                                    {/*        //         <p>Xodim haqida ma’lumot topilmadi!</p>*/}
                                                    {/*        //     </div>*/}
                                                    {/*        // </div>*/}
                                                    {/*        <img className="door_control_body_inner_card_inner_left_noImg"*/}
                                                    {/*             src={userImg}/>*/}
                                                    {/*}*/}

                                                    {
                                                        terminalUsersData[viewer_idx] && Object.keys(terminalUsersData[viewer_idx])?.length > 0 ?
                                                            (terminalUsersData[viewer_idx]?.user_in_db?.fullname ?
                                                                    // <img
                                                                    //     src={`${ip}/access-control-service/api/image/temp/${viewer_idx}/${Date.now()}`}
                                                                    //     alt=""/>
                                                                <img
                                                            src={`${ip}/access-control-service/${terminalUsersData[viewer_idx]?.user_in_db?.image}`}
                                                        alt=""/>
                                                                    :
                                                                    <div className="door_control_body_inner_card_inner_left_notUser">
                                                                        <img src={userError}/>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_left_notUser_text">
                                                                            <p>Xodim haqida ma’lumot topilmadi!</p>
                                                                        </div>
                                                                    </div>
                                                            )
                                                            :
                                                            <img className="door_control_body_inner_card_inner_left_noImg"
                                                                 src={userImg}/>
                                                    }
                                                </div>
                                                <div className="door_control_body_inner_card_inner_right">
                                                    <div className="door_control_body_inner_card_inner_right_innerTop">
                                                        <div
                                                            className="door_control_body_inner_card_inner_right_inner_door">
                                                            {terminalViwer[viewer_idx][0]?.door_name}
                                                        </div>
                                                        <div
                                                            className="door_control_body_inner_card_inner_right_inner_checked">
                                                            <Checkbox
                                                                defaultValue={1}
                                                                value={terminalViwer[viewer_idx][0]?.id}
                                                                onChange={(e) => onChange(e, terminalViwer[viewer_idx][0]?.id)}
                                                                // checked={deleteTerminalId.length > 0 ? true : false}
                                                            >
                                                            </Checkbox>
                                                        </div>
                                                    </div>

                                                    {
                                                        terminalUsersData[viewer_idx] && Object.keys(terminalUsersData[viewer_idx])?.length > 0 ?
                                                            (terminalUsersData[viewer_idx]?.user_in_db?.fullname ?
                                                                    <>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>F.I.Sh</span>
                                                                            <Tooltip
                                                                                title="terminalUsersData[viewer_idx]?.user_in_db?.fullname">
                                                                                <p>{terminalUsersData[viewer_idx]?.user_in_db?.fullname}</p>
                                                                            </Tooltip>
                                                                            {/*<p>Istamov Xurshid</p>*/}
                                                                        </div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>Toifasi</span>
                                                                            <p>{terminalUsersData[viewer_idx]?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</p>
                                                                        </div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>Lavozimi</span>
                                                                            <p>{terminalUsersData[viewer_idx]?.user_in_db?.rank}</p>
                                                                        </div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>Ruxsat turi</span>
                                                                            <p>{renderSwitchAuthType(terminalUsersData[viewer_idx]?.guest_user?.auth_type)}</p>
                                                                        </div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner"
                                                                            style={{borderBottom: 0}}>
                                                                            <span>Kirgan vaqti</span><p>
                                                                            {moment(terminalUsersData[viewer_idx]?.guest_user?.created_time).format("DD-MM-YYYY , HH:mm:ss")}</p>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>F.I.Sh</span>
                                                                            <p>-</p></div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>Toifasi</span>
                                                                            <div
                                                                                className="door_control_body_inner_card_inner_right_inner_noBody">
                                                                                Begona shaxs
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>Lavozimi</span>
                                                                            <p>-</p></div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner">
                                                                            <span>Ruxsat turi</span>
                                                                            <p>Yuz orqali kirish</p></div>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner"
                                                                            style={{borderBottom: 0}}>
                                                                            <span>Kirgan vaqti</span><p>
                                                                            {moment(terminalUsersData[viewer_idx]?.guest_user?.created_time).format("DD-MM-YYYY , HH:mm:ss")}
                                                                        </p></div>
                                                                    </>
                                                            )
                                                            :
                                                            <>
                                                                <div
                                                                    className="door_control_body_inner_card_inner_right_inner">
                                                                    <span>F.I.Sh</span>
                                                                    <p>-</p></div>
                                                                <div
                                                                    className="door_control_body_inner_card_inner_right_inner">
                                                                    <span>Toifasi</span>
                                                                    <p>-</p>
                                                                </div>
                                                                <div
                                                                    className="door_control_body_inner_card_inner_right_inner">
                                                                    <span>Lavozimi</span>
                                                                    <p>-</p></div>
                                                                <div
                                                                    className="door_control_body_inner_card_inner_right_inner">
                                                                    <span>Ruxsat turi</span>
                                                                    <p>-</p></div>
                                                                <div
                                                                    className="door_control_body_inner_card_inner_right_inner"
                                                                    style={{borderBottom: 0}}>
                                                                    <span>Kirgan vaqti</span><p>-</p></div>
                                                            </>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="door_control_body_inner_card addTerminalCard">
                                            <div className="door_control_body_inner_card_inner_add">
                                                <div className="door_control_body_inner_card_inner_add_inner">
                                                    <img src={box}/>
                                                    <p>Iltimos eshikni tanlang</p>
                                                    <button onClick={() => upDateViewer(viewer_idx)}>Tanlash</button>
                                                </div>
                                            </div>
                                        </div>
                                    : ""
                            )
                        }
                        {/*<div className="door_control_body_inner_card">*/}
                        {/*    <div className="door_control_body_inner_card_inner">*/}
                        {/*        <div className="door_control_body_inner_card_inner_left">*/}
                        {/*            <img src={user2}/>*/}
                        {/*        </div>*/}
                        {/*        <div className="door_control_body_inner_card_inner_right">*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_innerTop">*/}
                        {/*                <div*/}
                        {/*                    className="door_control_body_inner_card_inner_right_inner_door">SoftDataNewHikEnter*/}
                        {/*                </div>*/}
                        {/*                <div className="door_control_body_inner_card_inner_right_inner_checked">*/}
                        {/*                    <Checkbox onChange={onChangeCheck}></Checkbox>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"><span>F.I.Sh</span>*/}
                        {/*                <p>Istamov Xurshid</p>*/}
                        {/*            </div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"><span>Toifasi</span>*/}
                        {/*                <p>Istamov Xurshid</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner">*/}
                        {/*                <span>Lavozimi</span>*/}
                        {/*                <p>Yetakchi mutaxassis</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner">*/}
                        {/*                <span>Ruxsat turi</span>*/}
                        {/*                <p>Yuz</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"*/}
                        {/*                 style={{borderBottom: 0}}>*/}
                        {/*                <span>Kirgan vaqti</span><p>{currentTime}</p></div>*/}

                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className="door_control_body_inner_card strangerPage">*/}
                        {/*    <div className="door_control_body_inner_card_inner">*/}
                        {/*        <div className="door_control_body_inner_card_inner_left">*/}
                        {/*            <div className="door_control_body_inner_card_inner_left_notUser">*/}
                        {/*                <img src={userError}/>*/}
                        {/*                <div className="door_control_body_inner_card_inner_left_notUser_text">*/}
                        {/*                    <p>Xodim haqida ma’lumot topilmadi!</p>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <div className="door_control_body_inner_card_inner_right">*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_innerTop">*/}
                        {/*                <div*/}
                        {/*                    className="door_control_body_inner_card_inner_right_inner_door">SoftDataNewHikEnter*/}
                        {/*                </div>*/}
                        {/*                <div className="door_control_body_inner_card_inner_right_inner_checked">*/}
                        {/*                    <Checkbox onChange={onChangeCheck}></Checkbox>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"><span>F.I.Sh</span>*/}
                        {/*                <p>-</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"><span>Toifasi</span>*/}
                        {/*                <div className="door_control_body_inner_card_inner_right_inner_noBody">Begona*/}
                        {/*                    shaxs*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner">*/}
                        {/*                <span>Lavozimi</span>*/}
                        {/*                <p>-</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner">*/}
                        {/*                <span>Ruxsat turi</span>*/}
                        {/*                <p>Yuz orqali kirish</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"*/}
                        {/*                 style={{borderBottom: 0}}>*/}
                        {/*                <span>Kirgan vaqti</span><p>{currentTime}</p></div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className="door_control_body_inner_card dataNotPage">*/}
                        {/*    <div className="door_control_body_inner_card_inner">*/}
                        {/*        <div className="door_control_body_inner_card_inner_left">*/}
                        {/*            <div className="door_control_body_inner_card_inner_left_notUser">*/}
                        {/*                <img src={user}/>*/}
                        {/*                /!*<div className="door_control_body_inner_card_inner_left_notUser_text">*!/*/}
                        {/*                /!*    <p>Xodim haqida ma’lumot topilmadi!</p>*!/*/}
                        {/*                /!*</div>*!/*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <div className="door_control_body_inner_card_inner_right">*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_innerTop">*/}
                        {/*                <div*/}
                        {/*                    className="door_control_body_inner_card_inner_right_inner_door">SoftDataNewHikEnter*/}
                        {/*                </div>*/}
                        {/*                <div className="door_control_body_inner_card_inner_right_inner_checked">*/}
                        {/*                    <Checkbox onChange={onChangeCheck}></Checkbox>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"><span>F.I.Sh</span>*/}
                        {/*                <p>-</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"><span>Toifasi</span>*/}
                        {/*                <p>-</p>*/}
                        {/*            </div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner">*/}
                        {/*                <span>Lavozimi</span>*/}
                        {/*                <p>-</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner">*/}
                        {/*                <span>Ruxsat turi</span>*/}
                        {/*                <p>-</p></div>*/}
                        {/*            <div className="door_control_body_inner_card_inner_right_inner"*/}
                        {/*                 style={{borderBottom: 0}}>*/}
                        {/*                <span>Kirgan vaqti</span><p>-</p></div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className="door_control_body_inner_card addTerminalCard">*/}
                        {/*    <div className="door_control_body_inner_card_inner_add">*/}
                        {/*        <div className="door_control_body_inner_card_inner_add_inner">*/}
                        {/*            <img src={box}/>*/}
                        {/*            <p>Iltimos eshikni tanlang</p>*/}
                        {/*            <button>Tanlash</button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>
                    :
                    <div className="door_control_body_inner">
                    {
                        viewerList?.map((viewer_idx, index) =>
                            doorsState[viewer_idx] ?
                                terminalViwer[viewer_idx]?.length > 0 ?
                                    <div
                                        className={
                                            selectedCards.includes(terminalViwer[viewer_idx][0]?.id) ?
                                                "door_control_body_inner_card card_red_border" : "door_control_body_inner_card"}>
                                        <div className="door_control_body_inner_card_inner">
                                            <div className="door_control_body_inner_card_inner_left">
                                                {/*{*/}
                                                {/*    terminalUsersData[viewer_idx]?.guest_user*/}
                                                {/*        ?*/}
                                                {/*        <img*/}
                                                {/*            src={`${ip}/access-control-service/api/image/temp/${viewer_idx}/${Date.now()}`}*/}
                                                {/*            alt=""/>*/}
                                                {/*        :*/}
                                                {/*        // <div className="door_control_body_inner_card_inner_left_notUser">*/}
                                                {/*        //     <img src={userError}/>*/}
                                                {/*        //     <div className="door_control_body_inner_card_inner_left_notUser_text">*/}
                                                {/*        //         <p>Xodim haqida ma’lumot topilmadi!</p>*/}
                                                {/*        //     </div>*/}
                                                {/*        // </div>*/}
                                                {/*        <img className="door_control_body_inner_card_inner_left_noImg"*/}
                                                {/*             src={userImg}/>*/}
                                                {/*}*/}

                                                {
                                                    terminalUsersData[viewer_idx] && Object.keys(terminalUsersData[viewer_idx])?.length > 0 ?
                                                        (terminalUsersData[viewer_idx]?.user_in_db?.fullname ?
                                                                // <img
                                                                //     src={`${ip}/access-control-service/api/image/temp/${viewer_idx}/${Date.now()}`}
                                                                //     alt=""/>
                                                                <img className="door_user_img"
                                                                     src={`${ip}/access-control-service/${terminalUsersData[viewer_idx]?.user_in_db?.image}`}
                                                                     alt=""/>
                                                                :
                                                                <div
                                                                    className="door_control_body_inner_card_inner_left_notUser">
                                                                    <img src={userError}/>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_left_notUser_text">
                                                                        <p>Xodim haqida ma’lumot topilmadi!</p>
                                                                    </div>
                                                                </div>
                                                        )
                                                        :
                                                        <img className="door_control_body_inner_card_inner_left_noImg"
                                                             src={userImg}/>
                                                }
                                            </div>
                                            <div className="door_control_body_inner_card_inner_right">
                                                <div className="door_control_body_inner_card_inner_right_innerTop">
                                                    <div
                                                        className="door_control_body_inner_card_inner_right_inner_door">
                                                        {terminalViwer[viewer_idx][0]?.door_name}
                                                    </div>
                                                    <div
                                                        className="door_control_body_inner_card_inner_right_inner_checked">
                                                        <Checkbox
                                                            defaultValue={1}
                                                            value={terminalViwer[viewer_idx][0]?.id}
                                                            onChange={(e) => onChange(e, terminalViwer[viewer_idx][0]?.id)}
                                                            // checked={deleteTerminalId.length > 0 ? true : false}
                                                        >
                                                        </Checkbox>
                                                    </div>
                                                </div>

                                                {
                                                    terminalUsersData[viewer_idx] && Object.keys(terminalUsersData[viewer_idx])?.length > 0 ?
                                                        (terminalUsersData[viewer_idx]?.user_in_db?.fullname ?
                                                                <>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>F.I.Sh</span>
                                                                        <Tooltip
                                                                            title="terminalUsersData[viewer_idx]?.user_in_db?.fullname">
                                                                            <p>{terminalUsersData[viewer_idx]?.user_in_db?.fullname}</p>
                                                                        </Tooltip>
                                                                        {/*<p>Istamov Xurshid</p>*/}
                                                                    </div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>Toifasi</span>
                                                                        <p>{terminalUsersData[viewer_idx]?.user_in_db?.user_type == 1 ? t("Xodim") : t("Begona")}</p>
                                                                    </div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>Lavozimi</span>
                                                                        <p>{terminalUsersData[viewer_idx]?.user_in_db?.rank}</p>
                                                                    </div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>Ruxsat turi</span>
                                                                        <p>{renderSwitchAuthType(terminalUsersData[viewer_idx]?.guest_user?.auth_type)}</p>
                                                                    </div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner"
                                                                        style={{borderBottom: 0}}>
                                                                        <span>Kirgan vaqti</span><p>
                                                                        {moment(terminalUsersData[viewer_idx]?.guest_user?.created_time).format("DD-MM-YYYY , HH:mm:ss")}</p>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>F.I.Sh</span>
                                                                        <p>-</p></div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>Toifasi</span>
                                                                        <div
                                                                            className="door_control_body_inner_card_inner_right_inner_noBody">
                                                                            Begona shaxs
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>Lavozimi</span>
                                                                        <p>-</p></div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner">
                                                                        <span>Ruxsat turi</span>
                                                                        <p>Yuz orqali kirish</p></div>
                                                                    <div
                                                                        className="door_control_body_inner_card_inner_right_inner"
                                                                        style={{borderBottom: 0}}>
                                                                        <span>Kirgan vaqti</span><p>
                                                                        {moment(terminalUsersData[viewer_idx]?.guest_user?.created_time).format("DD-MM-YYYY , HH:mm:ss")}
                                                                    </p></div>
                                                                </>
                                                        )
                                                        :
                                                        <>
                                                            <div
                                                                className="door_control_body_inner_card_inner_right_inner">
                                                                <span>F.I.Sh</span>
                                                                <p>-</p></div>
                                                            <div
                                                                className="door_control_body_inner_card_inner_right_inner">
                                                                <span>Toifasi</span>
                                                                <p>-</p>
                                                            </div>
                                                            <div
                                                                className="door_control_body_inner_card_inner_right_inner">
                                                                <span>Lavozimi</span>
                                                                <p>-</p></div>
                                                            <div
                                                                className="door_control_body_inner_card_inner_right_inner">
                                                                <span>Ruxsat turi</span>
                                                                <p>-</p></div>
                                                            <div
                                                                className="door_control_body_inner_card_inner_right_inner"
                                                                style={{borderBottom: 0}}>
                                                                <span>Kirgan vaqti</span><p>-</p></div>
                                                        </>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="door_control_body_inner_card addTerminalCard">
                                        <div className="door_control_body_inner_card_inner_add">
                                            <div className="door_control_body_inner_card_inner_add_inner">
                                                <img src={box}/>
                                                <p>Iltimos eshikni tanlang</p>
                                                <button onClick={() => upDateViewer(viewer_idx)}>Tanlash</button>
                                            </div>
                                        </div>
                                    </div>
                                : ""
                        )
                    }

                    </div>
                }
            </div>
            <div className="door_control_bottom">
                <p>Powered by <span>Soft Data</span></p>
                <p>Version 1.1.0</p>
            </div>

            <AddDoorModal
                openAddModal={openModal}
                setOpenAddModal={setOpenmodal}
                terminals={terminals}
                getTerminalInViewer={getTerminalInViewer}
                getTerminalUserData={getTerminalUserData}
                modalOpen={modalOpen}
                viewerId={viewerId}
                token={token}
            />
            <DeleteDoorModal
                openDeleteModal={deleteModalOpen}
                setOpenDeleteModal={setDeleteModalOpen}
                cencel={cencel}
                deleteTerminal={deleteTerminal}
                token={token}
            />
        </div>
    );
};

export default DoorControlGeneralNew;