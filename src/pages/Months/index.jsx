import { useParams } from 'react-router-dom'
import style from './style.module.css'
import DateBlock from '../../components/DateBlock';
import Move from '../../components/Move';
import SortFilter from '../../components/SortFilter';
import { useEffect, useMemo, useState } from 'react';
import useApi from '../../helpers/useApi';

const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
// const months = [{num : 1, name: 'ינואר'}, {num : 2, name: 'פברואר'}, {num : 3, name: 'מרץ'}, {num : 4, name: 'אפריל'}, {num : 5, name: 'מאי'}, {num : 6, name: 'יוני'}, {num : 7, name: 'יולי'}, {num : 8, name: 'אוגוסט'}, {num : 9, name: 'ספטמבר'}, {num : 10, name: 'אוקטובר'}, {num : 11, name: 'נובמבר'}, {num : 12, name: 'דצמבר'}]

function Months() {

  const { year } = useParams();
  const [isDown, setIsDown] = useState(true)
  const [sort, setSort] = useState('date')

  const { loading, error, data, get } = useApi();

  useEffect(() => {
    if (year)
      get("msg/amount", { params: { from: `${year}-01-01`, to: `${year}-12-31` }, enableLogging: true });
  }, [year]);

  const sortedData = useMemo(() => {
    if (!data) return [];
    return months
      .map((m, i) => data[i])
      .filter((entry) => entry && entry.total !== 0)
      .map((entry, index) => (
        <DateBlock key={index} date={months[index]} part={entry.part} total={entry.total} to={`/${year}/${index + 1}`} />
      ))
      .sort((a, b) => {
        let big = a.props,
          little = b.props;
        if (!isDown) [big, little] = [little, big];

        return sort === 'date'
          ? Number(big.date.split('.')[0]) - Number(little.date.split('.')[0])
          : sort === 'percent'
            ? big.part / big.total - little.part / little.total
            : big.total - little.total;
      });
  }, [data, isDown, sort, year]);

  return <div className={style.all}>
    <Move date={year} />
    <SortFilter isDown={isDown} setIsDown={setIsDown} setSort={setSort} />
    <div className={style.months}>
      {loading && 'טוען...'}
      {error && 'שגיאה בטעינת הדף'}
      {data && (sortedData.length > 0 ? sortedData : 'אין נתונים להצגה')}
    </div>
  </div>
}

export default Months