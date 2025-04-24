import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.css';
import { SlOptionsVertical } from 'react-icons/sl';
import { IoMdClose } from 'react-icons/io';
import { MdSave } from 'react-icons/md';
import useApi from '../../hooks/useApi';
import ActionMenu from '../ActionMenu';
import EditableTextarea from '../EditableTextarea';

function QABlock({ data, type, to }) {
  const { message, _id, isQuestion, date } = data;
  const { put, get, del } = useApi();
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState(message);
  const [isContentOpen, setIsContentOpen] = useState(false);

  const toggleEdit = () => setIsEditMode(prev => !prev);

  const handleSave = async () => {
    const res = await put(`msg/${_id}`, { body: { message: content } });
    setContent(res.message);
    setIsEditMode(false);
  };

  const handleToggleType = () => {
    put(`msg/${_id}`, { body: { isQuestion: !isQuestion } })
      .then(res => setContent(res.message));
  };

  const handleDelete = async () => {
    await del('msg', { body: [_id]  });
  };

  const handleShiftDate = (offset) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    put(`msg/${_id}`, { body: { date: newDate } })
      .then(res => setContent(res.message));
  };

  return (
    <div className={content ? style.block : style.close}>
      {isEditMode ? (
        <EditableTextarea
          value={content}
          onChange={setContent}
          onSave={handleSave}
          onCancel={toggleEdit}
        />
      ) : type === 'q' ? (
        <Link to={to}><p>{content}</p></Link>
      ) : (
        <button
          className={isContentOpen ? style.content_open : style.content_close}
          onClick={() => setIsContentOpen(prev => !prev)}
        >
          {content}
        </button>
      )}

      {!isEditMode && content && (
        <ActionMenu
          icon={<SlOptionsVertical />}
          openIcon={<IoMdClose />}
          direction="bottom-left"
          options={[
            { label: type === 'q' ? 'הגדר כתשובה' : 'הגדר כשאלה', onClick: handleToggleType },
            { label: type === 'q' ? 'ערוך שאלה' : 'ערוך תשובה', onClick: toggleEdit },
            { label: type === 'q' ? 'מחק שאלה' : 'מחק תשובה', onClick: handleDelete },
            { label: 'העבר ליום הקודם', onClick: () => handleShiftDate(-1) },
            { label: 'העבר ליום הבא', onClick: () => handleShiftDate(1) },
          ]}
          style={{item:{'fontSize': '20px'}, menu:{'minWidth': '180px'}}}
        />
      )}
    </div>
  );
}

export default QABlock;
