import { useParams } from 'react-router-dom';
import Move from '../../components/Move'
import style from './style.module.css'
import useApi from '../../helpers/useApi';

import ShutBlock from '../../components/ShutBlock';
import QABlock from '../../components/QABlock';
import { useEffect, useState } from 'react';

function AllQuestions() {

    const { year } = useParams();
    const { month } = useParams();
    const { day } = useParams();

    let data = useApi({ url: 'msg', params: { date: `${year}-${month}-${day}` } })

    // const [data, setData] = useState([])
    // useEffect(() => {
    //     let d = useApi({ url: 'msg', params: { date: `${year}-${month}-${day}` } })
    //     setData(d)

    // }, [])
    
    // if(data !== apiData) setData(apiData)
    // useEffect(() => {
    //     console.log("prevData:", data);
    //     console.log("API Data updated:", apiData);
    //     setData(apiData);  // עדכון הסטייט בכל פעם שהנתונים משתנים
    //     console.log("prevData 2:", data);
    // }, [apiData]);


    return <div className={style.all}>
        <Move date={`${day}.${month}.${year}`} />
        {/* <div className={style.shut}>
            <h3>שו"ת</h3>
            { }
            <ShutBlock to={`/${year}/${month}/${day}/q`} />
            <ShutBlock />
        </div> */}
        <div className={style.questions}>
            <h3>שאלות</h3>
            {data?.filter(m => m.isQuestion === true)
                .map(d =>
                    <QABlock key={d._id} data={d} type={'q'} to={`/${year}/${month}/${day}/${d._id}`} />)}
        </div>
        <div className={style.answers}>
            <h3>תשובות</h3>
            {data?.filter(m => m.isQuestion === false)
                .map(d =>
                    <QABlock key={d._id} data={d} to={`/${year}/${month}/${day}/${d._id}`} />)}
        </div>
    </div>
}

export default AllQuestions