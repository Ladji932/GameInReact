import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '../header';

const Character = ({ characterSelect, characters: initialCharacters, onCharacterUpdate }) => {

  const generatorSpeed = () => {
    let numberSpeed = Math.floor(Math.random() * 11) + 100;
    return numberSpeed;
  };
  const generatorStrength = () => {
    let numberStrength = Math.floor(Math.random() * (1500 - 1300 + 1)) + 1300;
    return numberStrength;
  };
  const generatorDefense = () => {
    let numberDefense = Math.floor(Math.random() * (900 - 800 + 1)) + 800;
    return numberDefense;
  };
  const generatorStamina = () => {
    let numberStamina =  Math.floor(Math.random() * (24000 - 21000 + 1)) + 21000;
    return numberStamina;
  };

  const [characters, setCharacters] = useState([]);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    strenght: generatorStrength(),
    speed: generatorSpeed(),
    defense: generatorDefense(),
    techniques: ["","","",""],
    picture: '',
    stamina: generatorStamina()
  });

  useEffect(() => {
    console.log(initialCharacters)
    const storedCharacters = localStorage.getItem('Characters');
    if (storedCharacters) {
      setCharacters(JSON.parse(storedCharacters));
    } else {
      setCharacters(initialCharacters || []);
      localStorage.setItem('Characters', JSON.stringify(initialCharacters || []));
    }
  }, [initialCharacters]);

  const onAddCharacter = () => {
    const maxLocalStorageCapacity = 5242880; 
    const storedCharacters = JSON.parse(localStorage.getItem('Characters')) || [];
  
    const updatedCharacters = [...characters, { ...newCharacter, id: uuidv4() }];
    const updatedCharactersSize = JSON.stringify(updatedCharacters).length * 2; // Taille en octets
  
    if (updatedCharactersSize >= maxLocalStorageCapacity) {
      alert("Étant donné que le stockage local est actuellement plein, vous pourriez envisager de prioriser l'utilisation d'images au format WebP pour réduire la taille des fichiers ou de supprimer certains personnages de votre roster actuel")
      return;
    }

    if (
      !newCharacter.name ||
      !newCharacter.strenght ||
      !newCharacter.speed ||
      !newCharacter.defense ||
      !newCharacter.techniques[0] ||
      !newCharacter.picture ||
      !newCharacter.stamina
    ) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }
    const characterWithId = { ...newCharacter, id: uuidv4() };
    const updatedCharacters2 = [...characters, characterWithId];
    onCharacterUpdate(updatedCharacters2);
    localStorage.setItem('Characters', JSON.stringify(updatedCharacters2));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'technique') {
      const updatedTechniques = [...newCharacter.techniques];
      updatedTechniques[index] = value;
      setNewCharacter(prevCharacter => ({
        ...prevCharacter,
        techniques: updatedTechniques
      }));
    } else {
      setNewCharacter(prevCharacter => ({
        ...prevCharacter,
        [name]: value
      }));
    }
  };

  const deleteCharacter = (id) => {
    if (id === 1 || id === 2) {
      alert("Les joueurs 1 et 2 ne peuvent pas être supprimés.");
      return;
    }
    const updatedCharacters = characters.filter(character => character.id !== id);
    setCharacters(updatedCharacters);
    const updatedLocalStorage = JSON.parse(localStorage.getItem('Characters')).filter(character => character.id !== id);
    localStorage.setItem('Characters', JSON.stringify(updatedLocalStorage));
  };

  return (
    <div className='ruster'>
      <h1>Listes des personnages</h1>
      <div className='characters-grid'>
        {characters.map((character, index) => (
          <div key={index} className='character'>
            <h2>{character.name}</h2> 
            <img src={character.picture} alt={character.name} onClick={() => characterSelect(character)} />
            {character.id === 1 || character.id === 2 ? (
              <button disabled style={{ display: 'none' }}>Supprimer</button>
            ) : (
              <button onClick={() => deleteCharacter(character.id)}>X</button>
            )}
          </div>
        ))}
      </div>

      <footer>
        <form onSubmit={(e) => {
          e.preventDefault();
          onAddCharacter();
        }}>
          <h2>Générer votre personnage !!!</h2>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newCharacter.name}
            onChange={handleChange}
          />
          <input
            style={{ display: "none" }}
            type="text"
            placeholder="Strenght"
            name="strenght"
            value={newCharacter.strenght}
            onChange={handleChange}
          />
          <input
            style={{ display: "none" }}
            type="text"
            placeholder="Speed"
            name="speed"
            value={newCharacter.speed}
            onChange={handleChange}
          />
          <input
            style={{ display: "none" }}
            type
                         style={{ display: "none" }}
            type="text"
            placeholder="Defense"
            name="defense"
            value={newCharacter.defense}
            onChange={handleChange}
          />
         {/* Techniques input fields */}
        {[0, 1, 2, 3].map(index => (
            <input
              key={index}
              type="text"
              placeholder={`Technique ${index + 1}`}
              name="technique"
              value={newCharacter.techniques[index]}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
          <input
            type="file"
            accept="image/*"
            name="picture"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                setNewCharacter((prevCharacter) => ({
                  ...prevCharacter,
                  picture: event.target.result 
                }));
              };
              reader.readAsDataURL(file);
            }}
          />
          <input
            style={{ display: "none" }}
            type="text"
            placeholder="Vie"
            name="stamina"
            value={newCharacter.stamina}
            onChange={handleChange}
          />
          <button type="submit">Add Character</button>
        </form>
      </footer>
    </div>
  );
};

export default Character;
