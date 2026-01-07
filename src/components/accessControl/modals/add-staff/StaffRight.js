import React, { useState } from 'react';
import {message, Select} from 'antd';
import { ip } from '../../../../ip';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import { IoImageOutline } from 'react-icons/io5';
import loadingGif from '../../../../assets/gif/loading.gif';

import './staffRight.css';

const StaffRight = ({ data, setData, terminalIPList, staffTableIntialValues, imageState, setImageState }) => {

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data);
    const [view, setView] = useState(null)
    const [requestedImage, setRequestedImage] = useState(null)
    const [accessDoors, setAccessDoors] = useState('')
    const [loading, setLoading] = useState(false)

    // console.log(data)
    const upload = (e) => {
        setAccessDoors('')
        if(e.target.files && e.target.files[0]) {
            console.log('uploaded')
            setView(URL.createObjectURL(e.target.files[0]))
            setData({...data, image: e.target.files[0]})
            setImageState({
                initial: false,
                uploaded: true,
                requested: false
            })

        } else {
            setView(null)
            setImageState({
                initial: true,
                uploaded: false,
                requested: false
            })
        }
    }

    const onChangeImageSelect = (a) => {
        setAccessDoors(a)
    }


    const handleClickImageDownload = () => {
        setLoading(true)
        axios.post(`${ip}/access-control-service/api/terminal/capture/${accessDoors}`, {},
            { headers: {'x-access-token': localStorage.getItem('soft-ais-token')}}
        )
            .then(res => {
                setLoading(false)
                setRequestedImage(res.data)
                setData({...data, terminal_photo: res.data})
                setImageState({
                    initial: false,
                    uploaded: false,
                    requested: true
                })

            })
            .catch(err => {
                message.error(err?.response?.data?.msg)
                setLoading(false)
                setImageState({
                    initial: true,
                    uploaded: false,
                    requested: false
                })
            })
    }

    // console.log(imageState)

    return (
        <div className="access_control_add_staff_modal_body_item_middle">
            <div className={`access_control_add_staff_modal_body_item_middle_image ${isDarkMode && 'darkModeInputBackgraund'}`}>
                {
                    loading
                        ? <img src={loadingGif} alt='loading'/>
                        : (
                            staffTableIntialValues.edit
                                ? (imageState.initial
                                        ? <img src={`${ip}/access-control-service/${staffTableIntialValues.image}`} alt='initial'/>
                                        : (imageState.uploaded
                                            ? <img src={view} alt='view'/>
                                            : <img src={`${ip}/access-control-service/sign_up_request/${requestedImage}`} alt='requested'/>)
                                )
                                : (

                                    imageState.initial
                                        ?  <IoImageOutline size={75} color='#8E8E8E'/>
                                        : (imageState.uploaded
                                            ? <img src={view} alt='view'/>
                                            : <img src={`${ip}/access-control-service/sign_up_request/${requestedImage}`} alt='requested'/>)
                                )
                        )
                }

            </div>
            <label htmlFor='access_control_staff_image' className='access_control_add_staff_modal_body_item_middle_upload'>
                <FiUpload size={18} style={{marginRight: '7px'}}/>
                {t("Rasm yuklash")}
                <input onChange={upload} name='image' type="file" id="access_control_staff_image" style={{display: 'none'}} />
            </label>
            <div className='access_control_add_staff_modal_body_item_middle_download_wrapper'>
                <Select
                    size="large"
                    value={accessDoors}
                    onChange={onChangeImageSelect}
                    placeholder={t("Tanlash")}
                >
                    <Select.Option value="">{t("Tanlash")}</Select.Option>
                    {
                        terminalIPList.map((item, index) => (
                            <Select.Option key = {index} value={item.value}>{item.label}</Select.Option>
                        ))
                    }
                </Select>

                <button
                    type='button'
                    className='access_control_add_staff_modal_body_item_middle_download '
                    style={{cursor: `${accessDoors === '' || loading ? 'not-allowed' : 'pointer'}`,
                        color: `${accessDoors === '' || loading ? '#000':'#fff'}`,
                        backgroundColor: `${accessDoors === '' || loading ? '#bebebe':'#29B85D'}`
                }}
                    onClick={handleClickImageDownload}
                    disabled={accessDoors === '' || loading }
                >
                    {t("Rasm olish")}
                </button>

            </div>
        </div>
    )
};

export default StaffRight;


