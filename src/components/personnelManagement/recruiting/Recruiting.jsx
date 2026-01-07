// import React from 'react';
//
//
// import './recruiting.css';
// import {Tabs} from "antd";
// import {useTranslation} from "react-i18next";
// import {useSelector} from "react-redux";
//
//
//
//
// const {TabPane} = Tabs;
// const Recruiting = () => {
//
//     const {t} = useTranslation();
//     const isDarkMode = useSelector((state) => state.theme.theme_data);
//     const onChangeTabs = (key) => {
//         // console.log(key);
//     }
//
//     return (
//         <div className="information_content">
//             <div className="information_content_inner">
//                 <div className="information_content_title">
//                     <div className="title_vertcal_line"></div>
//                     Ma’lumotnoma berish
//                 </div>
//                 <hr/>
//
//                 <div className="recruiting_info">
//                         <Tabs tabPosition={'left'}
//                               defaultActiveKey="1"  onChange={onChangeTabs}>
//
//                             <TabPane tab={t("Shaxsiy ma’lumotlar")} key="1">
//                                 <div className="recruiting_info_right">
//                                     <div className="recruiting_info_right_title">
//                                         I. Shaxsiy ma’lumotlar
//                                     </div>
//
//                                     <div className="recruiting_personal_information">
//                                         <div className="recruiting_personal_information_inner">
//                                             <div className="recruiting_personal_information_item">
//                                                 <div className="recruiting_personal_information_label">
//                                                     Familiya
//                                                 </div>
//                                                 <div className="personal_info">
//                                                     Istamov
//                                                 </div>
//                                                 <hr/>
//                                             </div>
//                                             <div className="recruiting_personal_information_item">
//                                                 <div className="recruiting_personal_information_label">
//                                                     Tug‘ilgan sana
//                                                 </div>
//                                                 <div className="personal_info">
//                                                     09.04.1997
//                                                 </div>
//                                                 <hr/>
//                                             </div>
//                                         </div>
//
//                                         <div className="recruiting_personal_information_inner">
//                                             <div className="recruiting_personal_information_item">
//                                                 <div className="recruiting_personal_information_label">
//                                                     Ism
//                                                 </div>
//                                                 <div className="personal_info">
//                                                     Xurshid
//                                                 </div>
//                                                 <hr/>
//                                             </div>
//                                             <div className="recruiting_personal_information_item">
//                                                 <div className="recruiting_personal_information_label">
//                                                     Millati
//                                                 </div>
//                                                 <div className="personal_info">
//                                                     O‘zbek
//                                                 </div>
//                                                 <hr/>
//                                             </div>
//                                         </div>
//
//                                         <div className="recruiting_personal_information_inner">
//                                             <div className="recruiting_personal_information_item">
//                                                 <div className="recruiting_personal_information_label">
//                                                     Otasining ismi
//                                                 </div>
//                                                 <div className="personal_info">
//                                                     Hazratqul o‘g‘li
//                                                 </div>
//                                                 <hr/>
//                                             </div>
//                                             <div className="recruiting_personal_information_item">
//                                                 <div className="recruiting_personal_information_label">
//                                                     Yashash manzili
//                                                 </div>
//                                                 <div className="personal_info">
//                                                     Toshkent shahri, Shayxontohir tumani, Chorsu MFY 6/94
//                                                 </div>
//                                                 <hr/>
//                                             </div>
//                                         </div>
//
//                                     </div>
//
//                                 </div>
//                             </TabPane>
//
//                         </Tabs>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Recruiting;