import React, {useEffect, useState} from 'react';
import {Form, Input, Layout, Menu, message, Popover, Tooltip} from 'antd';
import Switch from "react-switch"
import {BrowserRouter, Link} from 'react-router-dom'
import {DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getTheme, isRefresh} from "../../redux";
import {ip} from "../../ip";
import RootPage from '../../pages/root';
import useWindowDimensions from '../../hooks/hooks';
import 'antd/dist/antd.css';

import logo_light from '../../images/logo_light.svg';
import logo_dark_new from '../../images/logoNew/Biocontrol white.svg';
import logo_dark from '../../images/logodar.svg';
import logo_light_new from '../../images/logoNew/Biocontrol black.svg';
import shortlogo from '../../images/dashIcons/short_logo.svg';
import shortlogo_new from '../../images/logoNew/FAVICON.svg';
import shortlogo_dark from '../../images/dashIcons/shortlogo_dark.svg';
import tableImg from '../../images/dashIcons/table.svg';
import tableImg_dark from '../../images/dashIcons/table_dark.svg';
import setting from '../../images/parkingModul/tabler-icon-settings-2.svg';
import setting_dark from '../../images/dashIcons/settings_dark.svg';

import doorKey from '../../images/dashIcons/doors.svg';
import doorKey_dark from '../../images/dashIcons/doors_dark.svg';
import {BsFillCloudMoonFill} from "react-icons/bs";
import {WiSunrise} from "react-icons/wi";

import dashboardIconDark from '../../images/dashboard/dashboardIcon.svg';
import dashboardIcon from '../../images/metroBiocontrol/dashI.svg';
import users from '../../images/metroBiocontrol/users.svg';

import structureNewDark from '../../images/metroBiocontrol/diagram-subtask.svg';
import reportNew from '../../images/metroBiocontrol/tabler-icon-file-description (1).svg';
import reportNewDark from '../../images/metroBiocontrol/tabler-icon-file-description (2).svg';
import adminIcon from '../../images/metroBiocontrol/admin.svg';


import modalImg from '../../images/gallery-add.png';

import './style.css';
import {FaEdit} from "react-icons/fa";
import {MdExitToApp} from "react-icons/md";
import axios from "axios";
import Modal from "react-modal";
import {CiImageOn} from "react-icons/ci";
import {storage} from "../../services";
import {LoginFailure} from "../../redux/action/action";

const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu;

