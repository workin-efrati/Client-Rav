import { useParams } from 'react-router-dom';
import Move from '../../components/Move'
import style from './style.module.css'
import useApi from '../../hooks/useApi';
import QABlock from '../../components/QABlock';
import { useEffect, useMemo } from 'react';

function AllQuestions() {

    const { year, month, day } = useParams();
    const { loading, error, data, get } = useApi();

    useEffect(() => {
        if (year && month && day)
            get("msg", { params: { date: `${year}-${month}-${day}` }, enableLogging: true });
    }, [day]);

    const { questions, answers } = useMemo(() => {
        if (!data) return { questions: [], answers: [] };

        const questions = [];
        const answers = [];

        data.forEach(m => {
            if (m.isQuestion) {
                return questions.push(
                    <QABlock key={m._id} data={m} type={'q'} to={`/${year}/${month}/${day}/${m._id}`} />
                );
            }
            answers.push(
                <QABlock key={m._id} data={m} to={`/${year}/${month}/${day}/${m._id}`} />
            );
        });

        return { questions, answers };
    }, [data, year, month, day]);

    return (
        <div className={style.all}>
            {loading && 'טוען...'}
            {error && 'שגיאה בטעינת הדף'}

            <Move date={`${day}.${month}.${year}`} />

            <div className={style.questions}>
                <h3>שאלות</h3>
                {questions.length > 0 ? questions : 'אין שאלות'}
            </div>

            <div className={style.answers}>
                <h3>תשובות</h3>
                {answers.length > 0 ? answers : 'אין תשובות'}
            </div>
        </div>
    );
}

export default AllQuestions