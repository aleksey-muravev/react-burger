import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import IngredientCategory from './IngredientCategory/IngredientCategory';
import styles from './BurgerIngredients.module.css';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/ingredients/actions';

const Ingredient = ({ ingredient, onClick }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { id: ingredient._id },
  });

  return (
    <div 
      ref={dragRef}
      onClick={() => onClick(ingredient)}
      className={styles.ingredient}
    >
      <img src={ingredient.image} alt={ingredient.name} />
      <span className="text text_type_digits-default">{ingredient.price}</span>
      <p className="text text_type_main-default">{ingredient.name}</p>
    </div>
  );
};

const BurgerIngredients = () => {
  const [currentTab, setCurrentTab] = useState('bun');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabsRef = useRef(null);
  const ingredientsListRef = useRef(null);
  const categoriesRef = {
    bun: useRef(null),
    sauce: useRef(null),
    main: useRef(null)
  };
  const dispatch = useDispatch();
  
  const ingredients = useSelector(state => state.ingredients.items);
  const { bun, ingredients: constructorIngredients } = useSelector(state => state.burgerConstructor);

  const ingredientsWithCount = useMemo(() => {
    return ingredients.map(ingredient => {
      let count = 0;
      if (ingredient.type === 'bun' && bun && bun._id === ingredient._id) {
        count = 2;
      } else {
        count = constructorIngredients.filter(item => item._id === ingredient._id).length;
      }
      return { ...ingredient, count };
    });
  }, [ingredients, bun, constructorIngredients]);

  const ingredientsByType = useMemo(() => ({
    bun: ingredientsWithCount.filter(item => item.type === 'bun'),
    sauce: ingredientsWithCount.filter(item => item.type === 'sauce'),
    main: ingredientsWithCount.filter(item => item.type === 'main')
  }), [ingredientsWithCount]);

  useEffect(() => {
    const container = ingredientsListRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let closestCategory = null;
      let smallestDistance = Infinity;

      Object.entries(categoriesRef).forEach(([type, ref]) => {
        if (ref.current) {
          const categoryTop = ref.current.getBoundingClientRect().top;
          const distance = Math.abs(categoryTop - containerTop);
          
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestCategory = type;
          }
        }
      });

      if (closestCategory && currentTab !== closestCategory) {
        setCurrentTab(closestCategory);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentTab]);

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    const categoryElement = categoriesRef[tab].current;
    
    if (ingredientsListRef.current && categoryElement) {
      const scrollPosition = categoryElement.offsetTop - ingredientsListRef.current.offsetTop;
      ingredientsListRef.current.scrollTo({
        top: scrollPosition - 20,
        behavior: 'smooth'
      });
    }
  };

  const handleIngredientClick = (ingredient) => {
    dispatch(setCurrentIngredient(ingredient));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearCurrentIngredient());
  };

  if (!ingredients.length) {
    return <div className="text text_type_main-default">Ингредиенты не найдены</div>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.tabs} ref={tabsRef}>
        <Tab value="bun" active={currentTab === 'bun'} onClick={() => handleTabClick('bun')}>
          Булки
        </Tab>
        <Tab value="sauce" active={currentTab === 'sauce'} onClick={() => handleTabClick('sauce')}>
          Соусы
        </Tab>
        <Tab value="main" active={currentTab === 'main'} onClick={() => handleTabClick('main')}>
          Начинки
        </Tab>
      </div>

      <div className={styles.ingredientsList} ref={ingredientsListRef}>
        {Object.entries(ingredientsByType).map(([type, items]) => (
          <div key={type} ref={categoriesRef[type]}>
            <IngredientCategory
              title={type === 'bun' ? 'Булки' : type === 'sauce' ? 'Соусы' : 'Начинки'}
              items={items}
              onIngredientClick={handleIngredientClick}
              IngredientComponent={Ingredient}
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails />
        </Modal>
      )}
    </section>
  );
};

export default BurgerIngredients;