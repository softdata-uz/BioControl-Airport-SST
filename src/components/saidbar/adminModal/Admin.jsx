// import React from 'react';
//
// import './admin.css'
// const Admin = () => {
//     return (
//         <div>
//             <Modal
//                 isOpen={open}
//                 onRequestClose={cancel}
//                 contentLabel="My dialog"
//                 className="mymodal"
//                 overlayClassName="myoverlay"
//                 closeTimeoutMS={0}
//             >
//                 <Form
//                     name="basic"
//                     layout="vertical"
//                     requiredMark='optional'
//                     onFinish={addStaff}
//                     onFinishFailed={onFinishFailed}
//                     autoComplete="off"
//                     initialValues={user}
//                 >
//                     <div className="admin_modal">
//                         <div className="admin_modal_head">
//                             <h2>{t("Admin ma'lumotlarini o'zgartirish")}</h2>
//                         </div>
//                         <div className="admin_modal_uploadImg">
//                             <div className="admin_modal_uploadImg_left">
//                                 <div className="admin_modal_uploadImg_left_inner">
//                                     {
//                                         user && !imageState.check ?
//                                             <img src={`${ip}/${user?.image}`} className="img1"/> :
//                                             imageState.uploaded ? <img src={view} className="img1"/>
//                                                 : <img src={modalImg} className="img2"/>}
//                                 </div>
//                             </div>
//                             <div className="admin_modal_uploadImg_right">
//                                 <div className="admin_modal_uploadImg_right_inner">
//                                     <label htmlFor='add_staff_img' className="upload_button">
//                                         <div className="upload_button_icon">
//                                             {/*<img src={UploadIcon} style={{marginRight: "8px"}}/>*/}
//                                             <CiImageOn size={22} style={{marginRight: "8px"}}/>{t("Rasm yuklash")}
//                                         </div>
//                                         <input onChange={upload} name='image' type="file"
//                                                id="add_staff_img"
//                                                style={{display: 'none'}}
//                                                className=""
//                                         />
//                                     </label>
//                                     <div className="upload_button_text">
//                                         <span>{t("Maksimal fayl hajmi 1 Mb 500х500 o'lchamda")}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="admin_modal_form">
//
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Familiya")}</span>
//                                 <Form.Item name="lastname" rules={
//                                     [{
//                                         required: true,
//                                         message: t("Familiyani kiriting")
//                                     }]
//                                 }>
//                                     <Input placeholder={t("Kiriting")}/>
//                                 </Form.Item>
//                             </div>
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Ism")}</span>
//                                 <Form.Item name="firstname" rules={
//                                     [{
//                                         required: true,
//                                         message: t("Ism kiriting")
//                                     }]
//                                 }>
//                                     <Input placeholder={t("Kiriting")}/>
//                                 </Form.Item>
//                             </div>
//
//                         </div>
//
//                         <div className="admin_modal_form_one">
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Otasining ismi")}</span>
//                                 <Form.Item name="fathersname" rules={[{
//                                     required: true,
//                                     message: "Otasining ismini kiriting"
//                                 }]}>
//                                     <Input placeholder={t("Kiriting")}/>
//                                 </Form.Item>
//                             </div>
//                         </div>
//
//
//                         <div className="admin_modal_form" style={{marginTop: "0"}}>
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Login")}</span>
//                                 <Form.Item name="login" rules={[{
//                                     required: true,
//                                     message: t("Login kiriting")
//                                 }]}>
//                                     <Input placeholder={t("Kiriting")}/>
//                                 </Form.Item>
//                             </div>
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Parol")}</span>
//                                 <Form.Item name="old_password" rules={[{
//                                     required: true,
//                                     message: t("Parol kiriting")
//                                 }]} type="password">
//                                     {/*<Input placeholder="Kiriting"/>*/}
//                                     <Input.Password placeholder={t("Kiriting")}/>
//                                 </Form.Item>
//                             </div>
//
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Yangi parol")}</span>
//                                 <Form.Item
//                                     name="password"
//                                     rules={[
//                                         {
//                                             required: true,
//                                             message: t("Yangi parolni kiriting"),
//                                         },
//                                     ]}
//                                     hasFeedback
//                                 >
//                                     <Input.Password placeholder={t("Kiriting")}/>
//                                 </Form.Item>
//
//
//                             </div>
//
//                             <div className="admin_modal_form_input">
//                                 <span>{t("Yangi parolni tasdiqlash")}</span>
//                                 <Form.Item
//                                     name="confirm_password"
//                                     dependencies={['password']}
//                                     hasFeedback
//                                     rules={[
//                                         {
//                                             required: true,
//                                             message: t("Tasdiqlash parolini kiriting"),
//                                         },
//                                         ({getFieldValue}) => ({
//                                             validator(_, value) {
//                                                 if (!value || getFieldValue('password') === value) {
//                                                     return Promise.resolve();
//                                                 }
//                                                 return Promise.reject(new Error(t("Parol noto'g'ri kiritildi!")));
//                                             },
//                                         }),
//                                     ]}
//                                 >
//                                     <Input.Password placeholder={"Kiriting"}/>
//                                 </Form.Item>
//                             </div>
//
//                         </div>
//                         <div className="admin_modal_form_buttons">
//                             <div className="admin_modal_form_buttons_one">
//                                 <button type="button" className="admin_modal_form_buttons_left"
//                                         onClick={() => cancel()}>{t("Bekor qilish")}
//                                 </button>
//                             </div>
//                             <div>
//                                 <button type="submit" className="admin_modal_form_buttons_right">{t("Saqlash")}</button>
//                             </div>
//                         </div>
//
//                     </div>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };
//
// export default Admin;