import React from 'react';
import {useTranslation} from "react-i18next";
import {Table} from 'antd';


import 'antd/dist/antd.css';
import "./networkTable.css";

import styled from 'styled-components';
import {GoPencil} from "react-icons/go";

export const TableStyles = styled(Table)`
  tbody {
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  thead tr th {
    background: ${({theme}) => theme.body};
    color: ${({theme}) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td, .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: ${({theme}) => theme.trhover};
  }
  
`;

const NetworkTable = (props) => {
    const {
        rowSelection,
        networkData,
        setInitialValuesNetwork,
        setIsOpennetwork
    } = props;

    const {t} = useTranslation();


    const editTerminal = (value, record) => {
        setInitialValuesNetwork({
            ...value,
            edit: true
        })
        setIsOpennetwork(true);
    }

    const columnsUz = [
        {
            title: t('T/r'),
            // dataIndex: 'key',
            dataIndex: 'key',
        },
        {
            title: t('Qisqa nomlanishi'),
            dataIndex: 'short_name',
            render: (text, record) => (
                <span>{record?.short_name}</span>
            )
        },
        {
            title: t('To’liq nomlanishi'),
            dataIndex: 'full_name',
            render: (text, record) => (
                <span>{record?.full_name}</span>
            )
        },
        {
            title: t('Bo\'lim boshlig\'i'),
            dataIndex: 'manager_fullname',
            render: (text, record) => (
                <div>{record?.manager_fullname}</div>
            )
        },
        {
            title: t("Yuqori turuvchisi"),
            dataIndex: 'company',
            render: (text, record) => (
                <div>{record?.company}</div>
            )
        },
        {
            title: t("Holati"),
            dataIndex: "",
            render: (text,record) => (
                <div className="condition">
                    {record?.status?
                        <div className="condition_active">{t("Faol")}</div>:
                        <div className="condition_noactive">{t("Nofaol")}</div>
                    }
                </div>
            )
        },

        {
            title: t('Amallar'),
            dataIndex: '',
            render: (text, record) => (
                <div className="amallar">
                    <div onClick={()=> editTerminal(text, record)} className='amallar_button'>
                        <GoPencil size = {16}/>
                    </div>
                        {/*<div className='amallar_button_delete'>*/}
                        {/*    <RiDeleteBin6Line size={16}/>*/}
                        {/*</div>*/}
                </div>
            ),
            align: 'center'
        },
    ];

    return (
        <TableStyles
            rowSelection={rowSelection}
            columns={columnsUz}
            dataSource={networkData}
            pagination={false}
        />
    );
}
export default NetworkTable;
