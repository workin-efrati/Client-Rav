import { useParams } from 'react-router-dom'
import style from './style.module.css'
import DateBlock from '../../components/DateBlock';
import Move from '../../components/Move';
import SortFilter from '../../components/SortFilter';
import { useState } from 'react';
import useApi from '../../helpers/useApiOld';

function Months() {

  const { year } = useParams();

  const [isDown, setIsDown] = useState(true)
  const [sort, setSort] = useState('date')

  const sortFunc = (a, b) => {
    let big = a.props, little = b.props;
    if (!isDown) { big = b.props; little = a.props }
    return sort === 'date' ? Number(big.to.split('/')[2]) - Number(little.to.split('/')[2])
      : sort === 'percent' ? (big.part / big.total) - (little.part / little.total)
        : big.total - little.total
  }

  let months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

  let numOfMsgs = useApi({ url: 'msg/amount', params: { from: `${year}-01-01`, to: `${year}-12-31` } })

  return <div className={style.all}>
    <Move date={year} />
    <SortFilter isDown={isDown} setIsDown={setIsDown} setSort={setSort} />
    <div className={style.months}>
      {numOfMsgs ?

        numOfMsgs.every(num => num.total === 0) ?
          'אין נתונים להצגה'
          :

          months.map((m, i) => numOfMsgs[i].total !== 0 ?
            <DateBlock date={m} part={numOfMsgs[i].part} total={numOfMsgs[i].total} to={`/${year}/${i + 1}`} />
            : console.log(numOfMsgs[i])) //// ?? change it
            .sort(sortFunc)

        : 'טוען...'}
    </div>
  </div>
}

export default Months