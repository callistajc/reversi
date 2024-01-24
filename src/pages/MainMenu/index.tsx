import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Buttons/Button'
import ActionModal from '../../components/ActionModal';
import style from './mainMenu.module.css'
import { retrieveData } from '../../services/apiServices';
import { validate } from '../../utils/commonUtils';

export default function MainMenu() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();
  
  const goToNewGame = () => {
    navigate('/game');
  }

  const goToHowToPlay = () => {
    navigate('/how-to-play');
  }

  async function handleLoadGame() {
    const response = await retrieveData(id);
    const result = typeof response === "string" ? response : validate(response, id);
    typeof result === "string" ? setErrorMessage(result) : navigate('/game', {state: result});
  }

  function handleCloseModal() {
    setShowModal(false);
    setErrorMessage("");
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setId(e.target.value);
    setErrorMessage("");
  }

  return (
    <>
      <h1 className={style.title}>Reversi</h1>
      <div className={style.mainMenuContainer}>
        <Button name="New Game" onClick={goToNewGame} />
        <Button name="Load Game" onClick={() => setShowModal(true)} />
        <Button name="How To Play" onClick={goToHowToPlay} />
      </div>
      <ActionModal title="Load Game" buttonText="Done" onClose={() => handleCloseModal()} onClick={() => handleLoadGame()} shouldShowModal={showModal}>
          <div className={style.textfield}>
            <input type="text" placeholder="Please enter unique ID" onChange={e => handleOnChange(e)} />
            <p>{errorMessage}</p>
          </div>
      </ActionModal>
    </>
  )
}