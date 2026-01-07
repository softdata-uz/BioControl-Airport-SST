import React from 'react';
import {useTranslation} from "react-i18next";
import {Table} from 'antd';
import {RiDeleteBin6Line, RiEditLine} from 'react-icons/ri'
import {GoPencil} from "react-icons/go";
import {useHistory, useNavigate} from 'react-router-dom'


import word from '../../../../images/metroBiocontrol/word.svg';
import 'antd/dist/antd.css';
import "../../providingInformation/providing/provideingTable.css";

import styled from 'styled-components';
import {ip} from "../../../../ip";
import {AiOutlineEye} from "react-icons/ai";

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

const ETable = (props) => {
    const {
        rowSelection,
        staffData,
        setOpenEmployeesInfo,
        setEmployeesId,
        setOpenAddemployees,
        handleDeliteStaff,
        setEmployeesInitialValue,
        employeesInitialValue,
        setOpenAddemployeesView,
        setEmployeesView,
        setDeleteStaff,
        setDeleteModalOpen
    } = props;

    const {t} = useTranslation();

    const navigate = useNavigate();
    const handleRowClick = (row) => {
        console.log(row)
        navigate(`/${row}`);
    }


    const handleClickOpenEmployeesInfo = (record) => {
        setEmployeesId(record)
        setOpenEmployeesInfo(true)
        setOpenAddemployees(false)

        // console.log(record)
    }

    const handleClickOpenEmployeesInfoView = (record) => {
        setEmployeesView(record)
        setOpenEmployeesInfo(false)
        setOpenAddemployees(false)
        setOpenAddemployeesView(true)
        // console.log(record)
    }

    const editStaff = (value, record) => {
        console.log(value)
        setEmployeesInitialValue({
            ...value,
            edit: true
        })
        setOpenAddemployees(true);
    }

    const deleteEmployee = (value, record) => {
        setDeleteStaff(prev => [...prev, value.id]);
        setDeleteModalOpen(true)
    }


    const columnsUz = [{
        title: t('ID'), dataIndex: 'key',
    },
        {
            title: t('F.I.SH'), dataIndex: 'fullname', render: (text, record) =>
                <span className="table_link_style" onClick={() => handleClickOpenEmployeesInfo(record)}>{text}</span>
        },
        {
            title: t("Tug’ilgan sanasi"), dataIndex: 'date_of_birth',
        },

        {
            title: t("Ma'lumoti"), dataIndex: 'degree',
        },
        {
            title: t('Mutaxassisligi'), dataIndex: 'specialization',
        },
        {
            title: t('Fayllar'),
            dataIndex: 'filename',
            render: (text, record) =>
                (
                    <div className="table_file_download" style={{width: "90px"}}>
                        {/*<a className="link_style" href={`${ip}/access-control-service/api/file/reference/${record.filename}`}><img src={word} alt=""/>{t("Yuklash")}</a>*/}
                        <a className="link_style" href="#"><img src={word} alt=""/>{t("Yuklash")}</a>
                    </div>
                )
        },
        {
            title: t('Amallar'), dataIndex: '', render: (text, record) => (<div className="amallar">
                <div onClick={() => handleClickOpenEmployeesInfoView(text, record)} className='amallar_button'>
                    <AiOutlineEye size={16}/>
                </div>
                <div className='amallar_button' onClick={()=> editStaff(text, record)}>
                    <GoPencil size = {16}/>
                </div>
                <div onClick={() => deleteEmployee(text, record)} className='amallar_button_delete'>
                    <RiDeleteBin6Line size={16}/>
                </div>
            </div>), align: 'center'
        },];

    return (<TableStyles
        rowSelection={rowSelection}
        columns={columnsUz}
        dataSource={staffData}
        pagination={false}
    />);
}
export default ETable;
