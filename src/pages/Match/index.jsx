import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useApi from '../../helpers/useApi';
import MatchBlock from '../../components/MatchBlock';
import style from './style.module.css';

function Match() {
    const nav = useNavigate();
    const { year, month, day, id } = useParams();

    const [fontSize, setFontSize] = useState(18);
    const [question, setQuestion] = useState('');
    const [resultObj, setResultObj] = useState([]);

    const { loading, clear, data, get, post } = useApi();

    useEffect(() => {
        if (id) {
            get(`msg/${id}`, { params: { enableLogging: true } });
        }
    }, [id]);

    useEffect(() => {
        if (data && data.length > 0) {
            let obj = { qId: data[0]._id, fuq: [] }
            data.forEach((d,i) => {
                if (d.isQuestion && i != 0) {
                    obj.fuq.push({qId : d._id})
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
                console.log('res ', res);
                
                nav(`/${year}/${month}/${day}/${res}`)
                clear()
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
    };

    const handleSaveQA = () => {
        post(`msg`, { body: resultObj })
            .then(_ => handleNav(1))
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
    return obj.aId && obj.fuq.every(f=>f.aId)
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
