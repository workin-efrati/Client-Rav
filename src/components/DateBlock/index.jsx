import { Link } from 'react-router-dom'
import style from './style.module.css'


function DateBlock({date, part, total=null, to}) {    

    let percent = total == 0 ? 0 : Math.trunc((part/total)*100);
    let colorOfPercent = 'zero';
    if(percent > 0) colorOfPercent = 'low';
    if(percent >= 90) colorOfPercent = 'high';


    return <Link className={style.button} key={date} to={to}>
        {total !== null ?
        <div className={style.full}>
            <div className={`${style.percent} ${style[colorOfPercent]}`}>{percent}%</div>
            <h3>{part} / {total}</h3>
            <div className={style.date}>{date}</div>
        </div>
        :
        <div className={style.date_only}>{date}</div>
        }
    </Link>
}

export default DateBlock