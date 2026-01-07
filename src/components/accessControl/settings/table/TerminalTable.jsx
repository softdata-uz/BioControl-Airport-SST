import React from 'react';
import {useTranslation} from "react-i18next";
import { Table  } from 'antd';
import { RiEditLine } from 'react-icons/ri'

import 'antd/dist/antd.css';

import '../setting.css';

import styled from 'styled-components';
export const TableStyles = styled(Table)`
  tbody {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  thead tr th {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: ${({ theme }) => theme.trhover};
  }
`;

const TerminalTable = (props) => {
    const {
        terminalData,
        setIsOpenAddTerminal,
        setTerminalTableIntialValues,
        rowSelection
    } = props;

    const {t} = useTranslation();


    const editTerminal= ( value, record) =>{
        // console.log(value)
        setTerminalTableIntialValues({
            ...value,
            edit: true
        })
        setIsOpenAddTerminal(true);
    }

    const columnsUz = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            // align: 'center'
        },
        {
            title: t('Eshik nomi'),
            dataIndex: 'door_name',
            render:(text, record)=>(
                <div className="active_doorname">
                    {record?.status ?
                        <div className="active_round"></div>
                        :
                        <div className="inactive_round"></div>
                    }
                    <p>{record.door_name}</p>
                </div>
            )
            // align: 'center',
        },
        {
            title: t("Yo'nalishi"),
            dataIndex: 'direction',
            // align: 'center',
            render: (text, record) => (
                <div>
                    {record?.direction == 'Exit' ? t("Chiqish") : t("Kirish")}
                </div>
            )
        },
        {
            title: t('Autentifikatsiya turi'),
            dataIndex: 'auth_type',
            align: 'center',
            render: (text, record) => (
                <div>
                    {
                        record.auth_type ==1 ? t("Yuz"):
                            record.auth_type ==2 ? t("Barmoq izi"):
                                record.auth_type ==3 ? t("ID karta"):
                                    record.auth_type ==4 ? t("Yuz va Barmoq izi"):
                                        record.auth_type ==5 ? t("Yuz yoki Barmoq izi"):
                                            record.auth_type ==6 ? t("Yuz va ID karta"):
                                                record.auth_type ==7 ? t("Yuz yoki ID karta"):
                                                    record.auth_type ==8 ? t("Barmoq izi va ID karta"):
                                                        record.auth_type ==9 ? t("Barmoq izi yoki ID karta"):
                                                            record.auth_type ==10 ? t("Yuz yoki Barmoq izi yoki ID karta"): ""

                    }
                    {/*{auth_type[lang][record.auth_type]}*/}
                </div>
            )
        },
        {
            title: t('Terminal IP manzili'),
            dataIndex: 'ip_address',
            // align: 'center'
        },
        {
            title: t('Terminal turi'),
            dataIndex: 'type',
            // align: 'center',
        },
        {
            title: t('Login'),
            dataIndex: 'username',
            // align: 'center'
        },
        {
            title: t('Parol'),
            dataIndex: 'password',
            // align: 'center'
        },
        {
            title: t("O'rnatilgan vaqti"),
            dataIndex: 'created_time',
            // align: 'center'
        },
        {
            title: t('Tahrir'),
            dataIndex: '',
            render: (text, record) => (
                <div onClick={()=> editTerminal(text, record)} className='edit_button'>
                    <RiEditLine size = {22} />
                </div>
            ),
            align: 'center'
        },
    ];

    return (
        <TableStyles
            rowSelection={rowSelection}
            columns={columnsUz}
            dataSource={terminalData}
            pagination={false}
        />
    );
}
export default TerminalTable
