import { useParams } from 'react-router-dom'
import style from './style.module.css'
import Move from '../../components/Move';
import DateBlock from '../../components/DateBlock';
import SortFilter from '../../components/SortFilter';
import { useState } from 'react';
import useApi from '../../helpers/useApi';

function Days() {

  const { year } = useParams();
  const { month } = useParams();

  const [isDown, setIsDown] = useState(true)
  const [sort, setSort] = useState('date')

  const sortFunc = (a, b) => {
    let big = a.props, little = b.props;
    if (!isDown) { big = b.props; little = a.props }
    return sort === 'date' ? Number(big.date[0] + big.date[1]) - Number(little.date[0] + little.date[1])
      : sort === 'percent' ? (big.part / big.total) - (little.part / little.total)
        : big.total - little.total
  }

  let days = []
  for (let i = 1; i <= 31; i++) {
    days.push(i);
  }

  let numOfMsgs = useApi({ url: 'msg/amount', params: { from: `${year}-${month}-1`, to: `${year}-${month}-31` } })

  return <div className={style.all}>
    <Move date={`${month}-${year}`} />
    <SortFilter isDown={isDown} setIsDown={setIsDown} setSort={setSort} />
    <div className={style.days}>
      {numOfMsgs ?
        numOfMsgs.every(num => num.total === 0) ?
          'אין נתונים להצגה'
          :

          days.map(d => numOfMsgs[d].total !== 0 ?
            <DateBlock key={d} date={`${d}.${month}.${year}`} part={numOfMsgs[d].part} total={numOfMsgs[d].total} to={`/${year}/${month}/${d}`} />
            : console.log(numOfMsgs[d])) /// change it!!
            .sort(sortFunc)

        : 'טוען...'}
    </div>
  </div>

}

export default Days