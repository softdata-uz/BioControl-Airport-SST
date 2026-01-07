import {Pagination} from 'antd';
import {useTranslation} from "react-i18next";


import styled from "styled-components";
export const PaginationStyles = styled(Pagination)`
  .ant-pagination-item, .ant-pagination-item-link, .ant-select-single:not(.ant-select-customize-input) .ant-select-selector  {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s ease-in, color 0.2s ease-in;
  }
`;

const WorkingHoursReportPagination = (props) => {

    const {
        staffPaginationLimit,
        staffPaginationCurrent,
        staffPaginationOnChange,
        accessTableTotal,
    } = props;

    const {t} = useTranslation();

    return <PaginationStyles
        dropdownRender = {false}
        defaultPageSize = {staffPaginationLimit}
        current={staffPaginationCurrent}
        onChange={staffPaginationOnChange}
        total = {accessTableTotal}
        showSizeChanger={true}
        pageSize={staffPaginationLimit}
        pageSizeOptions={[15, 50, 100]}
        locale={{ items_per_page: t('sahifa') }}
    />;
}

export default WorkingHoursReportPagination