import { useParams } from 'react-router-dom'
import style from './style.module.css'
import Move from '../../components/Move';
import DateBlock from '../../components/DateBlock';
import SortFilter from '../../components/SortFilter';
import { useEffect, useMemo, useState } from 'react';
import useApi from '../../helpers/useApi';

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

function Days() {

  const { year, month } = useParams();
  const [isDown, setIsDown] = useState(true)
  const [sort, setSort] = useState('date')

  const { loading, error, data, get } = useApi();

  useEffect(() => {
    if (year && month)
      get("msg/amount", { params: { from: `${year}-${month}-1`, to: `${year}-${month}-31` }, enableLogging: true });
  }, [month]);

  const sortedData = useMemo(() => {
    if (!data) return [];
    return days
      .map((d) => data[d])
      .filter((entry) => entry && entry.total !== 0)
      .map((entry, index) => (
        <DateBlock key={index} date={`${days[index]}.${month}.${year}`} part={entry.part} total={entry.total} to={`/${year}/${month}/${days[index]}`} />
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
  }, [data, isDown, sort, month, year]);

  return (
    <div className={style.all}>
      <Move date={`${month}-${year}`} />
      <SortFilter isDown={isDown} setIsDown={setIsDown} setSort={setSort} />
      <div className={style.days}>
        {loading && 'טוען...'}
        {error && 'שגיאה בטעינת הדף'}
        {data && (sortedData.length > 0 ? sortedData : 'אין נתונים להצגה')}
      </div>
    </div>
  );
}

export default Days