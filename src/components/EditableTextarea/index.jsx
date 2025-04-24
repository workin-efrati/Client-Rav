import { useEffect, useRef } from 'react';
import { MdSave } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';
import styles from './style.module.css';

function EditableTextarea({
  value,
  onChange,
  onSave,
  onCancel,
  autoFocus = true,
  placeholder = '',
  height ,
  style = {},
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
    }
  }, [autoFocus]);

  const handleResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={styles.wrapper} style={style.wrapper}>
      <textarea
        ref={ref}
        className={styles.textarea}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          handleResize(e)
        }}
        placeholder={placeholder}
        style={{...style.textarea,height}}
      />
      <div className={styles.actions} style={style.actions}>
        <button onClick={onSave} className={styles.icon} style={style.icon}>
          <MdSave />
        </button>
        <button onClick={onCancel} className={styles.icon} style={style.icon}>
          <IoIosCloseCircle />
        </button>
      </div>
    </div>
  );
}

export default EditableTextarea;
