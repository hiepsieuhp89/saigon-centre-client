import { fNumberMoney } from '@/utils/format-number';
import styles from './thuNhap.module.css';
import { useEffect, useState } from 'react';

// Helper function to generate random agent numbers
const generateRandomAgent = () => {
  const prefixes = ['096', '07', '09', '03'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}***${middle}`;
};

// Helper function to generate random profit
const generateRandomProfit = () => {
  // Generate amount between 20 and 500 điểm
  const amount = Math.floor(20 + Math.random() * 481);
  return `${fNumberMoney(amount)}`;
};

// Helper function to generate current or future date/time
// that is always >= the previous time but <= current system time
const generateDateTime = (prevDateTime: string | null = null) => {
  const now = new Date();
  
  // If there's a previous date, ensure we're not going backward
  if (prevDateTime) {
    const prevDate = new Date(
      prevDateTime.split(' ')[0].split('/').reverse().join('-') + 'T' + 
      prevDateTime.split(' ')[1] + ':00'
    );
    
    // If current time is before previous time, use previous time
    if (now < prevDate) {
      now.setTime(prevDate.getTime());
    }
  }
  
  // Occasionally add a small delay (2-3 seconds) for realism
  if (Math.random() < 0.3) { // 30% chance to add delay
    now.setSeconds(now.getSeconds() + 2 + Math.floor(Math.random() * 2)); // 2-3 seconds
    
    // Make sure we don't exceed current time
    const currentTime = new Date();
    if (now > currentTime) {
      now.setTime(currentTime.getTime());
    }
  }
  
  // No longer adding random minutes to the future
  // now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 31));
  
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Function to generate a complete set of fake data
const generateAgentsIncome = (count = 19, prevData: Array<{datetime: string, agent: string, profit: string}> = []) => {
  const data = [];
  let lastDateTime: string | null = prevData.length > 0 ? prevData[prevData.length - 1]?.datetime : null;
  
  for (let i = 0; i < count; i++) {
    const newDateTime = generateDateTime(lastDateTime);
    data.push({
      agent: generateRandomAgent(),
      profit: generateRandomProfit(),
      datetime: newDateTime
    });
    lastDateTime = newDateTime;
  }
  return data;
};

export default function ThuNhap() {
  const [agentsIncome, setAgentsIncome] = useState(generateAgentsIncome());
  
  // Refresh data every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAgentsIncome(prevData => generateAgentsIncome(19, prevData));
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.marqueeContainer + " !w-full"}>
      <div className={styles.marqueeContent}>
        <div className={styles.slideDaily}>
          {agentsIncome.map((item, index) => (
            <div key={index} className={`${styles.daily} ${styles.flex}`}>
              <span>Đại lý: {item.agent}</span>
              <span>Lợi nhuận: {item.profit}</span>
              <span>Thời gian: {item.datetime}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}