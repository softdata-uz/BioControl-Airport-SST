import React, {useState} from 'react';
import {Image, Table} from "antd";
import {useTranslation} from "react-i18next";
import {ip} from "../../../ip";
import Modal from "react-modal";

import "./imgModal.css";

import styled from 'styled-components';
import {AiOutlineUser} from "react-icons/ai";

export const TableStyles = styled(Table)`
    tbody{
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
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: ${({theme}) => theme.trhover};
  }
`;

const ReportTable = (props) => {

    const {t} = useTranslation();
    const lang = localStorage.getItem('i18nextLng');
    const {
        reportData,
        filterInitialValue,
        setFilterInitialValue,
        setIsOpenEnterImg,
        setIsOpenExitImg
    } = props;

    // console.log(isOpenImg)
    const handleChange = (pagination, filters, sorter) => {

        // console.log(sorter.order);
        // setFilterInitialValue({...filterInitialValue, order_column: sorter?.field});
        if (sorter?.order){
            setFilterInitialValue({
                ...filterInitialValue,
                order_type: sorter?.order?.replace("end", "") ,
                order_column: sorter?.field});
        }
        else {
            setFilterInitialValue({
                ...filterInitialValue,
                order_type: '',
                order_column: ''
            });
        }
    };


    const columns = [
        {
            title: t('T/r'),
            dataIndex: 'key',
            key: 'key',
            width: 50,
        },
        {
            title: t('Bino nomi'),
            dataIndex: `ter_gr.name_${lang}`,
            key: `ter_gr.name_${lang}`,
            // width: 180,
            sorter: true,
            render: (text, record) => (
                <div className="">{record?.[`group_name_${lang}`]}</div>
            ),
        },
        {
            title: t('Xizmat yoki bo’lim nomi'),
            dataIndex: 'd.full_name',
            key: 'department',
            render: (text, record) => (
                <div className="">{record?.department}</div>
            ),
            ellipsis: true,
            sorter: true
        },
        {
            title: t('Xodimning F.I.Sh'),
            dataIndex: 't_u.fullname',
            sorter: true,
            render: (text, record) => (
                <div className='report_name'>
                    <div className="report_name_user_img">
                        <Image
                            className="report_name_user_img_inner"
                            src={`${ip}/access-control-service/${record.image}`}
                            preview={{
                                mask: (
                                    <AiOutlineUser size={20}/>
                                ),
                                maskClassName: 'customize-mask',
                            }}
                        >
                        </Image>
                    </div>

                    <div className="report_name_inner">
                        <div className="">{record.fullname}</div>
                    </div>
                </div>
            )
        },
        {
            title: t("Lavozim"),
            dataIndex: 'p.full_name',
            render: (text, record) => (
                <div className="">{record?.rank}</div>
            )
        },
        // {
        //     title: t('Hisobot vaqti'),
        //     dataIndex: 'report_date',
        //     key: 'report_date',
        //     // ellipsis: true,
        //     // sorter: true,
        //     render: (text, record) => (
        //         <div>{record?.report_date}</div>
        //     ),
        // },
        {
            title: t('Binoga kirish vaqti'),
            dataIndex: 'h_l.entering_time',
            key: 'entering_time',
            sorter: true,
            render: (text, record) => (
                <div className="entering_time">
                    <div>{record?.is_late === false ?
                        <div className={"imgActiveIconTime"}></div> :
                        (record?.is_late === true ? <div className="imgNeActiveIconTime"></div> : '')
                    }</div>
                    <div onClick={()=>setIsOpenEnterImg(record.id) } className="table_date_img">
                        {record?.entering_time}
                    </div>
                </div>
            ),
        },
        {
            title: t('Binodan chiqish vaqti'),
            dataIndex: 'h_l.exiting_time',
            key: 'exiting_time',
            sorter: true,
            // align: 'center',
            render: (text, record) => (
                <div className="entering_time">
                    <div>{record?.is_early_go === false ?
                        <div className={"imgActiveIconTime"}></div> :
                        (record?.is_early_go === true ? <div className="imgNeActiveIconTime"></div> : '')
                    }</div>
                    <div onClick={()=>setIsOpenExitImg(record.id) } className="table_date_img">
                        {record?.exiting_time}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="cars_table">
            <TableStyles
                columns={columns}
                dataSource={reportData}
                onChange={handleChange}
                pagination={false}
                locale={{
                    triggerDesc: t("Kamayish bo'yicha"),
                    triggerAsc: t("O'sish bo'yicha"),
                    cancelSort: t("Saralashni bekor qilish")
                }}
            />
        </div>
    );
};

export default ReportTable;