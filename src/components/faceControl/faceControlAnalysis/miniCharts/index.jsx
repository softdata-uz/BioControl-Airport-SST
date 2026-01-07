import React from 'react'
import ReactApexChart from 'react-apexcharts'

const ApexChart = (props) => {
  const lang = localStorage.getItem('i18nextLng');
  const { data } = props;
  // console.log(data);
  const state = {
    series: [{
      name: lang === 'uz'? data?.title_uz : lang === 'ru' ? data?.title_ru : data?.title_en,
      data: data && data.data
    }],
    options: {
      chart: {
        // type: 'area'
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        show: false,
        showAlways: false,
        labels: {
          show: false
        },
        // type: 'number',
        categories: data && data.category,
      
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        // theme: 'dark',
        x: {
          format: 'dd/MM/yy HH:mm',
          show: false,
        },
      },
      // colors: ["#3E82F7", "#CC74B9", "#B82929", "#29B85D"],
      colors: data && [data.color],
      grid: {
        show: false,      // you can either change hear to disable all grids
      },
      
    },  
  };

    return (
      <div id="chart" className='mini-charts'>
        {
          data && data.data && 
            <ReactApexChart options={state.options} series={state.series} type="area" width={355} height={120} />
        }
      </div>
    )
  }

export default React.memo(ApexChart)