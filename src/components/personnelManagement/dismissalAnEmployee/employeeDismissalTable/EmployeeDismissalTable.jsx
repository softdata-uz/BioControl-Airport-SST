import React from 'react';
import {useTranslation} from "react-i18next";
import { Table  } from 'antd';
import {RiDeleteBin6Line, RiEditLine} from 'react-icons/ri'
import {GoPencil} from "react-icons/go";


import word from '../../../../images/metroBiocontrol/word.svg';
import 'antd/dist/antd.css';
import "./employeeDismissalTable.css";

import styled from 'styled-components';
import {ip} from "../../../../ip";
import moment from "moment";
import {AiOutlineEye} from "react-icons/ai";
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

const PrTable = (props) => {
    const {
        rowSelection,
        employeeData,
        setDismissalInitialValues,
        dismissalInitialValues,
        setChangePageDismissal,
        setView,
        setDeleteEmployeeDismissal,
        setDeleteModalOpen,
    } = props;

    const {t} = useTranslation();


    const editDismissal= ( value, record) =>{
        setDismissalInitialValues({
            ...value,
            edit : true
        });
        setChangePageDismissal(true);
    }
    const seePage = (value , record) =>{
        setDismissalInitialValues({
            ...value,
            edit : true
        });
        setView(true);
        setChangePageDismissal(true);
    }

    const deleteDismissal = (value , record) =>{
        setDeleteEmployeeDismissal(prev => [...prev, value.id]);
        setDeleteModalOpen(true);
    }


    const columnsUz = [
        {
            title: t('T/r'),
            // dataIndex: 'key',
            dataIndex: 'key',
        },
        {
            title: t('F.I.SH'),
            dataIndex: 'fullname',
            render: (text, record) => (
                  <a className="link_style">{record?.fullname}</a>
            )
        },
        {
            title: t("Bo'lim"),
            dataIndex: 'bolim',
            render: (text, record) => (
                <div>{record?.department}</div>
            )
        },
        {
            title: t("Lavozim"),
            dataIndex: 'position',
        },
        {
            title: t('Buyruq raqami'),
            dataIndex: 'date',
            render: (text, record) => (
                <div>{record?.order_number}</div>
            )
        },
        {
            title: t('Buyruq sanasi'),
            dataIndex: 'date',
            render: (text, record) => (
                <div>{moment(record?.order_date).format('DD.MM.YYYY')}</div>
            )
        },
        {
            title: t('Fayllar'),
            dataIndex: 'fayl',
            render:(text, record )=>(
                <div className="table_file_download">
                    <a className="link_style" href={`${ip}/access-control-service/api/file/fire_staff/${record.filename}`}><img src={word} alt=""/>Yuklash</a>
                </div>
            )
        },
        {
            title: t('Amallar'),
            dataIndex: '',
            render: (text, record) => (
                <div className="amallar">
                    <div onClick={()=> seePage(text, record)} className='amallar_button'>
                        <AiOutlineEye size = {16}/>
                    </div>
                    <div onClick={()=> editDismissal(text, record)} className='amallar_button'>
                        <GoPencil size = {16}/>
                    </div>
                    <div onClick={()=>deleteDismissal(text , record)} className='amallar_button_delete'>
                        <RiDeleteBin6Line size = {16}/>
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
            dataSource={employeeData}
            pagination={false}
        />
    );
}
export default PrTable;
