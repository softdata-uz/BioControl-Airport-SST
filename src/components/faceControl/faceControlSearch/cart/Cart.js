import React, {useState} from 'react';
import {ip} from '../../../../ip';
import {useTranslation} from "react-i18next";
import {Alert, Space, message, Spin, Tooltip} from "antd";
import {emojes} from '../../../../assets/face-icons/icons';
import {BsPlayBtn} from 'react-icons/bs'

import moment from "moment";
import axios from 'axios';
import ImageDemo from "./image";
import "./cart.css";
import ReactPlayer from "../videoModal/ReactPlayer";


const Cart = ({item, isDarkMode}) => {

    const {t} = useTranslation()
    const lang = localStorage.getItem('i18nextLng') || 'uz'

    const mood = ["",
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Tabassum')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Tabassum')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Jahldor')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Jahldor')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Xafa')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Xafa')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Jirkangan')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Jirkangan')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Qo’rqqan')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Qo’rqqan')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Hayratda')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Hayratda')}</p>
            </Tooltip>
        </div>,
        <div className={`card_longTitle ${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('E’tiborsiz')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle"> {t('E’tiborsiz')}</p>
            </Tooltip>
        </div>,

        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Kulgan')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle"> {t('Kulgan')}</p>
            </Tooltip>
        </div>,
        "",
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Xursand')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Xursand')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Ikkilangan')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle">{t('Ikkilangan')}</p>
            </Tooltip>
        </div>,
        <div className={`${isDarkMode && 'darkModeColor'}`}>
            <Tooltip title={t('Baqirgan')} color={'cyan'} className={`${isDarkMode && 'darkModeColor'}`}>
                <p className="card_longTitle"> {t('Baqirgan')}</p>
            </Tooltip>
        </div>
    ]

    const [loading, setLoading] = useState(false)
    const [cardAlert, setCardAlert] = useState('')
    // console.log(item);

    const handleClickVideoPlay = (id, ip_address) => {
        setLoading(true)
        axios.get(`${ip}/face-detection-service/api/face/video/${ip_address}/${id}`,
            {
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            }
            )
            .then(res => {
                const {data} = res;
                // console.log("data = ", data);
                setLoading(false);
                window.open(`${ip}/face-detection-service/anhor_camera_video/${id}.h264`, '_blank', 'noopener,noreferrer');
            })
            .catch(err => {
                console.log("err = ", err?.response?.data);
                message.error(err?.response?.data[lang]);
                // setCardAlert(err?.response?.data[lang])
                setLoading(false)
                // alert(err?.response?.data[lang]);
            })
    }

    // video player
    const [openPlayer, setOpenPlayer] = useState(false);
    const [filename, setFilename] = useState('');
    const [videoSec , setVideoSec] = useState(10);
    const [id , setId] = useState(null);
    const onOpenModalPlayer = (item) => {
        setOpenPlayer(!openPlayer);
        setId(item)
        axios.get(`${ip}/face-detection-service/api/video/face/${videoSec}/${item?.id}`)
            .then((res) => {
                // console.log(res);
                setFilename(res.data.filename);
            })
    };

    // video player

    return (
        <>
            <div className={`j_card ${isDarkMode && 'darkModeCard darkModeBorder'}`}>
                <div className="j_cardInfo">
                    <div className="j_cardInfoTop">
                        <div className="j_cardInfoTopLeft">
                            {
                                loading ?
                                    <div className='face-control-video-block_loading'>
                                        <Spin style={{marginTop: 3}} size="middle"/>
                                    </div>
                                    :
                                    // <div onClick={() => handleClickVideoPlay(item.id, item.ip_address)}
                                    //      className='face-control-video-block'>
                                    //     <BsPlayBtn color='#fff' size={20}/>
                                    // </div>
                                    <div onClick={() => onOpenModalPlayer(item)}
                                         className='face-control-video-block'>
                                        <BsPlayBtn color='#fff' size={20}/>
                                    </div>
                            }

                            <ImageDemo id={item.id}/>
                            <div className="visit_time_info">
                                <p className="ddmmyy">{moment(item.the_date).format("DD.MM.YYYY")}</p>
                                <p className="hhmmss">{moment(item.the_date).format("HH:mm:ss")}</p>
                            </div>
                        </div>

                        <div className="j_cardInfoTopRight">
                            <div className="line"></div>
                            <div className="line_2"></div>
                            <div className="y_line"></div>
                            <div>
                                {
                                    item.gender == 2
                                        ? <img src={emojes.female['female']} alt=''/>
                                        : <img src={emojes.male['male']} alt=''/>
                                }
                                <p className="card_longTitle">{item.gender == 1 ?
                                    <div className={`${isDarkMode && 'darkModeColor'}`}>{t('Erkak')}</div> :
                                    item.gender == 2 ?
                                        <div className={`${isDarkMode && 'darkModeColor'}`}>{t('Ayol')}</div> :
                                        ''}
                                </p>
                            </div>
                            <div>
                                {
                                    item.gender === 2
                                        ? <img src={emojes.female[item.old]} alt=''/>
                                        : <img src={emojes.male[item.old]} alt=''/>
                                }
                                <p className="card_longTitle">
                                    {
                                        item && item.old === 'age_0_10'
                                            ? <Tooltip title={t('Yosh bola')} color={'cyan'}
                                                       className={`${isDarkMode && 'darkModeColor'}`}>{t('Yosh bola')}
                                        </Tooltip>
                                            : item.old === 'age_11_17' ? <Tooltip title={t('O\'smir')} color={'cyan'}
                                                                                  className={`${isDarkMode && 'darkModeColor'}`}>{t('O\'smir')}</Tooltip>
                                                : item.old === 'age_18_25' ? <Tooltip title={t('O\'spirin')} color={'cyan'}
                                                                                      className={`${isDarkMode && 'darkModeColor'}`}>{t('O\'spirin')}</Tooltip>
                                                    : item.old === 'age_26_40' ?
                                                        <Tooltip title={t('O\'rta yoshli')} color={'cyan'}
                                                                 className={`${isDarkMode && 'darkModeColor'}`}>{t('O\'rta yoshli')}</Tooltip>
                                                        : item.old === 'age_41_60' ?
                                                            <Tooltip title={t('Katta yoshli')} color={'cyan'}
                                                                     className={`${isDarkMode && 'darkModeColor'}`}>{t('Katta yoshli')}</Tooltip>
                                                            : <Tooltip title={t('Keksa')} color={'cyan'}
                                                                       className={`${isDarkMode && 'darkModeColor'}`}>{t('Keksa')}</Tooltip>
                                    }
                                </p>
                            </div>


                            <div>
                                {
                                    <img src={emojes.mask[item.args.MASKA]} alt='mask'/>
                                }
                                <p className="card_longTitle">{item.args.MASKA === 2 ?
                                    <Tooltip title={t('Niqobsiz')} color={'cyan'}
                                             className={`${isDarkMode && 'darkModeColor'}`}>{t('Niqobsiz')}</Tooltip>
                                    : <Tooltip title={t('Niqobli')} color={'cyan'}
                                               className={`${isDarkMode && 'darkModeColor'}`}>{t('Niqobli')}</Tooltip>
                                }
                                </p>
                            </div>
                            <div>
                                {
                                    <img src={emojes.mood[item.args.KAYFIYAT - 1]} alt='mood'/>
                                }
                                <p className="card_longTitle">
                                    {mood[item.args.KAYFIYAT - 1]}
                                </p>
                            </div>
                            <div>
                                {
                                    <img src={emojes.glass[item.args.KOZOYNAK]} alt='glass'/>
                                }
                                <p className="card_longTitle">{item.args.KOZOYNAK === 1 ?
                                    <Tooltip title={t('Ko’rishni_tuzatish')} color={'cyan'}
                                             className={`${isDarkMode && 'darkModeColor'}`}>{t('Ko’rishni_tuzatish')}
                                    </Tooltip> :
                                    item.args.KOZOYNAK === 14 ?
                                        <Tooltip title={t('Quyoshdan_himoya')} color={'cyan'}
                                                                         className={`${isDarkMode && 'darkModeColor'}`}>{t('Quyoshdan_himoya')}
                                        </Tooltip> :
                                        <Tooltip title={t('Kozoynaksiz')} color={'cyan'}
                                                 className={`${isDarkMode && 'darkModeColor'}`}>{t('Kozoynaksiz')}
                                        </Tooltip>}
                                </p>
                            </div>

                            <div>
                                {
                                    item.gender != 2
                                        ?
                                        (item.old !== 'age_0_10' && item.old !== 'age_11_17' &&
                                            <img src={emojes.beard[item.args.SOQOL]} alt='beard'/>)
                                        : ''
                                }
                                <p className="card_longTitle">
                                    {
                                        item.gender == 2
                                            ? ''
                                            : (item.old !== 'age_0_10' && item.old !== 'age_11_17' && (item.args.SOQOL === 2 ?
                                                    <Tooltip title={t('Soqolsiz')} color={'cyan'}
                                                             className={`${isDarkMode && 'darkModeColor'}`}>{t('Soqolsiz')}</Tooltip>
                                                    :
                                                    <Tooltip title={t('Soqolli')} color={'cyan'}
                                                             className={`${isDarkMode && 'darkModeColor'}`}>{t('Soqolli')}</Tooltip>
                                            ))
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReactPlayer
                open={openPlayer}
                setOpenPlayer={setOpenPlayer}
                toggleModal={onOpenModalPlayer}
                filename={filename}
                setOpenPlayer={setOpenPlayer}
                setVideoSec={setVideoSec}
                videoSec={videoSec}
                id={id}
                setFilename={setFilename}
            />
        </>


    );
};

export default Cart;