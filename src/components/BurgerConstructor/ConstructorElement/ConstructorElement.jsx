import React from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ConstructorElement.module.css';

const ConstructorElementWrapper = ({ 
  type,
  isLocked,
  text,
  price,
  thumbnail,
  handleClose,
  id,
  index,
  moveItem
}) => {
  const ref = React.useRef(null);
  
  // Настройка перетаскивания
  const [{ isDragging }, drag] = useDrag({
    type: 'constructorItem',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Настройка зоны сброса
  const [, drop] = useDrop({
    accept: 'constructorItem',
    hover(item, monitor) {
      if (!ref.current || isLocked) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={styles.filling}
    >
      {!isLocked && <DragIcon type="primary" className={styles.dragIcon} />}
      <ConstructorElement
        type={type}
        isLocked={isLocked}
        text={text}
        price={price}
        thumbnail={thumbnail}
        handleClose={isLocked ? undefined : handleClose}
      />
    </div>
  );
};

ConstructorElementWrapper.propTypes = {
  type: PropTypes.oneOf(['top', 'bottom', undefined]),
  isLocked: PropTypes.bool,
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  thumbnail: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  id: PropTypes.string,
  index: PropTypes.number,
  moveItem: PropTypes.func
};

ConstructorElementWrapper.defaultProps = {
  type: undefined,
  isLocked: false,
  handleClose: undefined,
  id: '',
  index: 0,
  moveItem: () => {}
};

export default ConstructorElementWrapper;