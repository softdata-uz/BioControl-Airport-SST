import React, {useState} from 'react';
import Modal from "react-modal";
import closeIcon from '../../../images/doorControlGeneralImgNew/x-close.png';
import deleteIcon from '../../../images/doorControlGeneralImgNew/deleteIcon.png';
import '../addModal/addDoorModal.css';
import {Radio} from "antd";

const DeleteDoorModal = (props) => {
    const {
        openDeleteModal,
        setOpenDeleteModal,
        cencel,
        deleteTerminal
    } = props;


    return (

        <Modal
            isOpen={openDeleteModal}
            // onRequestClose={() => setOpenAddModal(!openAddModal)}
            contentLabel="My dialog"
            className="mymodalDoor"
            overlayClassName="myoverlayDoor"
            closeTimeoutMS={0}
        >
            <div className="add_door_modal">
                <div className="add_door_modal_inner">
                    <div className="add_door_modal_inner_head" style={{borderBottom : "0"}}>
                        <div className="add_door_modal_inner_head_deleteIcon"><img src={deleteIcon}/></div>
                        <img style={{cursor : "pointer"}} src={closeIcon} onClick={() => setOpenDeleteModal(!openDeleteModal)}/>
                    </div>

                    <div className="add_door_modal_inner_body" style={{borderBottom : "0"}}>
                        <h2>Rostdan ham o’chirmoqchimisiz?</h2>
                        {/*{items.map((item, index) => (*/}
                        {/*    <div className={selectedIndex === index ? "add_door_modal_inner_body_inner active_add_door_modal" : "add_door_modal_inner_body_inner"}*/}
                        {/*         onClick={() => handleDivClick(index)}>*/}
                        {/*        <div className="add_door_modal_inner_body_inner_left"><Radio checked={selectedIndex === index}/></div>*/}
                        {/*        <div className="add_door_modal_inner_body_inner_right">*/}
                        {/*            <p>{item.title}</p><span>{item.description}</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </div>

                    <div className="add_door_modal_inner_footer">
                        <div className="add_door_modal_inner_footer_leftButton" onClick={cencel}>Bekor qilish</div>
                        <div className="add_door_modal_inner_footer_rightButton_delete" onClick={deleteTerminal}>O’chirish</div>
                    </div>

                </div>
            </div>
        </Modal>

    );
};

export default DeleteDoorModal;