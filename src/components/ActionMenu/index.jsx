import { useMenuToggle } from '../../hooks/useMenuToggle';
import styles from './style.module.css';

function ActionMenu({
  icon,
  openIcon,
  options = [],
  direction = 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  style = {}
}) {
  const { isOpen, toggle, ref, handleBlur } = useMenuToggle();

  const getVisibleOptions = () =>
    options.filter(opt =>
      typeof opt.condition === 'function' ? opt.condition() : opt.condition !== false
    );

  const menuClass = `${styles.menu} ${styles[direction]}`;

  return (
    <div className={styles.wrapper} onBlur={handleBlur} tabIndex={0} style={style.wrapper}>
      <button className={styles.toggleButton} onClick={toggle} style={style.toggleButton}>
        {isOpen ? openIcon : icon}
      </button>
      {isOpen && (
        <div ref={ref} className={menuClass} style={style.menu}>
          {getVisibleOptions().map(({ label, onClick }, idx) => (
            <button
              key={idx}
              className={styles.item}
              style={style.item}
              onClick={onClick}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
