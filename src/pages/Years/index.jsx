import DateBlock from '../../components/DateBlock';
import style from './style.module.css'

function Years() {

  // 5.20-7.24
  let years = ['2020', '2021', '2022', '2023', '2024'];


  return <div className={style.years}>
    {years.map(y => <DateBlock date={y} to={`/${y}`}/>)}
  </div>
}

export default Years