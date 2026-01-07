import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MdAdd, MdOutlineAddCircleOutline,} from "react-icons/md";
import {Form, Tabs, message} from "antd";
import {ip} from "../../../ip";

import CameraTable from "./table/CameraTable";
import AddCameraModal, {InputStyles} from "./AddCameraModal/AddCameraModal";
import AddNewGroupTable from "./AddNewGroup/AddNewGroupTable";
import AddNewGroup from "./AddNewGroup/AddNewGroup";
import CameraPagenation from "./pagenation/CameraPagenation";

import axios from "axios";
import './faceSetting.css';
import {AiOutlineDelete} from "react-icons/ai";


const {TabPane} = Tabs;


const FaceControlSetting = () => {
    const [messageApi, contextHolder] = message.useMessage();


    const isDarkMode = useSelector(state => state.theme.theme_data)
    const is_refresh_value = useSelector(state => state.theme.is_refresh_value)
    const {t} = useTranslation()
    const navigate = useNavigate()
    // add camera modal state
    const [isOpenAddCamera, setIsOpenAddCamera] = useState(false);

    // camera initial values
    const [cameraIntialValues, setCameraInitialValues] = useState({
        name_uz: '',
        name_ru: '',
        name_en: '',
        type: '',
        group_id: '',
        ip_address: '',
        username: '',
        password: '',
        channel: '',
    })

    // group initial values
    const [groupIntialValues, setGroupInitialValues] = useState({
        name_uz: '',
        name_ru: '',
        name_en: '',
    })


    // delete button
    const [deleteCamera, setDeleteCamera] = useState([])
    const [deleteGroup, setDeleteGroup] = useState([])


    const [cameraPaginationLimit, setCameraPaginationLimit] = useState(15);
    const [cameraPaginationCurrent, setCameraPaginationCurrent] = useState(1);
    const [cameraTotal, setCameraTotal] = useState(null);
    const [show, setShow] = useState(false);
    const [languageGroup, setLanguageGroup] = useState([{}]);

    const [cameraData, setCameraData] = useState([]);

    const [state, setState] = useState({selectedRowKeys: []})
    const onSelectChange = (selectedRowKeys, a) => {
        setState({selectedRowKeys})
        setDeleteCamera(a.map(item => item.id));
    };

    const {selectedRowKeys} = state;

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const getCameraData = async (id) => {
        const response = await axios.get(`${ip}/face-detection-service/api/cameras/${cameraPaginationLimit}/${id}`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const count = data && data.count;
        setCameraTotal(count)
        const newData = data && data.data && data.data.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * cameraPaginationLimit,
                name_uz: item.name_uz,
                name_ru: item.name_ru,
                name_en: item.name_en,
                type: item.type,
                group_name_uz: item.group_name_uz,
                group_name_ru: item.group_name_ru,
                group_name_en: item.group_name_en,
                ip_address: item.ip_address,
                username: item.username,
                password: item.password,
                channel: item.channel
            }
        ))
        setCameraData(newData)
    }

    // console.log(cameraData[0]?.name)

    const addCamera = () => {
        setIsOpenAddCamera(true)
    }

    const handleDeleteCamera = () => {
        axios.delete(`${ip}/face-detection-service/api/camera/delete`,
            {
                data: deleteCamera,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
            .then(res => {
                getCameraData(cameraPaginationCurrent);
                setState({selectedRowsKeys: []})
                setDeleteCamera([])
            })
            .catch(err => {
                // console.log(err?.response?.data)
            })
    }

    const onChangeTabs = (key) => {
        // console.log(key);
    }

    const getCameraGroup = async () => {
        const response = await axios.get(`${ip}/face-detection-service/api/camera_group`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        const {data} = response;
        const newData = data && data.map((item, index) => (
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
        axios.delete(`${ip}/face-detection-service/api/camera_group/delete`,
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


    const [defValue, setDefValue] = useState("")
    const [botInitialValue, setBotInitialValue] = useState({token: ""})
    
    useEffect(() => {
        axios.get(`${ip}/face-detection-service/api/variables/token`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
        )
            .then((res) => {
                // console.log(res?.data[0]?.token);
                setDefValue(res?.data[0]?.token)
                setBotInitialValue({
                    token: res?.data[0]?.token
                })
            })
    }, []);

    const onFinish = (values) => {
        axios.put(`${ip}/face-detection-service/api/variables/token`,
            {
                ...values,
            },
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
            .then((res)=>{
                // console.log(res)
                messageApi.open({
                    type: 'success',
                    content: res?.data?.msg
                });
            })
            .catch((error)=>{

            })

        // console.log(values)
    }
    const onFinishFailed = (e) => {
        // console.log(e)
    }


    const cameraPaginationOnChange = (e = 1, option) => {
        getCameraData(e)
        setCameraPaginationCurrent(e)
        setCameraPaginationLimit(option)
    }


    useEffect(() => {
        getCameraData(cameraPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cameraPaginationLimit, cameraPaginationCurrent,])

    useEffect(() => {
        getCameraGroup()
        // if (!is_refresh_value) {
        //     navigate('/face-control-search')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="face_control_setting">
            <div className='face_control_setting_header'>
                <div className="face_content_top">
                    <p className={`Content_title ${isDarkMode && 'darkModeColor'}`}>{t("Yuzni aniqlash sozlamalar")}</p>
                </div>
            </div>

            <div className={`face_control_setting_body ${isDarkMode && 'darkModeBackground '}`}>
                <Tabs onChange={onChangeTabs} type="card" defaultActiveKey="1">
                    <TabPane tab={t("Kamera parametrlari")} key="1">
                        <div className="face_control_setting_tab">

                            <div className='face_control_setting_tab_item'>
                                <AddCameraModal
                                    isOpenAddCamera={isOpenAddCamera}
                                    setIsOpenAddCamera={setIsOpenAddCamera}
                                    cameraIntialValues={cameraIntialValues}
                                    setCameraInitialValues={setCameraInitialValues}
                                    getCameraData={getCameraData}
                                    cameraPaginationCurrent={cameraPaginationCurrent}
                                />

                                <div className='face_control_setting_tab_item_body'>
                                    <div className="camera_table_group">
                                        <CameraTable
                                            cameraData={cameraData}
                                            setIsOpenAddCamera={setIsOpenAddCamera}
                                            setDeleteCamera={setDeleteCamera}
                                            setCameraInitialValues={setCameraInitialValues}
                                            rowSelection={rowSelection}

                                        />
                                    </div>
                                </div>
                                <div className='face_control_setting_tab_item_footer'>
                                    <div className="face_control_setting_tab_item_footer_buttons">
                                        <button onClick={addCamera} className='face_control_setting_button'>
                                            <MdOutlineAddCircleOutline size={24} style={{marginRight: '5px'}}/>
                                            {t("Kamera qo‘shish")}
                                        </button>
                                        {
                                            deleteCamera.length > 0 &&
                                            <button onClick={handleDeleteCamera}
                                                    className="face_control_setting_footer_delite_button">
                                                <AiOutlineDelete size={22}/>
                                                {t("O’chirish")}
                                            </button>
                                        }
                                    </div>
                                    <CameraPagenation
                                        faceTablePaginationLimit={cameraPaginationLimit}
                                        faceTablePaginationCurrent={cameraPaginationCurrent}
                                        faceTablePaginationOnChange={cameraPaginationOnChange}
                                        faceTableTotal={cameraTotal}
                                    />
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
                                                            {t("Guruh qo'shish")}
                                                        </button>
                                                }
                                            </div>
                                            :
                                            <AddNewGroup
                                                groupIntialValues={groupIntialValues}
                                                setGroupInitialValues={setGroupInitialValues}
                                                show={show}
                                                setShow={setShow}
                                                cameraPaginationCurrent={cameraPaginationCurrent}
                                                getCameraGroup={getCameraGroup}
                                                languageGroup={languageGroup}
                                            />
                                    }
                                </div>

                            </div>
                        </div>
                    </TabPane>

                    <TabPane tab={t("Telegram bot")} key="2">
                        <div className="Telegram_bot_tab">
                            <Form
                                name="basic"
                                layout="vertical"
                                initialValues={botInitialValue}
                                requiredMark='optional'
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >

                                <div className="Telegram_bot_tab_inner">
                                    <div className="Telegram_bot_tab_inner_form">
                                        <Form.Item
                                            className="settings_modal_input_label"
                                            label={t("Telegram bot")}
                                            name="token"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: t("Token kiriting!"),
                                                },
                                            ]}
                                        >
                                            <InputStyles
                                                className={`settings_modal_input ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                                placeholder={t("Kiritish")}
                                                style={{borderRadius: '5px'}}
                                                defaultValue={defValue}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="telegram_bot_search_button">
                                        <button type="submit" className="add_camera_buttons_save">{t("Saqlash")}</button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default FaceControlSetting;