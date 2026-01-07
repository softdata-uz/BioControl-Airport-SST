import React from 'react';
import {Pagination} from "antd";
import {useTranslation} from "react-i18next";


import styled from "styled-components";
export const PaginationStyles = styled(Pagination)`
  .ant-pagination-item, .ant-pagination-item-link, .ant-select-single:not(.ant-select-customize-input) .ant-select-selector  {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
  
`;

const ReportPagination = (props) => {

    const {
        reportTotal,
        reportPaginationCurrent,
        reportPaginationLimit,
        reportPaginationOnchange
    }=props

    const {t} = useTranslation();

    return<PaginationStyles
        dropdownRender = {false}
        defaultPageSize={reportPaginationLimit}
        current={reportPaginationCurrent}
        onChange={reportPaginationOnchange}
        showSizeChanger={true}
        total={reportTotal}
        pageSize={reportPaginationLimit}
        pageSizeOptions={[11, 22, 33, 44]}
        locale={{ items_per_page: t('sahifa') }}
    />;
};

export default ReportPagination;