const Saidbar = () => {
    const user = storage.local.get("user");

    const {t, i18n} = useTranslation();
    const [lang, setLang] = useState(localStorage.getItem('i18nextLng') || 'uz')
    const [openKeys, setOpenKeys] = React.useState(['sub1']);

    const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'sub8', 'sub9',];

    const {width} = useWindowDimensions();
    const sidebarWidth = width < 1370 ? 200 : 300;
    const isDarkMode = useSelector(state => state.theme.theme_data);

    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState(["3"]);


    const [open, setOpen] = useState(false);
    const [openPopover, setOpenPopover] = useState(false);
    const [loading, setLoading] = useState(false);
    // img
    const [view, setView] = useState(null);
    const [imageState, setImageState] = useState({
        initial: true,
        uploaded: false,
        requested: false,
        check: false
    });
    const [img, setImg] = useState({});

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const handleChangeTheme = (state) => {
        dispatch(getTheme(state))
    }

    const handleClickListItem = (title, id) => {
        // setCheckedItemTitle(title)
        dispatch(isRefresh(id));
        localStorage.setItem('selected-id', JSON.stringify([`${id}`]));
        setSelectedKey([`${id}`]);
    }

    const selectKey = JSON.parse(localStorage.getItem('selected-id'));


    const onOpenChange = keys => {


        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
            localStorage.setItem('keys', JSON.stringify(keys));
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            localStorage.setItem('keys', JSON.stringify(latestOpenKey ? [latestOpenKey] : []));
        }
    };
    const openKeysLocal = JSON.parse(localStorage.getItem('keys'));

    useEffect(() => {

    }, [openKeys , openKeysLocal]);

    const onChangeLanguage = (event) => {
        const lang = event
        setLang(lang)
        i18n.changeLanguage(lang)
        localStorage.setItem('i18nextLng', lang)
    }

    // ----admin--
    const hide = () => {
        setOpenPopover(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpenPopover(newOpen);
    };
    const openChangeAdmin = () => {
        setOpen(true);
        hide();
    }

    const addStaff = (values) => {
        setLoading(true)
        const formData = {
            lastname: values?.lastname,
            firstname: values?.firstname,
            fathersname: values?.fathersname,
            login: values?.login,
            password: values?.password,
            old_password: values?.old_password,
            image: imageState.uploaded ? img.image : user ? user?.image : "",
        }
        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));
        axios.put(`${ip}/api/edit/admin/${user?.id}`,
            fd,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}})
            .then((res) => {
                axios.get(`${ip}/api/me`,
                    {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
                )
                    .then((res2) => {
                        setLoading(false);
                        cancel();
                        message.success(t("Admin ma'lumotlari o'zgartirildi"), 5);
                    })
                    .catch((error) => {

                    })
            })
            .catch(err => {
                    message.error(err?.response?.data.msg);
                    setLoading(false)
                }
            )
    }
    const onFinishFailed = (error) => {
        console.log(error);
    }



    const upload = (e) => {
        if (e.target.files && e.target.files[0]) {
            console.log('uploaded')
            setView(URL.createObjectURL(e.target.files[0]))
            setImg({...img, image: e.target.files[0]})
            setImageState({
                initial: false,
                uploaded: true,
                requested: false,
                check: true
            })
        } else {
            setView(null)
            setImageState({
                initial: true,
                uploaded: false,
                requested: false,
                check: false
            })
        }
    }
    // img
    const cancel = () => {
        setOpen(!open);
        setImageState({
            initial: true,
            uploaded: false,
            requested: false,
            check: false
        });
    }




    const LogoComponent = () => {
        return (
            <div className="dashboard">
                {
                    collapsed ? <p className={`saidbar_title  ${isDarkMode && 'darkModeColor'}`}>{t('dashboard')}</p> :
                        <p className={`saidbar_title  ${isDarkMode && 'darkModeColor'}`}>{t('dashboard')}</p>
                }
            </div>
        )
    }

    const logout = () => {
        dispatch(LoginFailure());
        localStorage.removeItem('soft-ais-token');
    }

    return (
        <BrowserRouter>
            <Layout style={{height: '100vh'}}>
                <Sider
                    width={sidebarWidth}
                    theme={isDarkMode ? 'dark' : 'light'}
                    className={`siderBackColor ${isDarkMode && 'darkModeBackground'}`}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}>
                    <div className="logo">
                        {
                            collapsed ?
                                (!isDarkMode ? <img className="short_logo" src={shortlogo_new} alt=""/> :
                                    <img className="short_logo" src={shortlogo_new} alt=""/>) :
                                (!isDarkMode ? <img className="logo_img " src={logo_light_new} alt=""/> :
                                    <img className="logo_img " src={logo_dark_new} alt=""/>)
                        }
                    </div>

                    <Menu
                        theme={isDarkMode ? 'dark' : 'light'}
                        className={`siderBackColor_menu ${isDarkMode && 'darkModeBackground'}`}
                        onOpenChange={onOpenChange}
                        openKeys={openKeysLocal}
                        mode="inline"
                        defaultSelectedKeys={selectKey}
                        defaultOpenKeys={openKeysLocal}
                    >
                        <LogoComponent/>
                        <SubMenu key="sub1" icon={isDarkMode ? <img className="IconsLight" src={dashboardIcon} alt=""/> :
                            <img src={dashboardIcon} alt=""/>}
                                 title={<Tooltip color={'cyan'} title={t("dashboard")}>
                                     {t("dashboard")}</Tooltip>}
                        >
                            {/*<Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                            {/*           onClick={() => handleClickListItem('Access Control', 2)}*/}
                            {/*           key="2"*/}
                            {/*           // icon={!isDarkMode ? <img src={dashboardIcon} alt=""/> : <img src={dashboardIconDark} alt=""/>}*/}
                            {/*>*/}
                            {/*    <Link to="/access-control-dashboard">*/}
                            {/*        {t("dashboard")}*/}
                            {/*    </Link>*/}
                            {/*</Menu.Item>*/}
                            <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                       onClick={() => handleClickListItem('Access Control', 3)}
                                       key="3"
                                       // icon={!isDarkMode ? <img src={tableImg} alt=""/> : <img src={tableImg_dark} alt=""/>}
                            >

                                <Link to="/access-control-search">
                                    {t('Jadval')}
                                </Link>
                            </Menu.Item>
                            <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                       onClick={() => handleClickListItem('Access Control Online Doors', 4)} key="4"
                                       // icon={!isDarkMode ? <img src={doorKey_dark} alt=""/> : <img src={doorKey} alt=""/>}
                            >
                                <Link to="/access-control-online-doors">
                                    {t('Eshiklar boshqaruvi')}
                                </Link>
                            </Menu.Item>


                              <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                       onClick={() => handleClickListItem('Working Hour Report', 20)}
                                       key="20"
                                       // icon={!isDarkMode ? <img src={reportNewDark} alt=""/> : <img src={reportNew} alt=""/>}
                            >
                                <Link to="/access-control-report">
                                    {t("Hisobot")}
                                </Link>
                            </Menu.Item>

                            {user?.role === "observer" ? "" :
                                <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                                                         onClick={() => handleClickListItem('Access Control', 6)}
                                                                         key="6"
                                                                         // icon={!isDarkMode ? <img src={setting_dark} alt=""/> : <img src={setting} alt=""/>}
                            >
                                <Link to="/access-control-setting">
                                    {t('Sozlamalar')}
                                </Link>
                            </Menu.Item>}
                        </SubMenu>


                        {/*{user?.role === "observer" ? "" : <SubMenu key="sub2" icon={isDarkMode ? <img className="IconsLight" src={users} alt=""/> :*/}
                        {/*    <img src={users} alt=""/>}*/}
                        {/*                                           title={<Tooltip color={'cyan'} title={t('Kadrlarni boshqarish')}>*/}
                        {/*                                               {t('Kadrlarni boshqarish')}</Tooltip>}*/}
                        {/*>*/}

                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('Access Control', 7)}*/}
                        {/*               key="7">*/}
                        {/*        <Link to="/employees_list">*/}
                        {/*            {t('Xodimlar ro‘yxati')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('recruiting', 8)}*/}
                        {/*               key="8">*/}
                        {/*        <Link to="/hiring-an-employee">*/}
                        {/*            {t('Xodimni ishga qabul qilish')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('Access Control', 9)}*/}
                        {/*               key="9">*/}
                        {/*        <Link to="/dismissal-an-employee">*/}
                        {/*            {t('Xodimni ishdan bo‘shatish')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('Access Control', 10)}*/}
                        {/*               key="10">*/}
                        {/*        <Link to="/change-position-employee">*/}
                        {/*            {t('Xodim lavozimini o’zgartirish')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('Access Control', 11)}*/}
                        {/*               key="11">*/}
                        {/*        <Link to="/working-contract">*/}
                        {/*            {t('Mehnat shartnomasi')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('Access Control', 12)}*/}
                        {/*               key="12">*/}
                        {/*        <Link to="/providing_information">*/}
                        {/*            {t('Ma’lumotnoma berish')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*    <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                        {/*               onClick={() => handleClickListItem('Access Control', 13)}*/}
                        {/*               key="13">*/}
                        {/*        <Link to="/working-holiday">*/}
                        {/*            {t('Mehnat ta’tili')}*/}
                        {/*        </Link>*/}
                        {/*    </Menu.Item>*/}
                        {/*</SubMenu>}*/}

                        {user?.role === "observer" || user.role === 'operator' ? "" :
                            <SubMenu key="sub3" icon={
                            isDarkMode ? <img className="IconsLight" src={structureNewDark} alt=""/> :
                                <img src={structureNewDark} alt=""/>
                        }
                                                                   title={<Tooltip color={'cyan'} title={t('Tashkilot tuzilmasi')}>
                                                                       {t('Tashkilot tuzilmasi')}</Tooltip>}
                        >

                            <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                       onClick={() => handleClickListItem('Access Control', 14)}
                                       key="14">
                                <Link to="/organization-enterprise">
                                    {t('Tashkilot (korxona)')}
                                </Link>
                            </Menu.Item>
                            <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                       onClick={() => handleClickListItem('Access Control', 15)}
                                       key="15">
                                <Link to="/department-network">
                                    {t("Bo'lim")}
                                </Link>
                            </Menu.Item>
                            {/*<Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                            {/*           onClick={() => handleClickListItem('Access Control', 16)}*/}
                            {/*           key="16">*/}
                            {/*    <Link to="/network">*/}
                            {/*        {t('Tarmoq')}*/}
                            {/*    </Link>*/}
                            {/*</Menu.Item>*/}
                            <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                       onClick={() => handleClickListItem('Access Control', 17)}
                                       key="17">
                                <Link to="/category-and-position">
                                    {t('Lavozimi')}
                                </Link>
                            </Menu.Item>

                            {/*<Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}*/}
                            {/*           onClick={() => handleClickListItem('Access Control', 18)}*/}
                            {/*           key="18">*/}
                            {/*    <Link to="/working-time-table">*/}
                            {/*        {t('Ish vaqti jadvali')}*/}
                            {/*    </Link>*/}
                            {/*</Menu.Item>*/}
                        </SubMenu>}

                        { user.role === 'operator' || user.role === 'observer' || user.role === 'admin' ? "" :
                            <SubMenu key="sub4" icon={
                                isDarkMode ? <img className="IconsLight" src={adminIcon} alt=""/> :
                                    <img src={adminIcon} alt=""/>
                            }
                                     title={<Tooltip color={'cyan'} title={t('Adminlar')}>
                                         {t('Adminlar')}</Tooltip>}
                            >
                                <Menu.Item className={`saidbar_link ${isDarkMode && 'darkModeBackground'}`}
                                           onClick={() => handleClickListItem('Access Control', 19)}
                                           key="19">
                                    <Link to="/admins">
                                        {t('Adminlar')}
                                    </Link>
                                </Menu.Item>

                            </SubMenu>
                        }

                    </Menu>

                    {
                        !collapsed ?
                            <div className="created_by">
                                <p className={`${isDarkMode && 'darkModeBackground'}`}>Powered by</p>
                                {
                                    !isDarkMode ? <img className="created_by_logo" src={logo_light} alt=""/> :
                                        <img className="created_by_logo" src={logo_dark} alt=""/>
                                }
                            </div>
                            :
                            <div className="created_by_middle">
                                {
                                    !isDarkMode ? <img className="created_by_logo" src={shortlogo} alt=""/> :
                                        <img className="created_by_logo" src={shortlogo_dark} alt=""/>
                                }
                            </div>
                    }

                </Sider>


                <Layout className={`site-layout ${isDarkMode && 'darkModeLayautBg'} `}>
                    <Header theme={isDarkMode ? 'dark' : 'light'}
                            className={`site-layout-background headerr ${isDarkMode && 'darkModeBackground'} `}
                            style={{padding: 0}}>
                        <div className={`saidbar_toggle ${isDarkMode && 'darkModeColor'}`}>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: toggle,
                            })}
                        </div>
                        <div className="header_navbar">
                            <div className="header_right">
                                {/*<div className="language" style={{marginRight: '15px'}}>*/}
                                {/*    <select className='lang_dropdown' onChange={onChangeLanguage} defaultValue={lang}>*/}
                                {/*        <option defaultValue="uz" value="uz">O'zbekcha</option>*/}
                                {/*        <option value="ru">Русский</option>*/}
                                {/*        <option value="en">English</option>*/}
                                {/*    </select>*/}
                                {/*</div>*/}
                                <div className="languages">
                                    <div className={lang == "uz" ? "languages_item languages_item_active" : "languages_item"} onClick={()=>onChangeLanguage('uz')}>
                                        Ўз
                                    </div>
                                    <div className={lang == "ru" ? "languages_item languages_item_active" : "languages_item"} onClick={()=>onChangeLanguage('ru')}>
                                        Ру
                                    </div>
                                    <div className={lang == "en" ? "languages_item languages_item_active" : "languages_item"} onClick={()=>onChangeLanguage('en')}>
                                        En
                                    </div>
                                </div>

                                <Switch
                                    onChange={handleChangeTheme}
                                    checked={isDarkMode}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    offColor="#F7F7F7"
                                    onColor="#343D50"
                                    checkedHandleIcon={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                fontSize: 15,
                                                paddingRight: 2
                                            }}
                                        >
                                            <BsFillCloudMoonFill/>
                                        </div>
                                    }
                                    uncheckedHandleIcon={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                height: "100%",
                                                fontSize: 20,
                                                color: "orange",
                                            }}
                                        >
                                            <WiSunrise/>
                                        </div>
                                    }
                                />


                                <Popover
                                    open={openPopover}
                                    onOpenChange={handleOpenChange}
                                    content={<div className="contentHeader">
                                        <div className="contentHeader_inner" onClick={openChangeAdmin}>
                                            <FaEdit/>
                                            <p>{t("Tahrirlash")}</p></div>
                                        <div className="contentHeader_inner" onClick={logout}>
                                            <MdExitToApp/>
                                            <p>
                                                {t("Chiqish")}
                                            </p>
                                        </div>
                                    </div>} trigger="click" placement="leftBottom">
                                    <div className="monitoring_header_user">
                                        <img src={`${ip}/${user?.image}`}/>
                                        <p>{user?.lastname + " " + user?.firstname + " " + user?.fathersname}</p>
                                        <DownOutlined/>
                                    </div>
                                </Popover>
                            </div>
                        </div>
                    </Header>

                    <Content className={`site-layout-background ${isDarkMode && 'darkModeBackground'}`}>
                        <div className={`content_bottom ${isDarkMode && 'darkModeLayautBg'}`}>
                            <RootPage user={user}/>
                        </div>
                    </Content>
                </Layout>
            </Layout>

            <Modal
                isOpen={open}
                onRequestClose={cancel}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    requiredMark='optional'
                    onFinish={addStaff}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={user}
                >
                    <div className="admin_modal">
                        <div className="admin_modal_head">
                            <h2>{t("Admin ma'lumotlarini o'zgartirish")}</h2>
                        </div>
                        <div className="admin_modal_uploadImg">
                            <div className="admin_modal_uploadImg_left">
                                <div className="admin_modal_uploadImg_left_inner">
                                    {user && !imageState.check ?
                                        <img src={`${ip}/${user?.image}`} className="img1"/> : imageState.uploaded ?
                                            <img src={view} className="img1"/> : <img src={modalImg} className="img2"/>}
                                </div>
                            </div>
                            <div className="admin_modal_uploadImg_right">
                                <div className="admin_modal_uploadImg_right_inner">
                                    <label htmlFor='add_staff_img' className="upload_button">
                                        <div className="upload_button_icon">
                                            {/*<img src={UploadIcon} style={{marginRight: "8px"}}/>*/}
                                            <CiImageOn size={22} style={{marginRight: "8px"}}/>
                                            {t("Rasm yuklash")}
                                        </div>
                                        <input onChange={upload} name='image' type="file"
                                               id="add_staff_img"
                                               style={{display: 'none'}}
                                               className=""
                                        />
                                    </label>
                                    <div className="upload_button_text">
                                        <span>{t("Maksimal fayl hajmi 1 Mb 500х500 o'lchamda")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admin_modal_form">

                            <div className="admin_modal_form_input">
                                <span>{t("Familiya")}</span>
                                <Form.Item name="lastname" rules={[{
                                    required: true, message: t("Familiyani kiriting")
                                }]}>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                            <div className="admin_modal_form_input">
                                <span>{t("Ism")}</span>
                                <Form.Item name="firstname" rules={[{
                                    required: true, message: t("Ism kiriting")
                                }]}>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>

                        </div>

                        <div className="admin_modal_form_one">
                            <div className="admin_modal_form_input">
                                <span>{t("Otasining ismi")}</span>
                                <Form.Item name="fathersname" rules={[{
                                    required: true, message: "Otasining ismini kiriting"
                                }]}>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                        </div>


                        <div className="admin_modal_form" style={{marginTop: "0"}}>
                            <div className="admin_modal_form_input">
                                <span>{t("Login")}</span>
                                <Form.Item name="login" rules={[{
                                    required: true, message: t("Login kiriting")
                                }]}>
                                    <Input placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>
                            <div className="admin_modal_form_input">
                                <span>{t("Parol")}</span>
                                <Form.Item name="old_password" rules={[{
                                    required: true, message: t("Parol kiriting")
                                }]} type="password">
                                    {/*<Input placeholder="Kiriting"/>*/}
                                    <Input.Password placeholder={t("Kiriting")}/>
                                </Form.Item>
                            </div>

                            <div className="admin_modal_form_input">
                                <span>{t("Yangi parol")}</span>
                                <Form.Item
                                    name="password"
                                    rules={[{
                                        required: true, message: t("Yangi parolni kiriting"),
                                    },]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder={t("Kiriting")}/>
                                </Form.Item>


                            </div>

                            <div className="admin_modal_form_input">
                                <span>{t("Yangi parolni tasdiqlash")}</span>
                                <Form.Item
                                    name="confirm_password"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[{
                                        required: true, message: t("Tasdiqlash parolini kiriting"),
                                    }, ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t("Parol noto'g'ri kiritildi!")));
                                        },
                                    }),]}
                                >
                                    <Input.Password placeholder={"Kiriting"}/>
                                </Form.Item>
                            </div>

                        </div>
                        <div className="admin_modal_form_buttons">
                            <div className="admin_modal_form_buttons_one">
                                <button type="button" className="admin_modal_form_buttons_left"
                                        onClick={() => cancel()}>{t("Bekor qilish")}
                                </button>
                            </div>
                            <div>
                                <button type="submit" className="admin_modal_form_buttons_right">{t("Saqlash")}</button>
                            </div>
                        </div>

                    </div>
                </Form>
            </Modal>

        </BrowserRouter>
    );
};


export default Saidbar;

