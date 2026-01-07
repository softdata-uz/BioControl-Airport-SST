import React, { useRef } from "react";
import {Modal, Spin} from "antd";
import { Player } from "video-react";

import "video-react/dist/video-react.css";
import './video.css'
import { ip } from "../../../../ip";

const VideoModal = ({ visible, setVisible, loading, id }) => {

    const videoRef = useRef(null)
    const hideModal = () => {
        setVisible(false)
    };

    const pause = () => {
        videoRef && videoRef.current && videoRef.current.actions && videoRef.current.actions.pause();
    };

    return (
            <Modal
                // title="Product name"
                visible={visible}
                centered
                footer={null}
                onCancel={hideModal}
                afterClose={pause}
                bodyStyle={{ padding: 0 }}
                >

            </Modal>
    )
}

export default VideoModal