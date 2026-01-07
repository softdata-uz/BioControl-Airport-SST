import React from 'react';
import styled from "styled-components";
import {Pagination} from "antd";
import {useTranslation} from "react-i18next";




export const PaginationStyles = styled(Pagination)`
  .ant-pagination-item, .ant-pagination-item-link, .ant-select-single:not(.ant-select-customize-input) .ant-select-selector  {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

const ProvidingPagination = (props) => {
    const{
        providingPaginationLimit,
        providingPaginationCurrent,
        providingTotal,
        ProvidingPaginationOnChange
    }=props

    const {t} = useTranslation();

    return <PaginationStyles
        dropdownRender = {false}
        defaultPageSize = {providingPaginationLimit}
        current={providingPaginationCurrent}
        onChange={ProvidingPaginationOnChange}
        total = {providingTotal}
        showSizeChanger={true}
        pageSize={providingPaginationLimit}
        pageSizeOptions={[12, 50, 100]}
        locale={{ items_per_page: t('sahifa') }}
    />;
};

export default ProvidingPagination;