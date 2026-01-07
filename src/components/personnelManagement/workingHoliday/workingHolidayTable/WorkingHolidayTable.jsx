import React from 'react';
import {useTranslation} from "react-i18next";
import { Table  } from 'antd';
import {RiDeleteBin6Line} from 'react-icons/ri'
import {GoPencil} from "react-icons/go";


import word from '../../../../images/metroBiocontrol/word.svg';
import 'antd/dist/antd.css';
import "./workingHolidayTable.css";

import styled from 'styled-components';
import {Link} from "react-router-dom";
import {ip} from "../../../../ip";
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

const WorkingHolidayTable = (props) => {
    const {
        rowSelection,
        holidayData,
        handleDeliteHoliday
    } = props;

    const {t} = useTranslation();


    const editTerminal= ( value, record) =>{
        // console.log(value)
        // setTerminalTableIntialValues({
        //     ...value,
        //     edit: true
        // })
        // setIsOpenAddTerminal(true)
    }


    const columnsUz = [
        {
            title: t('ID'),
            dataIndex: 'key',
        },
        {
            title: t('F.I.SH'),
            dataIndex: 'fullname',
        },
        {
            title: t("Lavozim"),
            dataIndex: 'position',
        },

        {
            title: t('Buyruq sanasi'),
            dataIndex: 'order_date',
        },
        {
            title: t('Buyruq raqami'),
            dataIndex: 'order_number',
        },
        {
            title: t('Fayllar'),
            dataIndex: 'fayl',
            render:(text, record )=>(
                <Link to={`${ip}/access-control-service/api/file/labour_holiday/${record.filename}`} className="table_file_download">
                    <img src={word} alt=""/>
                    Yuklash
                </Link>
            )

        },
        {
            title: t('Amallar'),
            dataIndex: '',
            render: (text, record) => (
                <div className="amallar">
                    {/*<div onClick={()=> editTerminal(text, record)} className='amallar_button'>*/}
                    {/*    <AiOutlineEye size = {16}/>*/}
                    {/*</div>*/}
                    <div onClick={()=> editTerminal(text, record)} className='amallar_button'>
                        <GoPencil size = {16}/>
                    </div>
                    <div onClick={()=> handleDeliteHoliday()} className='amallar_button_delete'>
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
            dataSource={holidayData}
            pagination={false}
        />
    );
}
export default WorkingHolidayTable;
