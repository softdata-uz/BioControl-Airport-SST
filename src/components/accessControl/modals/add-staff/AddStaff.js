import React, { useEffect, useState } from "react";
import { ip } from "../../../../ip";
import {useTranslation} from "react-i18next";
import {Form, message, Space, Spin} from 'antd';
import Modal from "react-modal";
import axios from "axios";
import './addStaff.css';

import Left from "./Left";
import StaffRight from "./StaffRight";
import StaffMiddle from "./StaffMiddle";
import MiddleBottom from "./MiddleBottom";
import moment from "moment";
import {useSelector} from "react-redux";
import {BallTriangle, Circles} from "react-loader-spinner";
import dayjs from "dayjs";

Modal.setAppElement("#root");

function AddStaff(props) {

    const {
        isOpenAddStaff,
        setIsOpenAddStaff,
        staffTableIntialValues,
        setStaffTableIntialValues,
        staffPaginationCurrent,
        getStaffData,
        selectedCard,
        setSelectedCard,
        card,
        setCard,
        fingerPrint,
        setFingerPrint,
        editTitle,
        setTerminalIPList,
        terminalIPList,
        imageState,
        setImageState,
    } = props;



    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data)
    const [isOpenAddTerminal, setIsOpenAddTerminal] = useState(false);
    const [isOpenAddFingerprint,setIsOpenAddFingerprint] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${ip}/access-control-service/api/adduser/terminal`,
            {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(res => {
                const { data } = res;
                const newData = data.map(item => ({
                    label: item.door_name,
                    value: item.ip_address,
                    key: item.ip_address,
                }))
                setTerminalIPList(newData)
            })
            .catch(err => {
                // console.log(err?.response?.data)
                message.error(err?.response?.data.msg)
            })
    }, []);




    const [data, setData] = useState({
        fullname: '',
        gender: '',
        user_type: '',
        // tabel_number : '',
        department : '',
        rank: '',
        door_ip: [],
        access_type: '',
        valid_from_time: '',
        valid_to_time: '',
        work_time_schedule_id: '',
        image: '',
        notification: false,
        terminal_photo: '',
        work_time_to : '',
        work_time_from : ''
    });


    const [department, setDepartment]=useState([]);
    const [workTime, setWorkTime]=useState([]);

    const [departmentIndex, setDepartmentIndex]=useState(null);
    const [positionIndex, setPositionIndex]=useState(null);


    function getIndexById(array, id) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                return i;
            }
        }
        return -1;
    }
    const indexDepartment = getIndexById(department, staffTableIntialValues?.department[1]);
// const [indexDepartment , setIndexDepartment] = useState(null);
//     const optionsDoor = [];
    const [optionsDoor , setOptionsDoor] = useState([])
    const cancel = () => {
        setIsOpenAddStaff(!setIsOpenAddStaff);
        // setDepartment([]);
        setOptionsDoor([]);
        // optionsDoor.splice(0, data.length);
        setDepartmentIndex(null);
        setPositionIndex(null);
        // indexDepartment : '',
        setStaffTableIntialValues({
            id: '',
            fullname: '',
            // tabel_number : '',
            department : '',
            gender: '',
            user_type: '',
            rank: '',
            door_ip: [],
            access_type: '',
            valid_from_time: dayjs(),
            valid_to_time: dayjs().add(10, "year"),
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


    const onFinish = (value) => {
        // console.log(value)
        setLoading(true)
        const formData = {
            ...value,
            door_ip: staffTableIntialValues?.edit && optionsDoor.length === 0 ?
                JSON.stringify(staffTableIntialValues?.door_ip.map(item => item.value || item))
               : JSON.stringify(optionsDoor?.map(item => item.value || item)),

            department: department[departmentIndex]?.id ? department[departmentIndex]?.id : staffTableIntialValues?.department[1],
            rank: positionIndex !=null && departmentIndex == null ? department[indexDepartment]?.position[positionIndex]?.id :
               positionIndex !=null && departmentIndex !=null ? department[departmentIndex]?.position[positionIndex]?.id :
                   staffTableIntialValues?.rank[1],
            // staffTableIntialValues.image && data.image == '' ? staffTableIntialValues.image :
            image: staffTableIntialValues.image && data.image == '' ? staffTableIntialValues.image : data.image,
            terminal_photo: data.terminal_photo,
            notification: data.notification,
            id: data.id,
            valid_to_time: moment(value?.valid_to_time).format("YYYY-MM-DD"),
            valid_from_time: moment(value?.valid_from_time).format("YYYY-MM-DD"),
            work_time_to: moment(value?.work_time_to).format("HH:mm"),
            work_time_from: moment(value?.work_time_from).format("HH:mm"),
            // work_time_schedule_id: value?.work_time_schedule_id,
            fingerprint:  JSON.stringify(fingerPrint),
            cards: JSON.stringify(card),
        };

        const fd = new FormData();
        Object.keys(formData).forEach(i => fd.append(i, formData[i]));

        if (staffTableIntialValues.edit){
            axios.put(`${ip}/access-control-service/api/terminal/updateuser/${staffTableIntialValues.id}`,
                fd,
                { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(response =>{
                    setLoading(false)
                    cancel()
                    getStaffData(staffPaginationCurrent)
                    setSelectedCard([]);
                    setCard([]);
                    setImageState({
                        initial: true,
                        uploaded: false,
                        requested: false
                    })

                })
                .catch(err=>{
                    setLoading(false);
                    message.error(err?.response?.data?.msg)
                    // console.log(err?.response?.data)
                })
        }
        else {
            axios.post(`${ip}/access-control-service/api/terminal/adduser`,
                fd,
                {headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
            )
                .then(res => {
                    setLoading(false)
                    cancel()
                    getStaffData(staffPaginationCurrent)
                    setImageState({
                        initial: true,
                        uploaded: false,
                        requested: false
                    })

                })
                .catch(err => {
                    setLoading(false);
                    message.error(err?.response?.data?.msg)
                })
        }

    }

    const onFinishFailed = (error) => {
        // console.log(error)
    }


    return (
        <Modal
            isOpen={isOpenAddStaff}
            onRequestClose={() => setIsOpenAddStaff(false)}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={300}
            shouldCloseOnOverlayClick={false}
        >
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={staffTableIntialValues}
                    requiredMark = 'optional'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                {
                    loading &&
                    <div className="load">
                        <Circles
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                }
                <div className={`access_control_add_staff_modal ${isDarkMode && 'darkModeCard'}`}>
                    {editTitle?
                        <h1 className={`access_control_add_staff_modal_title ${isDarkMode && 'darkModeColor'}`}>
                            {t("Xodim ma'lumotlarini tahrirlash")}
                        </h1> :
                        <h1 className={`access_control_add_staff_modal_title ${isDarkMode && 'darkModeColor'}`}>
                            {t("Yangi foydalanuvchi qo'shish")}
                        </h1>
                    }

                    <hr className="access_control_add_staff_modal_subline" />
                    <div className="access_control_add_staff_modal_body">

                        <div className="access_control_add_staff_modal_body_item_1">
                            <div className="access_control_add_staff_modal_body_item">
                                <p className={`access_control_add_staff_modal_body_item_title ${isDarkMode && 'darkModeCard darkModeColor'}`}>
                                    {t("Ma'lumotlar")}
                                </p>
                                <Left
                                    terminalIPList = {terminalIPList}
                                    staffTableIntialValues={staffTableIntialValues}
                                    isOpenAddStaff={isOpenAddStaff}
                                    setStaffTableIntialValues={setStaffTableIntialValues}
                                    setDepartment={setDepartment}
                                    department={department}
                                    setDepartmentIndex={setDepartmentIndex}
                                    departmentIndex={departmentIndex}
                                    setPositionIndex={setPositionIndex}
                                    positionIndex={positionIndex}
                                    indexDepartment={indexDepartment}
                                    optionsDoor={optionsDoor}
                                    setOptionsDoor={setOptionsDoor}
                                    workTime={workTime}
                                    setWorkTime={setWorkTime}
                                />

                            </div>
                        </div>

                        <div className="access_control_add_staff_modal_body_item_2">
                            <div className="access_control_add_staff_modal_body_item">
                                <p className={`access_control_add_staff_modal_body_item_title ${isDarkMode && 'darkModeCard darkModeColor'}`}>
                                    {t("ID karta")}
                                </p>
                                <StaffMiddle
                                    staffTableIntialValues={staffTableIntialValues}
                                    card={card}
                                    setCard={setCard}
                                    isOpenAddTerminal={isOpenAddTerminal}
                                    setIsOpenAddTerminal={setIsOpenAddTerminal}
                                    selectedCard={selectedCard}
                                    setSelectedCard={setSelectedCard}
                                />
                            </div>
                            <div className="access_control_add_staff_modal_body_item">
                                <p className={`access_control_add_staff_modal_body_item_title ${isDarkMode && 'darkModeCard darkModeColor'}`}>
                                    {t("Barmoq izi")}
                                </p>
                                <MiddleBottom
                                    terminalIPList={terminalIPList}
                                    fingerPrint={fingerPrint}
                                    setFingerPrint={setFingerPrint}
                                    isOpenAddFingerprint={isOpenAddFingerprint}
                                    setIsOpenAddFingerprint={setIsOpenAddFingerprint}
                                    staffTableIntialValues={staffTableIntialValues}
                                />
                            </div>
                        </div>

                        <div className="access_control_add_staff_modal_body_item">
                            <p className={`access_control_add_staff_modal_body_item_title ${isDarkMode && 'darkModeCard darkModeColor'}`}>
                                {t("Yuzni aniqlash")}
                            </p>
                            <StaffRight
                                staffTableIntialValues={staffTableIntialValues}
                                data = {data}
                                setData = {setData}
                                terminalIPList = {terminalIPList}
                                imageState={imageState}
                                setImageState={setImageState}
                            />
                            <div className="staff_buttons">
                                <button type="button" onClick={cancel} className="addStaff_cancel_button">{t("Bekor qilish")}</button>
                                <button className="access_control_add_staff_modal_body_item_3_submit_button" type="submit">
                                    {t("Saqlash")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}

export default AddStaff

