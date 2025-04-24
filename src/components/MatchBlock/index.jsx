import { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import AnswerBlock from '../AnswerBlock';
import useApi from '../../hooks/useApi';
import dates from '../../helpers/dates';
import { IoMdClose } from 'react-icons/io';
import ActionMenu from '../ActionMenu';
import EditableTextarea from '../EditableTextarea';
import { SlOptionsVertical } from 'react-icons/sl';

function MatchBlock({ i, data, fontSize, id, isFuq, handleNav, isLast, resultObj, setResultObj,handleMoveQuestion,handleMoveAnswer }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [active, setActive] = useState({ id: '', s: 0 });
  const [content, setContent] = useState(data[0].message);
  const [time, setTime] = useState(1);
  const [answersLocal, setAnswersLocal] = useState(data.slice(1));
  const divRef = useRef();
  const { get, put, del } = useApi();

  const height = divRef.current?.offsetHeight;

  const toggleEditMode = () => setIsEditMode(prev => !prev);

  const handleCancelFuq = () => {
    const sender = `${data[0].sender}_${new Date().getHours()}${new Date().getMinutes()}`;
    put(`msg/${data[0]._id}`, { body: { sender, isFuq: false }, enableLogging: true })
      .then(() => window.location.reload());
  };

  const handleSave = () => {
    put(`msg/${id}`, { body: { message: content }, enableLogging: true })
      .then(res => setContent(res.message));
    setIsEditMode(false);
  };

  const handleDelete = () => {
    const ids = active.id && active.s === 1 ? [id, active.id] : [id];
    del(`msg`, { body:  ids  }, { enableLogging: true })
      .then(() => (i === 0 ? handleNav(1) : window.location.reload()));
    setIsEditMode(false);
  };

  const handleShowMore = () => {
    get(`msg/${id}`, { params: { time: time + 1, isQuestion : false }, enableLogging: true })
      .then(res => {
        setAnswersLocal(res.slice(1));
        setTime(prev => prev + 1);
      });
  };

  useEffect(() => {
    if (active.id && resultObj) {
      const obj = { ...resultObj };
      if (i === 0) obj.aId = active.s === 1 ? active.id : undefined;
      else {
        const f = obj.fuq.find(o => o.qId === data[0]._id);
        if (f) f.aId = active.s === 1 ? active.id : undefined;
      }
      setResultObj(obj);
    }
  }, [active]);

  return (
    <div className={style.one}>
      <div className={style.title}>
        <h3>
          {isFuq ? (i === 0 ? 'שאלה ראשית' : `שאלת המשך (${i})`) : 'שאלה'}
        </h3>

        {isEditMode ? (
          <EditableTextarea
            value={content}
            onChange={setContent}
            onSave={handleSave}
            onCancel={toggleEditMode}
            height={height}
          />
        ) : (
          <p className={style.q_content} style={{ fontSize }} ref={divRef}>{content}</p>
        )}

        {!isEditMode && (
          <ActionMenu
            icon={<SlOptionsVertical />}
            openIcon={<IoMdClose />}
            direction="bottom-left"
            style={{wrapper:{direction: 'ltr'}}}
            options={[
              { label: 'עריכה', onClick: toggleEditMode },
              { label: 'ביטול שאלת המשך', onClick: handleCancelFuq, condition: isFuq },
              { label: 'מחק שאלה בלבד', onClick: handleDelete },
              { label: 'מחק שאלה ותשובה', onClick: handleDelete, condition: active.s === 1 },
              { label: 'העבר למעלה', onClick: ()=>handleMoveQuestion(data[0]._id,1) },
              { label: 'העבר למטה', onClick: ()=>handleMoveQuestion(data[0]._id,0) },
            ]}
          />
        )}

        <div>{dates.formatDate(data[0]?.date)}</div>
      </div>

      {!isFuq || (isFuq && i === 0) ? <div className={style.line}></div> : null}

      <div className={style.answers}>
        {answersLocal.map(a => (
          <AnswerBlock
            key={a._id}
            content={a.message}
            date={a.date}
            _id={a._id}
            setActive={setActive}
            active={active}
            handleNav={handleNav}
            setAnswers={setAnswersLocal}
            isFuq={isFuq}
            handleMoveAnswer={handleMoveAnswer}
          />
        ))}
      </div>

      <div className={style.load}>
        <div className={style.line} />
        {isLast && <button onClick={handleShowMore}>טען עוד</button>}
      </div>
    </div>
  );
}

export default MatchBlock;
