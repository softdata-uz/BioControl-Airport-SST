import React from 'react';
import {useTranslation} from "react-i18next";
import { Table  } from 'antd';
import {RiDeleteBin6Line} from 'react-icons/ri'


import word from '../../../../images/metroBiocontrol/word.svg';
import 'antd/dist/antd.css';
import "./provideingTable.css";

import styled from 'styled-components';
import {Link} from "react-router-dom";
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
        providingData,
        handleDeliteProviding
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

    const viewj=()=>{

    }



    const columnsUz = [
        {
            title: t('ID'),
            dataIndex: 'key',
        },
        {
            title: t('F.I.SH'),
            dataIndex: 'fullname',
            render: (text, record) =>
                <Link className="table_link_style" >
                    {text}
                </Link>
        },
        {
            title: t("Lavozim"),
            dataIndex: 'position',
        },

        {
            title: t('Berilgan sana'),
            dataIndex: 'order_date',
        },
        {
            title: t('Mazmuni'),
            dataIndex: 'reason',
        },
        {
            title: t('Fayllar'),
            dataIndex: 'filename',
            render:(text, record )=>(
                // console.log(text , record)
                // <Link to={`${ip}/access-control-service/api/file/reference/${record.filename}`} className="table_file_download">
                //     <img src={word} alt=""/>
                //     Yuklash
                // </Link>
                <div className="table_file_download" style={{width:"90px"}}>
                    <a className="link_style" href={`${ip}/access-control-service/api/file/reference/${record.filename}`}><img src={word} alt=""/>Yuklash</a>
                </div>
            )
        },
        {
            title: t('Amallar'),
            dataIndex: '',
            render: (text, record) => (
                <div className="amallar">
                    <div onClick={()=> editTerminal(text, record)} className='amallar_button'>
                        <AiOutlineEye size = {16}/>
                    </div>
                    <div onClick={() => handleDeliteProviding()} className='amallar_button_delete'>
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
            dataSource={providingData}
            pagination={false}
        />
    );
}
export default PrTable;
