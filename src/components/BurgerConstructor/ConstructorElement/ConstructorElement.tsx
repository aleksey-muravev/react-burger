import React, { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement as BurgerConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ConstructorElement.module.css';

interface ConstructorElementWrapperProps {
  type?: 'top' | 'bottom';
  isLocked?: boolean;
  text: string;
  price: number;
  thumbnail: string;
  handleClose?: () => void;
  id?: string;
  index?: number;
  moveItem?: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  id: string;
  index: number;
}

const ConstructorElementWrapper: FC<ConstructorElementWrapperProps> = ({
  type,
  isLocked = false,
  text,
  price,
  thumbnail,
  handleClose,
  id = '',
  index = 0,
  moveItem = () => {}
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Настройка перетаскивания
  const [{ isDragging }, drag] = useDrag({
    type: 'constructorItem',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Настройка зоны сброса
  const [, drop] = useDrop<DragItem>({
    accept: 'constructorItem',
    hover(item, monitor) {
      if (!ref.current || isLocked) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y ?? 0) - hoverBoundingRect.top;

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
      data-testid={`constructor-element-${index}`}
    >
      {!isLocked && <DragIcon type="primary" className={styles.dragIcon} />}
      <BurgerConstructorElement
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

export default ConstructorElementWrapper;