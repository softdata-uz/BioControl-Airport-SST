import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Table} from 'antd';
import PrTable from "./PrTable";
import {AiOutlineSearch} from 'react-icons/ai';
import {useSelector} from "react-redux";
import ProvidingPagination from "./ProvidingPagination";

import './provideingTable.css';

import styled from 'styled-components';
import axios from "axios";
import {ip} from "../../../../ip";
import moment from "moment/moment";
import {AiOutlineDelete} from "react-icons/ai";


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

'
`;

const ProvidingTable = (props) => {

    const {
         setIsOpenInfoForms,
    } = props;

    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const [searchedData, setSearchedData] = useState('');
    const [providingPaginationLimit, setProvidingPaginationLimit] = useState(12)
    const [providingPaginationCurrent, setProvidingPaginationCurrent] = useState(1)
    const [providingData, ProvidingData] = useState([])
    const [providingTotal, setProvidingTotal] = useState(null)
    const [deleteProviding, setDeleteProviding] = useState([])
    const [providing, setProviding] = useState({selectedRowKeys: []})


    const getProvidingData = async (id) => {
        const response = await axios.get(`${ip}/access-control-service/api/reference/${providingPaginationLimit}/${providingPaginationCurrent}`,
            {
                params: {searched_data: searchedData},
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            })
        // console.log(response.data.data)
        const {data} = response;
        const count = data.count;
        setProvidingTotal(count)
        const newData = data?.data?.map((item, index) => (
            {
                ...item,
                key: index + 1 + (data.current_page - 1) * providingPaginationLimit,
                fullname: item.fullname,
                order_date: moment(item.order_date).format('DD.MM.YYYY'),
                order_number: item.order_number,
                position: item.position,
                reason: item.reason
            }
        ))
        ProvidingData(newData);
    }



    const ProvidingPaginationOnChange = (e = 1, option) => {
        getProvidingData(e)
        setProvidingPaginationCurrent(e)
        setProvidingPaginationLimit(option)
    }

    const handleDeliteProviding = () => {
        axios.delete(`${ip}/access-control-service/api/delete/reference`,
            {
                data: deleteProviding,
                headers: {'x-access-token': localStorage.getItem('soft-ais-token')}
            },
        )
            .then(res => {
                getProvidingData(providingPaginationCurrent);
                setProviding({selectedRowKeys: []})
                setDeleteProviding([])
            })
            .catch(err => {
                console.log(err?.response?.data)
            })
    }

    const onSelectChange = (selectedRowKeys, a) => {
        setProviding({selectedRowKeys})
        setDeleteProviding(a.map(item => item.id));
    };

    const {selectedRowKeys} = providing;

    const rowSelection = {
        selectedRowKeys, onChange: onSelectChange,
    }

    useEffect(() => {
        getProvidingData(providingPaginationCurrent)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providingPaginationLimit, providingPaginationCurrent, searchedData])


    return (

        <div className="providing_table_content">
        <div className="employee_content_changePosition_body_title">
                <div className={`employee_content_changePosition_body_title_search  ${isDarkMode && 'darkModeInputBackgraund'}`}
                // style={{width:'198px'}}
                >
                    <AiOutlineSearch/>
                    <input
                        placeholder={t('Izlash')}
                        className={` ${isDarkMode && 'darkModeInputBackgraund darkModeColor'}`}
                        onChange={(e) => {
                            setProvidingPaginationCurrent(1);
                            setSearchedData(e.currentTarget.value);
                        }}

                    />
            </div>
            <div className="employee_content_changePosition_body_title_right">
                <div className="employee_content_changePosition_body_title_right_add" onClick={() => setIsOpenInfoForms(true)}>
                    {t("Ma’lumotnoma berish")}
                </div>
            </div>

        </div>

        <div className="prTable_content">
            <PrTable
                rowSelection={rowSelection}
                providingData={providingData}
                handleDeliteProviding ={handleDeliteProviding}
            />
            <div className="providing_pagination">
                <ProvidingPagination
                    providingPaginationLimit={providingPaginationLimit}
                    providingPaginationCurrent={providingPaginationCurrent}
                    ProvidingPaginationOnChange={ProvidingPaginationOnChange}
                    providingTotal={providingTotal}
                />
                {
                    deleteProviding.length > 0 &&
                    <button style={{marginLeft: 10}} type='button' className="delete_button" onClick={handleDeliteProviding}>
                        <AiOutlineDelete size={22} style={{marginRight: '5px'}}/>
                        {t("O’chirish")}
                    </button>
                }
            </div>
        </div>


    </div>)

};

export default ProvidingTable;