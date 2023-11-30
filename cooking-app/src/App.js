/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useReducer, useEffect, useState, useMemo, createContext, useCallback } from 'react';
import axios from 'axios';
import AddInstruction from './AddInstruction.js';
import InstructionList from './InstructionList.js';
import {LikeButton} from './LikeButton.js';

const ThemeContext = createContext(null);

function instructionReducer(instructions, action) {
  switch (action.type) {
    case 'added': {
      return [...instructions, {
        id: action.id,
        text: action.text,
      }];
    }
    case 'changed': {
      return instructions.map(t => {
        if (t.id === action.instruction.id) {
          return action.instruction;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return instructions.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function App() {

  
  // Uträkning antal personer + useMemo

  const [cnt, setCnt] = useState(1);

  function Multiplier(cnt) {
    return (
      <>
        <h3 css={css`font-size: 20px; font-weight: 700; margin-top: -10px;`}>Recipe for {2 * cnt} persons</h3>
        <button onClick={() => setCnt(cnt+0.5)}>+1 person</button>&nbsp;
        <button onClick={() => cnt >= 1 && setCnt(cnt-0.5)}>-1 person</button>
        <div css={css`margin: 8px 0 30px;`}>
        {amounts.map(amount => (
          <div key={amount.id}>
            {amount.value > 0 ? cnt * amount.value : amount.value} {amount.text}</div>
        ))}
        </div>
      </>
    )
  }

  const MemoMultiplier = useMemo(() => {
    return Multiplier(cnt)
  }, [cnt]);
  


  // Like-knapp med useCallback

  const [like, setLike] = useState(491);


  const likeIncrement = useCallback(() => {
    setLike(like => like + 1);
  }, [setLike]);
  


  // Fetcha data med axios

  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata')
    .then(function (response) {
        setFetchedData(response.data.meals[0]);
    })
    .catch(function (error) {
        console.log('error:', error);
    });
  }, []);


  // Instruktioner add/edit/remove

  const [instructions, dispatch] = useReducer(
    instructionReducer,
    initInstructions
  );

  function handleAddInstruction(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeInstruction(instruction) {
    dispatch({
      type: 'changed',
      instruction: instruction
    });
  }

  function handleDeleteInstruction(instructionId) {
    dispatch({
      type: 'deleted',
      id: instructionId
    });
  };

  const [theme, setTheme] = useState('dark');

  return (
    <>
      <ThemeContext.Provider value={theme}>
        <div className={theme + " App"} css={css`font-family: 'Cormorant Garamond', serif; font-size: 16px; line-height: 1.8; display: flex; align-items: center; justify-content: center; &.dark { background:#12141f; color: #FFF;}`}>
          <div className="inner" css={css`width: 80%; max-width: 600px; padding: 0 0 34px;`}>
            <label css={css`display: block; padding: 10px 0;`}>
              <input
                css={css`margin-left: 0;`}
                type="checkbox"
                checked={theme === 'bright'}
                onChange={(e) => {
                  setTheme(e.target.checked ? 'bright' : 'dark')
                }}
              /><span css={css`display: inline-block; vertical-align: middle; user-select: none;`}>Bright mode</span>
            </label>
            <div css={css`background-image: url("${fetchedData.strMealThumb}"); background-size: cover; background-position: 50% 75%; display: flex; align-items: flex-end; &:after {content: ''; display: block; padding-top: 60%;}`}>
              <h1 css={css`font-family: 'Abril Fatface', serif; margin: 0; padding: 10px; color: #FFF; font-size: 60px; line-height: 1;`}>{fetchedData.strMeal}</h1>
            </div>
            <h3 css={css`font-size: 18px; font-style: italic; font-weight: 300; margin-top: 34px; margin-bottom: 8px;`}>{fetchedData.strCategory}</h3>
            {MemoMultiplier}
            <AddInstruction
              onAddInstruction={handleAddInstruction}
            />
            <InstructionList
              instructions={instructions}
              onChangeInstruction={handleChangeInstruction}
              onDeleteInstruction={handleDeleteInstruction}
            />
            <LikeButton likeIncrement={likeIncrement}/><span>&nbsp;{like}</span>
          </div>
        </div>
      </ThemeContext.Provider>
    </>
  );
}

const amounts = [
  { id: 0, value: 1, text: 'Pound Penne rigate'},
  { id: 1, value: 0.25, text: 'Cup Olive oil'},
  { id: 2, value: 3, text: 'Cloves Garlic'},
  { id: 3, value: 1, text: 'Tin Chopped tomatoes'},
  { id: 5, value: 0.5, text: 'Tbsp Basil'},
  { id: 4, value: 'A sprinkle of', text: 'Chili flakes'}
];

const initInstructions = [
  { id: 0, text: 'Bring a large pot of water to a boil. add salt to the boiling water, then add the pasta. Cook according to the package instructions.'},
  { id: 1, text: 'In a large skillet over medium-high heat, add the olive oil and heat until the oil starts to shimmer. '},
  { id: 2, text: 'Add the garlic and cook, stirring, until fragrant, 1 to 2 minutes'},
  { id: 3, text: 'Add the chopped tomatoes, red chile flakes, Italian seasoning and salt and pepper to taste.'},
  { id: 4, text: 'Bring to a boil and cook for 5 minutes. Remove from the heat and add the chopped basil.'},
  { id: 5, text: 'Drain the pasta and add it to the sauce. Garnish with Parmigiano-Reggiano flakes and more basil and serve'}
];
let nextId = initInstructions.length;