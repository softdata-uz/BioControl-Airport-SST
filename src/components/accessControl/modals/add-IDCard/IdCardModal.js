import React from 'react';
import Modal from "react-modal";
import {Form, Input, Select} from 'antd';
import {useTranslation} from "react-i18next";


import './idCardModal.css'


import styled from "styled-components";
import {useSelector} from "react-redux";

export const SelectStyles = styled(Select)`
  .ant-select-selector {
    background: ${({theme}) => theme.body} !important;
    color: ${({theme}) => theme.text} !important;
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

Modal.setAppElement("#root");


const IdCardModal = (props) => {

    const {
        isOpenAddTerminal,
        setIsOpenAddTerminal,
        card,
        setCard,
        selectedCard,
        setSelectedCard
    } = props

    const {t} = useTranslation();
    const isDarkMode = useSelector(state => state.theme.theme_data);

    const onFinish = (value) => {
        if (selectedCard.length > 0) {
            const {id, type} = value;
            const newData = [...selectedCard, {
                key: selectedCard.length + 1,
                type: type,
                id: id
            }]
            setSelectedCard(newData)
            setIsOpenAddTerminal(!isOpenAddTerminal);
        } else {
            const {id, type} = value;
            const newData = [...card, {
                key: card.length + 1,
                type: type,
                id: id
            }]
            setCard(newData)
            setIsOpenAddTerminal(!isOpenAddTerminal);
        }
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }

    const cancel = () => {
        setIsOpenAddTerminal(!isOpenAddTerminal)
    }

    return (
        <Modal
            isOpen={isOpenAddTerminal}
            onRequestClose={() => setIsOpenAddTerminal(cancel)}
            contentLabel="My dialog"
            className="mymodal"
            overlayClassName="myoverlay"
            closeTimeoutMS={300}
        >
            <Form
                name="basic"
                layout="vertical"
                initialValues={{
                    remember: true
                }}
                requiredMark='optional'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className={`access_control_add_staff_terminal_modal ${isDarkMode && 'darkModeCard'}`}>
                    <h1 className={`access_control_add_staff_terminal_modal_title ${isDarkMode && 'darkModeColor'}`}>
                        {t("ID karta qo’shish")}
                    </h1>
                    <div className='access_control_add_staff_terminal_modal_body'>
                        <Form.Item
                            label={t("Karta turi:")}
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: t('Karta turuni tanlang'),
                                },
                            ]}
                        >
                            <SelectStyles
                                size="large"
                                placeholder={t('Karta turuni tanlang')}
                            >
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value="Mifare">Mifare</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value="EM-Marin">EM-Marin</Select.Option>
                                <Select.Option className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                               value="RFID">RFID</Select.Option>
                            </SelectStyles>
                        </Form.Item>
                        <Form.Item
                            label={t("Karta raqami")}
                            name="id"
                            rules={[
                                {
                                    required: true,
                                    message: t('Karta raqamini kiriting'),
                                },
                            ]}
                        >
                            <Input
                                className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                                size="large"
                                placeholder={t("Kiriting")}
                            />
                        </Form.Item>
                        <div className='access_control_add_staff_terminal_modal_body_buttons'>
                            <button className="delete_idcard_button" onClick={() => {
                                setIsOpenAddTerminal(false)
                            }} type='button'>{t("Bekor qilish")}</button>
                            <button className="seave_idcard_modal_button" type='submit'>{t("Saqlash")}</button>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    )
};

export default IdCardModal;
