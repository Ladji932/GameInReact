import { useState } from 'react';
import Login from './components/login';
import SelectCharacter from './components/selectCharacter';
import Fight from './components/figth'; 
import data from './assets/data.json';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState(data);


  const redirectCharacter = () => {
    setSelectedCharacter(null);
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    localStorage.setItem('Personnage',JSON.stringify(character))
    console.log('Personnage sélectionné:', character.name);
  };

  const handleCharacterUpdate = (updatedCharacters) => {
    setCharacters(updatedCharacters);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className='app'>
      {isLoggedIn ? (
        selectedCharacter ? (
          <Fight character={selectedCharacter} redirect={redirectCharacter} />
        ) : (
          <SelectCharacter
            characters={characters}
            characterSelect={handleCharacterSelect}
            onCharacterUpdate={handleCharacterUpdate}
          />
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
