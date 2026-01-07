import React from 'react';
import Modal from "react-modal";
import {ip} from "../../../../ip";
import {Image} from "antd";

const TerminalImgModal = ({isOpenEnterImg, setIsOpenEnterImg}) => {
    return (
        <div>
            <Modal
                isOpen={isOpenEnterImg}
                onRequestClose={() => setIsOpenEnterImg(!isOpenEnterImg)}
                contentLabel="My dialog"
                className="mymodal"
                overlayClassName="myoverlay"
                closeTimeoutMS={0}
            >
                <div className="terminal_date_click_img">
                    <Image
                        src = {`${ip}/access-control-service/api/image/history-log/enter/${isOpenEnterImg}`}
                        preview = {{
                            visible: false,
                        }}
                    />
                </div>

            </Modal>
        </div>
    );
};

export default TerminalImgModal;