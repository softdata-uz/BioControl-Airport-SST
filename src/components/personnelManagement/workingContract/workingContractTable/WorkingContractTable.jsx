import React from 'react';
import {useTranslation} from "react-i18next";
import { Table  } from 'antd';
import {RiDeleteBin6Line, RiEditLine} from 'react-icons/ri'
import {GoPencil} from "react-icons/go";


import word from '../../../../images/metroBiocontrol/word.svg';
import 'antd/dist/antd.css';
import "./workingContractTable.css";

import styled from 'styled-components';
import moment from "moment";
import {ip} from "../../../../ip";
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
        setContractInitialValues,
        contractInitialValues,
        setChangePage,
        setView,
        setDeleteWorkingContract,
        setDeleteModalOpen
    } = props;

    const {t} = useTranslation();

    const editTerminal = (value, record) =>{
        setContractInitialValues({
            ...value,
            edit : true
        });
        setChangePage(true);
    }
    const seePage = (value , record) =>{
        setContractInitialValues({
            ...value,
            edit : true
        });
        setView(true);
        setChangePage(true);
    }

    const deleteEmployee = (value , record) =>{
        setDeleteWorkingContract(prev => [...prev, value.id]);
        setDeleteModalOpen(true);
    }


    const columnsUz = [
        {
            title: t('ID'),
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
            dataIndex: 'department',
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
            dataIndex: 'order_number',
            render: (text, record) => (
                <div>{record?.order_number}</div>
            )
        },
        {
            title: t('Buyruq sanasi'),
            dataIndex: 'order_date',
            render: (text, record) => (
                <div>{moment(record?.order_date).format('DD.MM.YYYY')}</div>
            )
        },
        {
            title: t('Fayllar'),
            dataIndex: 'filename',
            render:(text, record )=>(
                <div className="table_file_download">
                    <a className="link_style" href={`${ip}/access-control-service/api/file/labour_contract/${record.filename}`}><img src={word} alt=""/>Yuklash</a>
                </div>
            )
        },
        {
            title: t('Amallar'),
            dataIndex: '',
            render: (text, record) => (
                <div className="amallar">
                    <div className='amallar_button' onClick={()=> seePage(text, record)}>
                        <AiOutlineEye size = {16}/>
                    </div>
                    <div className='amallar_button' onClick={()=> editTerminal(text, record)}>
                        <GoPencil size = {16}/>
                    </div>
                    <div className='amallar_button_delete' onClick={()=>deleteEmployee(text , record)}>
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
