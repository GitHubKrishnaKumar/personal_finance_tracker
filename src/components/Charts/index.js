import React from 'react';
import { Line,Pie } from '@ant-design/plots';
function ChartComponent({sortedTransaction}) {

    const data = sortedTransaction.map((item) =>{
        return {date: item.date, amount: item.amount};
    });


    const config = {
        data,
        width:800,
        autoFil: false,
        xField: 'date',
        yField: 'amount',
    };
    
    let chart;
    // let pieChart;
  return (
    <div className='charts-wrapper'>
        <div>
            <h2>your Analytics</h2>
            <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </div>
        <div>
            {/* <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)}/> */}
            <h2>Your Speedings</h2>
        </div>
    </div>
    
  )
}

export default ChartComponent