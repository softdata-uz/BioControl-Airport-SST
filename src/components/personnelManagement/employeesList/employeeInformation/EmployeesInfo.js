import React from 'react';
import {Tabs} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import './employeesInfo.css';


import notFound from '../../../../images/metroBiocontrol/notFound.svg';
import moment from "moment";


const {TabPane} = Tabs;
const EmployeesInfo = (props) => {

    const {
        employeesId,
        staffData
    }= props
    console.log(staffData)
    const {t} = useTranslation();
    const isDarkMode = useSelector((state) => state.theme.theme_data);

    const onChangeTabs = (key) => {
        // console.log(key);
    }

    return (
        <div className="information_content111">
            <div className='information_content_inner_no_title'>
                <div className="information_content_items">
                    <div className="information_content_title">
                        <div className="title_vertcal_line"></div>
                        {t("Xodim haqida ma’lumot")}
                    </div>
                    <hr/>

                    <div className="employees_info">
                        <Tabs tabPosition={'left'}
                              defaultActiveKey="1"  onChange={onChangeTabs}>

                            <TabPane tab={t("Shaxsiy ma’lumotlar")} key="1">
                                <div className="employees_info_right">
                                    <div className="employees_info_right_title">
                                        I. {t("Shaxsiy ma’lumotlar")}
                                    </div>

                                    <div className="employees_personal_information">
                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    {t("Familiya")}
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.fullname && employeesId.fullname.split(" ")[0] ?
                                                        employeesId.fullname.split(" ")[0] :"-"}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    {t("Tug‘ilgan sana")}
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.date_of_birth && employeesId.date_of_birth}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    {t("Ism")}
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.fullname && employeesId.fullname.split(" ")[1] ?
                                                        employeesId.fullname.split(" ")[1] :"-"}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    {t("Millati")}
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.nationality ? employeesId.nationality : "-"}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    {t("Sharifi")}
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.fullname && employeesId.fullname.split(" ")[2] ?
                                                        employeesId.fullname.split(" ")[2] :"-"}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    {t("Yashash manzili")}
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.address ? employeesId.address : "-"}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="add_relatives_table">
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th className="table_index">{t("Qator")}</th>
                                                    <th>{t("Qarindoshlik")}</th>
                                                    <th>{t("F.I.SH")}</th>
                                                    <th>{t("Tug‘ilgan sana")}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {employeesId.relatives.map((row, index) => (

                                                    <tr key={row.id}>
                                                        <td className="relatives_table_add_icon">{index+1}</td>
                                                        <td>{
                                                            // row.relation

                                                            row.relation==1 ? t('Otasi') :
                                                                row.relation==2 ? t('Onasi') :
                                                                    row.relation==3 ? t('Akasi'):
                                                                        row.relation==4 ? t('Ukasi') :
                                                                            row.relation==5 ? t('Opasi') :
                                                                                row.relation==6 ? t('Singlisi'):
                                                                                    row.relation==7 ? t('Ayoli'):
                                                                                        row.relation==8 ? t(`O'g'li`):
                                                                                            row.relation==9 ?t('Qizi') : ''
                                                        }
                                                        </td>
                                                        <td>{row.fullname}</td>
                                                        <td>{row.date_of_birth}</td>
                                                    </tr>))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </TabPane>

                            <TabPane tab={t("Ta’lim haqida ma’lumot")} key="2">
                                <div className="employees_info_right">
                                    <div className="employees_info_right_title">
                                        II. Ta’lim haqida ma’lumot
                                    </div>

                                    <div className="employees_personal_information">
                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Ta’lim muassasasi nomi
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.education && employeesId.education.institution}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Davri
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.education && moment(employeesId.education.started_date).format('YYYY-MM-DD')}
                                                    ,{'  '}
                                                    {employeesId && employeesId.education && moment(employeesId.education.ended_date).format('YYYY-MM-DD')}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Daraja
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.education &&
                                                    employeesId.education.degree == 1 ? `O'rta maxsus`
                                                    : employeesId.education.degree == 2? `To'liqsiz oliy`
                                                        : employeesId.education.degree ==3 ? `Oliy`
                                                                :employeesId.education.degree ==4 `Phd`

                                                    }
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Diplom seriya va raqami
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.education && employeesId.education.diploma_seria}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Mutaxassislik
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId && employeesId.education && employeesId.education.specialization}
                                                </div>
                                                <hr/>
                                            </div>
                                            {/*<div className="employees_personal_information_item">*/}
                                            {/*    <div className="employees_personal_information_label">*/}
                                            {/*        Holati*/}
                                            {/*    </div>*/}
                                            {/*    <div className="personal_info">*/}
                                            {/*        {employeesId && employeesId.education && employeesId.education.status}*/}
                                            {/*    </div>*/}
                                            {/*    <hr/>*/}
                                            {/*</div>*/}
                                        </div>

                                    </div>

                                </div>
                            </TabPane>

                            <TabPane tab={t("Harbiy ma’lumotnoma")} key="3">
                                <div className="employees_info_right">
                                    <div className="employees_info_right_title">
                                        III. Harbiy ma’lumotnoma
                                    </div>

                                    <div className="employees_personal_information">
                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Guruh hisobi
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.group_account ? employeesId.military_service.group_account : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Harbiy hisob mutaxassisligi
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.specialization ? employeesId.military_service.specialization : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Hisob kategoriyasi
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.account_category ? employeesId.military_service.account_category : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Harbiy xizmat muddati
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.period ? employeesId.military_service.period : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Tarkib
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.content ? employeesId.military_service.content : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Harbiy qism nomi
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.name ? employeesId.military_service.name : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div className="employees_personal_information_inner">
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Harbiy martabasi
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.rank ? employeesId.military_service.rank : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                            <div className="employees_personal_information_item">
                                                <div className="employees_personal_information_label">
                                                    Turar joy
                                                </div>
                                                <div className="personal_info">
                                                    {employeesId.military_service && employeesId.military_service.address ? employeesId.military_service.address : '-'}
                                                </div>
                                                <hr/>
                                            </div>
                                        </div>

                                        <div style={{margin: 15}} className="employees_personal_information_item">
                                            <div className="employees_personal_information_label">
                                                Maxsus hisob raqami
                                            </div>
                                            <div className="personal_info">
                                                {employeesId.military_service && employeesId.military_service.special_account_number ? employeesId.military_service.special_account_number : '-'}
                                            </div>
                                            <hr/>
                                        </div>

                                    </div>

                                </div>
                            </TabPane>

                            <TabPane tab={t("Tayinlanish")} key="4">
                                <div className="employees_info_right">
                                    <div className="employees_info_right_title">
                                        IV. Tayinlanish
                                    </div>

                                    <div className="employees_personal_information">
                                        <div className="employees_personal_information_assignments">
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Sana</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                     <span>
                                                        {employeesId.appointment && employeesId.appointment.the_date ? moment(employeesId.appointment.the_date).format('YYYY-MM-DD') : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Bo’lim</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                    <span>
                                                        {employeesId.appointment && employeesId.appointment.department ? employeesId.appointment.department : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Mutaxassislik</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                    <span>
                                                        {employeesId.appointment && employeesId.appointment.specialization ? employeesId.appointment.specialization : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Razryad</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                   <span>
                                                        {employeesId.appointment && employeesId.appointment.razryad ? employeesId.appointment.razryad : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Asos</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                    <span>
                                                        {employeesId.appointment && employeesId.appointment.basis ? employeesId.appointment.basis : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Holati</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                  <span>
                                                        {employeesId.appointment && employeesId.appointment.status ? employeesId.appointment.status : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </TabPane>

                            <TabPane tab={t("Mehnat tatili")} key="5">
                                <div className="employees_info_right">
                                    <div className="employees_info_right_title">
                                        V. Mehnat ta’tili
                                    </div>

                                    <div className="employees_personal_information">
                                        <div className="employees_personal_information_assignments">
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Ta’til turi ko’rinishi</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                    <span>
                                                        {employeesId.labour_vacation && employeesId.labour_vacation.type ? employeesId.labour_vacation.type : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Ta’til muddati</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                    <span>
                                                        {employeesId.labour_vacation && employeesId.labour_vacation.period ? employeesId.labour_vacation.period : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Mehnat ta’tili boshlanishi</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                   <span>
                                                        {employeesId.labour_vacation && employeesId.labour_vacation.from_date ? moment(employeesId.labour_vacation.from_date ).format('YYYY-MM-DD') : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Mehnat ta’tili tugashi</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                   <span>
                                                        {employeesId.labour_vacation && employeesId.labour_vacation.to_date ? moment(employeesId.labour_vacation.to_date ).format('YYYY-MM-DD') : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="employees_personal_information_assignments_items">
                                                <div className="information_assignments_items_left">
                                                    <span>Asos</span>
                                                </div>
                                                <div className="information_assignments_items_right">
                                                    <span>
                                                        {employeesId.labour_vacation && employeesId.labour_vacation.basis ? employeesId.labour_vacation.basis : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>


                                </div>
                            </TabPane>

                            <TabPane tab={t("Qo‘shimcha ma’lumotlar")} key="6">
                                <div className="employees_info_right">
                                    <div className="employees_info_right_title">
                                        VI. Qo’shimcha ma’lumotlar
                                    </div>

                                    <div className="employees_personal_information">
                                      <div className="not_found">
                                          {
                                              employeesId.extra_info ?
                                                  employeesId.extra_info :
                                                  <div>
                                                      <div className="not_found_img">
                                                          <img src={notFound} alt=""/>
                                                      </div>
                                                      <div className="not_found_title">
                                                          Ma’lumot topilmadi
                                                      </div>
                                                  </div>
                                          }

                                      </div>
                                    </div>
                                </div>
                            </TabPane>

                        </Tabs>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EmployeesInfo;



