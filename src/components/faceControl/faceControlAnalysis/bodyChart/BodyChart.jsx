import React from 'react'
import {useTranslation} from "react-i18next";
import ReactApexChart from 'react-apexcharts'

const ApexChart = (props) => {
    const {t} = useTranslation()
    const { data }=props;
    
    // const chartWidth = width < 1370 ? 680 : 1200
    // const chartHeight = width < 1370 ? 320 : 420

    const state = {
        series: [{
            name: t('Jami'),
            data: data ? data.data && data.data.map(item => item.human_count) : []
        }],
        options: {
            chart: {
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false,
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'number',
                categories: data ? data.data && data.data.map(item => item.part) : []
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy, HH:mm:ss'
                },
            },
        },
    }

    return (
        <div id="chart">
            {
                data && data.data &&
                <ReactApexChart options={state.options} series={state.series} type="bar" height={420} />
            }
        </div>
    )
}

export default ApexChart