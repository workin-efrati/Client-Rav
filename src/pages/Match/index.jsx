import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useApi from '../../hooks/useApi';
import MatchBlock from '../../components/MatchBlock';
import style from './style.module.css';

function Match() {
    const nav = useNavigate();
    const { year, month, day, id } = useParams();

    const [fontSize, setFontSize] = useState(18);
    const [question, setQuestion] = useState('');
    const [resultObj, setResultObj] = useState([]);

    const { loading, clear, data, get, post, put } = useApi();

    useEffect(() => {
        if (id) {
            get(`msg/${id}`, { params: { enableLogging: true } });
        }
    }, [id]);

    useEffect(() => {
        if (data && data.length > 0) {
            let obj = { qId: data[0]._id, fuq: [] }
            data.forEach((d, i) => {
                if (d.isQuestion && i != 0) {
                    obj.fuq.push({ qId: d._id })
                }
            });
            setResultObj(obj)
            setQuestion(data[0].message || '');
        }
    }, [data]);

    const fuq = !!(data && data[0]?.isFuq);

    const handleNav = (isNext) => {
        get(`msg/${id}/nav`, { params: { nav: isNext, enableLogging: true } })
            .then(res => {
                nav(`/${year}/${month}/${day}/${res}`)
                clear()
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
    };

    const handleSaveQA = () => {
        post(`msg`, { body: resultObj })
            .then(_ => handleNav(1))
    }

    const handleMoveQuestion = (targetId, direction = 1) => {
        const questions = data.filter(item => item.isQuestion);
        const index = questions.findIndex(q => q._id === targetId);

        if (index === -1) return null;

        const isMovingUp = Boolean(direction);
        const isFirst = index === 0;
        const isLast = index === questions.length - 1;

        if ((isMovingUp && isFirst) || (!isMovingUp && isLast)) {
            return null; // אין מה להזיז
        }

        const current = questions[index];
        const neighbor = questions[isMovingUp ? index - 1 : index + 1];

        const neighborDate = new Date(neighbor.date);
        const newDate = new Date(
            neighborDate.getTime() + (isMovingUp ? -1000 : 1000)
        );

        // ודא שהתאריך לא מתנגש עם אחרים
        const allDates = new Set(data.map(i => i.date));
        while (allDates.has(newDate.toISOString())) {
            newDate.setSeconds(newDate.getSeconds() + (isMovingUp ? -1 : 1));
        }

        put(`msg/${targetId}`, { body: { date: newDate.toISOString() }, enableLogging: true })
            .then(() => window.location.reload());

    }

    const handleMoveAnswer = (targetId, direction = 1) => {
        debugger
        const index = data.findIndex(i => i._id === targetId);
        if (index === -1 || data[index].isQuestion) return null;

        const current = data[index];
        const isMovingUp = Boolean(direction);

        // מוצא את השאלה שאחריה התשובה ממוקמת
        const currentQuestionIndex = [...data]
            .slice(0, index)
            .reverse()
            .findIndex(i => i.isQuestion);

        if (currentQuestionIndex === -1) return null;

        const qIndex = index - currentQuestionIndex - 1;
        const currentQuestion = data[qIndex];

        // חיפוש השאלה הקודמת (ל-up) או הבאה (ל-down)
        const otherQuestionIndex = isMovingUp
            ? [...data].slice(0, qIndex).reverse().findIndex(i => i.isQuestion)
            : data.slice(qIndex + 1).findIndex(i => i.isQuestion);

        if (otherQuestionIndex === -1) return null;

        const qOtherIndex = isMovingUp
            ? qIndex - otherQuestionIndex - 1
            : qIndex + 1 + otherQuestionIndex;

        const otherQuestion = data[qOtherIndex];

        const t1 = new Date(isMovingUp ? otherQuestion.date : currentQuestion.date).getTime();
        const t2 = new Date(isMovingUp ? currentQuestion.date : otherQuestion.date).getTime();

        // שים את התשובה בדיוק באמצע בין השאלות
        let newTimestamp = Math.floor((t1 + t2) / 2);
        const allDates = new Set(data.map(i => new Date(i.date).getTime()));

        while (allDates.has(newTimestamp)) {
            newTimestamp += 1;
        }

        put(`msg/${targetId}`, { body: { date: new Date(newTimestamp).toISOString() }, enableLogging: true })
        .then(() => window.location.reload());
    }


    return (
        <div className={style.shut}>
            <div className={style.zoom}>
                <button onClick={() => setFontSize((prev) => prev + 2)}><MdZoomIn /></button>
                <button onClick={() => setFontSize((prev) => prev - 2)}><MdZoomOut /></button>
            </div>

            {loading && <div className={style.loading}>טוען...</div>}

            {data && data.length ? (
                fuq ? (
                    <>
                        {splitBySender(data)
                            .map((group, i, arr) => (
                                <MatchBlock
                                    key={i}
                                    i={i}
                                    data={group}
                                    question={group[0].message}
                                    setQuestion={setQuestion}
                                    answers={group?.slice(1) || []}
                                    fontSize={fontSize}
                                    id={id}
                                    isFuq={fuq}
                                    isLast={i === arr.length - 1}
                                    resultObj={resultObj}
                                    setResultObj={setResultObj}
                                    handleMoveQuestion={handleMoveQuestion}
                                    handleMoveAnswer={handleMoveAnswer}
                                />
                            ))}
                    </>
                ) : (
                    <MatchBlock
                        i={0}
                        data={orderData(data)}
                        fontSize={fontSize}
                        id={id}
                        isFuq={fuq}
                        handleNav={handleNav}
                        isLast={true}
                    />
                )
            ) : (
                <div className={style.loading}>אין נתונים</div>
            )}
            {fuq && <div style={{ marginBottom: '80px' }} />}
            <div className={style.menu}>
                {fuq && isChecked(resultObj) && <button className={style.saveAllFuq} onClick={handleSaveQA}>שמירה</button>}
                <div className={style.nav}>
                    <button className={style.move_button} onClick={() => handleNav(0)}>
                        <IoIosArrowForward />
                        <div>שאלה קודמת</div>
                    </button>
                    <button className={style.move_button} onClick={() => handleNav(1)}>
                        <div>שאלה הבאה</div>
                        <IoIosArrowBack />
                    </button>
                    <Link className={style.exit_button} to={`/${year}/${month}/${day}`}>
                        <TbDoorExit />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Match;

function splitBySender(arr) {
    var helpArr = [];
    var result = [];
    for (let a of arr) {
        if (a.sender === arr[0].sender) {
            helpArr = []
            helpArr.push(a);
            result.push(helpArr);
        } else {
            helpArr.push(a);
        }
    }
    return result
}

function orderData(arr) {
    var helpArr = [];
    let question;
    for (let a of arr) {
        if (!a.isQuestion) {
            helpArr.push(a)
        }
        else question = a
    }
    helpArr.unshift(question)
    return helpArr
}

function isChecked(obj) {
    return obj.aId || obj.fuq?.some(f => f.aId)
}


// function splitBySender(arr = []) {
//     return arr.reduce((acc, msg) => {
//         if (!acc.length || acc[acc.length - 1][0].sender !== msg.sender) {
//             acc.push([msg]);
//         } else {
//             acc[acc.length - 1].push(msg);
//         }
//         return acc;
//     }, []);
// }
