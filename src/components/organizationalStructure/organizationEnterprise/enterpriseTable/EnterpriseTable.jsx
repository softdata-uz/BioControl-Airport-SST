import React,{useState} from 'react';
import {useTranslation} from "react-i18next";
import {Table} from 'antd';
import {GoPencil} from "react-icons/go";


import 'antd/dist/antd.css';
import "./enterpriseTable.css";

import styled from 'styled-components';
import axios from "axios";
import {ip} from "../../../../ip";

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

const EnterpriseTable = (props) => {


    const {
        rowSelection,
        enterpriseData,
        setInitialValues,
        setIsOpenEnterprise,
        setDeleteEnterprise,
        setDeleteModalOpen
    } = props;


    const {t} = useTranslation();


    const editEnterprise = (value, record) => {
        setInitialValues({
            ...value,
            edit: true
        })
        setIsOpenEnterprise(true);
    }

    const deleteEmployee = (value , record) =>{
        setDeleteEnterprise(prev => [...prev, value.id]);
        setDeleteModalOpen(true);
    }



    const columnsUz = [
        {
            title: t('T/r'),
            dataIndex: 'key',
        },
        {
            title: t('Qisqa nomlanishi'),
            dataIndex: 'short_name',
            render: (text, record) => (
                <span>
                    {record?.short_name}
                </span>
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
            title: t("Xodim F.I.SH"),
            dataIndex: 'director_fullname',
            render: (text, record) => (
                <span>{record?.director_fullname}</span>
            )
        },
        {
            title: t("Holati"),
            dataIndex: "status",
            render: (text,record) => (
                <div className="condition">
                    {
                        record.status ?
                            <div className="condition_active">{t("Faol")}</div>
                            :
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
                    <div onClick={()=> editEnterprise(text, record)} className='amallar_button'>
                        <GoPencil size = {16}/>
                    </div>
                </div>
            ),
            align: 'center'
        },
    ];

    return (
        <TableStyles
            rowSelection={rowSelection}
            columns={columnsUz}
            dataSource={enterpriseData}
            pagination={false}
        />
    );
}
export default EnterpriseTable;
