import React, {useState} from "react";
import {
    Player,
    PosterImage,
    ControlBar,
    PlayToggle,
    BigPlayButton,
    LoadingSpinner,
    ReplayControl,
    ForwardControl,
    VolumeMenuButton,
    PlaybackRateMenuButton
} from "video-react";
import { Space, Spin } from 'antd';

import Modal from "react-modal";
import "../../../../../node_modules/video-react/dist/video-react.css";
// import '../carsNewPage.css';
import {ip} from "../../../../ip";
import './video.css';
import axios from "axios";
export default function ReactPlayer(props) {
    const { open , setOpenPlayer, toggleModal, filename, videoSec, setVideoSec,id , setFilename} = props;

    const [loading , setLoading] = useState(false);

    const videoChangeSec = (value) =>{
        setLoading(true)
        axios.get(`${ip}/face-detection-service/api/video/face/${value}/${id?.id}`)
            .then((res) => {
                // console.log(res);
                setFilename(res.data.filename);
                setVideoSec(value);
                setLoading(false);
            })
            .catch(err =>{
                setLoading(false);
            })
    }
    return (
        <Modal
            isOpen={open}
            onRequestClose={()=>setOpenPlayer(!open)}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={0}
        >
            <div className="player_modal">

                {loading ? <div className="player_modal_loading"><Space size="middle"><Spin size="large" /></Space></div> : ""}

                <div className="player_modal_button">
                    <button style={{marginRight:"10px"}} className={videoSec===10 ? "sec_active_button" : ""} onClick={()=>videoChangeSec(10)}>10 s</button>
                    <button style={{marginRight:"10px"}} className={videoSec===20 ? "sec_active_button" : ""} onClick={()=>videoChangeSec(20)}>20 s</button>
                    <button className={videoSec===30 ? "sec_active_button" : ""} onClick={()=>videoChangeSec(30)}>30 s</button>
                </div>
                <Player
                    src={`${ip}/face-detection-service/videos/${filename}`}
                    autoPlay = {true}
                >
                    <BigPlayButton position="center" />
                    <LoadingSpinner />
                    <ControlBar autoHide={false} disableDefaultControls={false}>
                        <PlayToggle />
                        <VolumeMenuButton vertical />
                        <ReplayControl seconds={5} order={2.2} />
                        <ForwardControl seconds={5} order={3.2} />
                        <PlaybackRateMenuButton rates={[2, 1.5, 1, 0.5, 0.1]} />
                    </ControlBar>
                </Player>
            </div>
        </Modal>
    );
}
