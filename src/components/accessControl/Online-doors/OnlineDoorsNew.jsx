import React, {useState, useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import managmentImg from "../../../images/newimages/managmentImg.svg";
import noneImg from '../../../images/no-results 1.png'
import cursor from "../../../images/newimages/cursor.svg";
import terminalImg1 from "../../../images/newimages/terminalImg/terminalImgone.svg";
import terminalImg2 from "../../../images/newimages/terminalImg/terminalimgtwo.svg";
import terminalImg3 from "../../../images/newimages/terminalImg/terminalimgthree.svg";
import terminalImg4 from "../../../images/newimages/terminalImg/terminalimgfour.svg";
import Modal from "react-modal";
import axios from "axios";
import {ip} from "../../../ip";
import {terminalSocket} from "../../../ip";
import "bootstrap/dist/css/bootstrap.css";
import myImg from "../../../images/myImg.svg";
import warning from "../../../images/warning.svg";
import doorNext from "../../../images/doorNext.svg";
import recIcon from "../../../images/recognationIcon.svg";
import AddStaff from "../modals/add-staff/AddStaff";
import noIMG from "../../../images/noIMG.svg";
import delete_icon from "../../../images/newimages/deleteImg.svg";

import socketIOClient from "socket.io-client";
import moment from "moment";
import "./onlineDoors.css";
import "./onlineManegment.css";
import './onlineDoorsNew.css';


import {connect} from "react-redux";
import {getManagment, putManagment, getTheme} from "../../../redux/theme/themeActions";
import {Checkbox, Form} from "antd";


const OnlineManagement = (props) => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const isDarkMode = useSelector(state => state.theme.theme_data);
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value);

    const [openTerModal, setOpenTerModal] = useState(false);
    const openModalTerminal = () => {
        setOpenTerModal(!openTerModal);
    }


    return (
        <div>
            <div className="online_doors_content">
                <div className="online_managment_title_new">
                    <div className="content_top_new">
                        <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Eshiklar boshqaruvi")}</p>
                        <div className="content_button_new">
                            <span className={` ${isDarkMode && 'darkModeColor'}`}>{t("Terminallar joylashuvi")} :</span>

                            <div className="content_button_new_buttons">
                                <div className="button_active"><img src={terminalImg1}/></div>
                                <div><img src={terminalImg2}/></div>
                                <div><img src={terminalImg3}/></div>
                                <div><img src={terminalImg4}/></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`online_doors_body_new ${isDarkMode && 'darkModeBackground'}`}>
                    {/*<div className="online_doors_body_new_card">*/}
                    {/*    <div className="online_doors_body_new_card_inner">*/}
                    {/*        <img src={managmentImg}/>*/}
                    {/*        <p>{t("Iltimos eshikni tanlang")}</p>*/}
                    {/*        <button>{t("Tanlash")}</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className={`online_doors_body_new_card_terminal ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                        <div className="online_doors_body_new_card_terminal_title">
                            HITech
                        </div>
                        <div className={`online_doors_body_new_card_terminal_left ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                            <img src={myImg}/>
                        </div>
                        <div className="online_doors_body_new_card_terminal_right">
                            <div className="online_doors_body_new_card_terminal_right_top">
                                <div className="online_doors_body_new_card_terminal_right_top_inner">
                                    <div className="online_doors_body_new_card_terminal_right_top_left">
                                        <div className="online_doors_body_new_card_terminal_right_top_left_inner">
                                            <span className={`${isDarkMode && 'darkModeColor'}`}>{t("Ism")}:</span>
                                            <h2 className={`${isDarkMode && 'darkModeColor'}`}>AAdcsdcsd</h2>
                                        </div>
                                        <div className="online_doors_body_new_card_terminal_right_top_left_inner">
                                            <span className={`${isDarkMode && 'darkModeColor'}`}>{t("Toifasi")}:</span>
                                            <h2 className={`${isDarkMode && 'darkModeColor'}`}>AAdcsdcsd</h2>
                                        </div>
                                        <div className="online_doors_body_new_card_terminal_right_top_left_inner">
                                            <span className={`${isDarkMode && 'darkModeColor'}`}>{t("Lavozimi")}:</span>
                                            <h2 className={`${isDarkMode && 'darkModeColor'}`}>AAdcsdcsd</h2>
                                        </div>
                                    </div>
                                    <div className="online_doors_body_new_card_terminal_right_top_right">
                                        <img src={noIMG}/>
                                    </div>
                                </div>

                                <div className="online_doors_body_new_card_terminal_right_top_inner">
                                    <div>
                                        <span className={`${isDarkMode && 'darkModeColor'}`}>{t("Ruxsat turi")}:</span>
                                        <h2 className={`${isDarkMode && 'darkModeColor'}`}>scsdcsd</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="online_doors_body_new_card_terminal_right_bottom">

                            </div>
                        </div>
                    </div>

                    <div className={`online_doors_body_new_card ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                        <div className="online_doors_body_new_card_inner">
                            <img src={managmentImg}/>
                            <p className={`${isDarkMode && 'darkModeColor'}`}>{t("Iltimos eshikni tanlang")}</p>
                            <button onClick={openModalTerminal}>{t("Tanlash")}</button>
                        </div>
                    </div>
                    <div className={`online_doors_body_new_card ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                        <div className="online_doors_body_new_card_inner">
                            <img src={managmentImg}/>
                            <p className={`${isDarkMode && 'darkModeColor'}`}>{t("Iltimos eshikni tanlang")}</p>
                            <button onClick={openModalTerminal}>{t("Tanlash")}</button>
                        </div>
                    </div>
                    <div className={`online_doors_body_new_card ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                        <div className="online_doors_body_new_card_inner">
                            <img src={managmentImg}/>
                            <p className={`${isDarkMode && 'darkModeColor'}`}>{t("Iltimos eshikni tanlang")}</p>
                            <button onClick={openModalTerminal}>{t("Tanlash")}</button>
                        </div>
                    </div>

                </div>

            </div>

            <Modal
                isOpen={openTerModal}
                onRequestClose={openModalTerminal}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                {/*<div className="terminal_lists">*/}
                <div className={`terminal_lists ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                    <div className="terminal_lists_title">
                        <h2 className={`${isDarkMode && 'darkModeColor'}`}>{t("Terminallar ro'yxati")}</h2>
                    </div>
                    <div className="terminal_lists_body">

                        <div>
                            <div className="terminal_lists_body_inner">
                                <h2>Camera 1</h2>
                                <span>Chiqish</span>
                            </div>
                            <div className="terminal_lists_body_line"></div>
                        </div>
                        <div>
                            <div className="terminal_lists_body_inner">
                                <h2>Camera 1</h2>
                                <span>Chiqish</span>
                            </div>
                            <div className="terminal_lists_body_line"></div>
                        </div>
                        <div>
                            <div className="terminal_lists_body_inner">
                                <h2>Camera 1</h2>
                                <span>Chiqish</span>
                            </div>
                            <div className="terminal_lists_body_line"></div>
                        </div>
                        <div>
                            <div className="terminal_lists_body_inner">
                                <h2>Camera 1</h2>
                                <span>Chiqish</span>
                            </div>
                            <div className="terminal_lists_body_line"></div>
                        </div>

                    </div>
                </div>

                {/*<div className="terminal_lists_none">*/}
                {/*    <div className="terminal_lists_none_inner">*/}
                {/*        <img src={noneImg}/>*/}
                {/*        <h2>{t("Terminal mavjud emas")}</h2>*/}
                {/*        <p>{t("Iltimos tekshirib ko’ring")}</p>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </Modal>

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