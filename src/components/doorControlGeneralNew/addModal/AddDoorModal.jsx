import React, {useState} from 'react';
import Modal from "react-modal";
import closeIcon from '../../../images/doorControlGeneralImgNew/x-close.png'
import './addDoorModal.css'
import {Radio} from "antd";
import axios from "axios";
import {ip} from "../../../ip";

const AddDoorModal = (props) => {
    const {
        openAddModal,
        setOpenAddModal,
        terminals,
        getTerminalInViewer,
        getTerminalUserData,
        modalOpen,
        viewerId,
        token
    } = props;

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const handleDivClick = (id , index) => {
        setSelectedId(id);
        setSelectedIndex(index);
    };

    const selectedTer = () => {
        axios.put(`${ip}/access-control-service/api/terminal/updateviewer/${selectedId}`,
            {viewer: viewerId},
            {headers: {'x-access-token': token}}
        )
            .then((response) => {
                getTerminalInViewer(viewerId);
                getTerminalUserData(viewerId);
                setSelectedId(null);
                setSelectedIndex(null)
            });
        modalOpen();
    }

    const cencel = () => {
        setOpenAddModal(false);
        setSelectedId(null);
        setSelectedIndex(null)
    }


    return (

        <Modal
            isOpen={openAddModal}
            // onRequestClose={() => setOpenAddModal(!openAddModal)}
            contentLabel="My dialog"
            className="mymodalDoor"
            overlayClassName="myoverlayDoor"
            closeTimeoutMS={0}
        >
            <div className="add_door_modal">
                <div className="add_door_modal_inner">
                    <div className="add_door_modal_inner_head">
                        <p>Eshik tanlash</p>
                        <img style={{cursor : "pointer"}} src={closeIcon} onClick={cencel}/>
                    </div>

                    <div className="add_door_modal_inner_body">
                        {terminals?.map((item, index) => (
                            <div className={selectedIndex === index ?
                                "add_door_modal_inner_body_inner active_add_door_modal" : "add_door_modal_inner_body_inner"}
                                 onClick={() => handleDivClick(item?.id , index)}>
                                <div className="add_door_modal_inner_body_inner_left"><Radio checked={selectedIndex === index}/></div>
                                <div className="add_door_modal_inner_body_inner_right">
                                    <p>{item?.door_name}</p>
                                    <span>{item?.direction === "Entry" ? "Kirish eshigi" : "Chiqish eshigi"}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="add_door_modal_inner_footer">
                        <div className="add_door_modal_inner_footer_leftButton" onClick={cencel}>Bekor qilish</div>
                        <div className="add_door_modal_inner_footer_rightButton" onClick={selectedTer}>Saqlash</div>
                    </div>
                </div>
            </div>
        </Modal>

    );
};

export default AddDoorModal;