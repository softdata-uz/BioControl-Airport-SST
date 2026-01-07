import React from 'react';
import { Image, Space } from 'antd';
import { ZoomInOutlined } from '@ant-design/icons';

import { ip } from '../../../../ip'
import {useTranslation} from "react-i18next";

function ImageDemo(id) {

    const {t} = useTranslation()

    return (
        <Image
            // width={80}
            src={`${ip}/face-detection-service/api/face/face_image/${id.id}`}
            preview={{
                src: `${ip}/face-detection-service/api/face/full_image/${id.id}`,
                maskClassName: 'customize-mask',
                mask: (
                    <Space direction="vertical" align="center">
                        <ZoomInOutlined />
                        {t("Ko'rish")}
                    </Space>
                ),
            }}
        />
    );
}

export default ImageDemo