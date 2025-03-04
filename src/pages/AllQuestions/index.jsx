import { useParams } from 'react-router-dom';
import Move from '../../components/Move'
import style from './style.module.css'
import useApi from '../../helpers/useApi';

import ShutBlock from '../../components/ShutBlock';
import QABlock from '../../components/QABlock';

function AllQuestions() {

    const { year } = useParams();
    const { month } = useParams();
    const { day } = useParams();

    let data = useApi({ url: 'msg', params: { date: `${year}-${month}-${day}`} })    

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
                    <QABlock data={d} type={'q'} to={`/${year}/${month}/${day}/${d._id}`} />)}
        </div>
        <div className={style.answers}>
            <h3>תשובות</h3>
            {data?.filter(m => m.isQuestion === false)
                .map(d =>
                    <QABlock data={d} to={`/${year}/${month}/${day}/${d._id}`} />)}
        </div>
    </div>
}

export default AllQuestions