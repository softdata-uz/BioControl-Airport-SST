import React from 'react';
import FingerTable from "./FingerTable";
import finger from '../../../../images/finger.svg';

import './middleBottom.css';
import FingerprintModal from "../fingerprint/FingerprintModal";
import {useTranslation} from "react-i18next";

const MiddleBottom = (props) => {

    const {
        isOpenAddFingerprint,
        setIsOpenAddFingerprint,
        terminalIPList,
        fingerPrint,
        setFingerPrint,
    }=props
    const {t} = useTranslation()
    const [selectedItems, setSelectedItems] = React.useState([]);

    const handleDeleteTerminal = () => {
        const selectedItemsKey = selectedItems.map(item => item.key)
        const new_data = fingerPrint.filter((item) => !selectedItemsKey.includes(item.key))
        setFingerPrint(new_data)
    }

    return (
        <>
            <FingerprintModal
                isOpenAddFingerprint={isOpenAddFingerprint}
                setIsOpenAddFingerprint={setIsOpenAddFingerprint}
                fingerPrint = {fingerPrint}
                setFingerPrint = {setFingerPrint}
                terminalIPList={terminalIPList}
            />
        <div className='access_control_add_staff_modal_body_item_fingerprint'>
            <div className="staff_middle_table">
                <FingerTable
                    fingerPrint = {fingerPrint}
                    setSelectedItems = {setSelectedItems}
                />
            </div>

            <div className='access_control_add_staff_modal_body_item_fingerprint_buttons'>
                <button className="add_finger_button" onClick={() => setIsOpenAddFingerprint(true)} type='button'>
                    <img style={{marginRight:8}} src={finger} alt=""/>
                    {t("Qo’shish")}
                </button>
                <button className="delete_finger_button" onClick={handleDeleteTerminal} type='button'>{t("O’chirish")}</button>
            </div>
        </div>
        </>
    )
};

export default MiddleBottom;