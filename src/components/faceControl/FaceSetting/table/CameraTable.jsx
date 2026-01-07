import React from 'react';
import { Table  } from 'antd';
import { useSelector } from "react-redux";
import {RiEditLine} from "react-icons/ri";
import {useTranslation} from "react-i18next";
import 'antd/dist/antd.css';
import '../faceSetting.css';


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
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: ${({ theme }) => theme.trhover};
  }
`;

const CameraTable = (props) => {
    const {
        cameraData,
        setIsOpenAddCamera,
        setCameraInitialValues,
        rowSelection,
    } = props;

    const {t} = useTranslation()
    const lang = localStorage.getItem('i18nextLng');
    cameraData.forEach(e => {
        e.name = e[`name_${lang}`];
        e.group_name = e[`group_name_${lang}`];
    })

    const editCamera = (value, record) => {
        
        setCameraInitialValues({
            ...value,
            edit: true
        })
        setIsOpenAddCamera(true)
    }

    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            // align: 'center'
        },
        {
            title: t('Kamera nomi'),
            dataIndex: 'name',
            // align: 'center'
        },
        {
            title: t("Brend"),
            dataIndex: 'type',
            // align: 'center'
        },
        {
            title: t("Kanal"),
            dataIndex: 'channel',
            // align: 'center'
        },
        {
            title: t('Guruh'),
            dataIndex: `group_name`,
            // align: 'center'
        },
        {
            title: t('IP manzili'),
            dataIndex: 'ip_address',
            // align: 'center'
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
            // title: t('Amal'),
            dataIndex: '',
            render: (text, record) => (
                <div onClick={() => editCamera(text, record)} className='edit_button'>
                    <RiEditLine size = {20}  />
                </div>
            ),
            // align: 'center'
        },
    ];

    return (
        <>
            <TableStyles
                rowSelection={rowSelection}
                columns={columns}
                dataSource={cameraData}
                pagination={false}
                // scroll={{
                //     y: 660
                // }}
            />
        </>
    );
}
export default CameraTable
