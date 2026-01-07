import React from 'react';
import Modal from "react-modal";
import {ip} from "../../../../ip";
import {Image} from "antd";

const TerminalImgExitModal = ({isOpenExitImg, setIsOpenExitImg}) => {
    return (
        <div>
            <Modal
                isOpen={isOpenExitImg}
                onRequestClose={() => setIsOpenExitImg(!isOpenExitImg)}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <div className="terminal_date_click_img">
                    <Image
                        src = {`${ip}/access-control-service/api/image/history-log/exit/${isOpenExitImg}`}
                        preview = {{
                            visible: false,
                        }}
                    />
                </div>

            </Modal>
        </div>
    );
};

export default TerminalImgExitModal;