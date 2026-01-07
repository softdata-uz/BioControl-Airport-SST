import React from 'react';
import {Table, Image} from 'antd';
import {useSelector} from "react-redux";
import {AiOutlineUser} from 'react-icons/ai'
import {ip} from '../../../../ip';
import {useTranslation} from "react-i18next";
import {RiEditLine} from "react-icons/ri";
import moment from 'moment';

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
const AdminTable = (props) => {
    const {
        adminData,
        rowSelection,
        setIsOpenAddAdmin,
        setInitialValues,
    } = props;



    const {t} = useTranslation()

    const editAddStaff = (value, record) => {
        setInitialValues({
            ...value,
            edit: true,
        })
        setIsOpenAddAdmin(true)
    }

    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            align : 'center'
        },
        {
            title: t('F.I.SH'),
            dataIndex: 'name',
            align : 'center',
            width : "280px",
            render: (text, record) => (
                <div className='table_user_cell'>
                    <Image
                        className="table_user_cell_img"
                        src={`${ip}/${record.image}`}
                        preview={{
                            mask: (
                                <AiOutlineUser size={20}/>
                            ),
                            maskClassName: 'customize-mask',
                        }}
                    />
                    <p>{record.lastname +" "+ record.firstname +" "+ record.fathersname}</p>
                </div>
            ),
        },
        {
            title: t('Boshqarma'),
            dataIndex: 'role',
            align : 'center',
            render:(text, record)=>(
                <div>
                    {record?.role ? (record.role=="king" ? "King" : record.role=="admin" ? "Admin" : record.role=="operator" ? "Operator" :
                        "Super Admin") : "..."}
                </div>
            )
        },
        {
            title: t('Login'),
            dataIndex: 'login',
            align: 'center',
            render:(text, record)=>(
                <div>
                    {record?.login ? record.login : "..."}
                </div>
            )
        },
        {
            title: t('Parol'),
            dataIndex: 'password',
            align: 'center',
            render: (text, record) => (
                <div>
                    {record?.password ? record.password : "..."}
                </div>
            )
        },
        {
            title: t('Tahrir'),
            dataIndex: '',
            render: (text, record) => (
                <div onClick={() => editAddStaff(text, record)} className='edit_button'>
                    <RiEditLine size={22} />
                </div>
            ),
            align: 'center'
        },
    ];

    return (
        <TableStyles
            rowSelection={rowSelection}
            columns={columns}
            dataSource={adminData}
            pagination={false}
        />
    );
}
export default AdminTable
