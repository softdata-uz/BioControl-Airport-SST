import React from 'react';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import IdCardTable from './IdCardTable';
import IdCardModal from "../add-IDCard/IdCardModal";

import './staffMiddle.css'

const StaffMiddle = (props) => {
   const {
       setIsOpenAddTerminal,
       isOpenAddTerminal,
       card,
       setCard,
       selectedCard,
       setSelectedCard,

   } = props

    const {t} = useTranslation()
    const isDarkMode = useSelector(state => state.theme.theme_data)
    const [selectedItems, setSelectedItems] = React.useState([]);

    const handleDeleteTerminal = () => {
        const selectedItemsKey = selectedItems.map(item => item.key)
        const new_data = card.filter((item) => !selectedItemsKey.includes(item.key))
        setCard(new_data)
    }

    return (
       <>
           <IdCardModal
               card={card}
               setCard={setCard}
               isOpenAddTerminal={isOpenAddTerminal}
               setIsOpenAddTerminal={setIsOpenAddTerminal}
               selectedCard={selectedCard}
               setSelectedCard={setSelectedCard}
           />

           <div className='access_control_add_staff_modal_body_item_right'>
               <div className="staff_middle_table">
                   <IdCardTable
                       card = {card}
                       setSelectedItems={setSelectedItems}
                   />
               </div>


               <div className='access_control_add_staff_modal_body_item_right_buttons'>
                   <button className="add_idcard_button" onClick={() => setIsOpenAddTerminal(true)} type='button'>
                       {t("ID karta qo’shish")}
                   </button>
                   <button className="delete_idcard_button" onClick={handleDeleteTerminal} type='button'>
                       {t("O’chirish")}
                   </button>
               </div>
           </div>
       </>
    )
};

export default StaffMiddle;
