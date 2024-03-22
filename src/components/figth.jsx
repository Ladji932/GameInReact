import React, { useEffect, useState } from "react";
import Header from "../header";

const Fight = ({ character, characterSelect , redirect }) => {
  const [opponent, setOpponent] = useState(null);
  const [stamina1, setStamina1] = useState(character.stamina);
  const [stamina2, setStamina2] = useState(true);
  const [turn, setTurn] = useState(1);
  const [comment, setComment] = useState("Pret ?");
  const [isAttacking, setIsAttacking] = useState(false);

  useEffect(() => {
    let storedCharacters = localStorage.getItem('Characters');
    if (storedCharacters) {
      const allCharacters = JSON.parse(storedCharacters);
      const filteredCharacters = allCharacters.filter((char) => char.name !== character.name);
      if (filteredCharacters.length === 0) {
        alert("Il n'y a pas d'adversaire disponible !");
        return;
      }
      const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
      const randomOpponent = filteredCharacters[randomIndex];
      setOpponent(randomOpponent);
      setStamina2(randomOpponent.stamina);
    } else {
      alert("Aucun personnage dans le roster");
    }
  }, []);

  

  useEffect(() => {
    if (stamina1 <= 0 || stamina2 <= 0) {
      if (stamina1 <= 0) {
        setComment(`${opponent.name} inflige le coup de grace`);
        setStamina2(30000)
        localStorage.setItem('isPlaying', 'false');
      } else {
        localStorage.setItem('isPlaying', 'false');
        setComment(`${character.name} inflige le coup de grace`);
        setStamina1(30000)
      }
      setTimeout(() => {
        redirect();
        return
      }, 3000);
    }
  }, [stamina1, stamina2, opponent, character, redirect]);


function goFight2(selectedTechnique) {
  if (isAttacking) return;
  setIsAttacking(true);
  const skillsOpponent = opponent.techniques;
  const skillOpponentIndex = Math.floor(Math.random() * skillsOpponent.length);
  const randomTechnique = skillsOpponent[skillOpponentIndex];

  let attack, defender;
  attack = character;
  defender = opponent;
  performAttack(attack, defender, selectedTechnique);
  if (turn) {
    setTimeout(() => {
      performAttack(defender, attack, randomTechnique);
      setIsAttacking(false);
    }, 2000);
  } else {
    setIsAttacking(false);
  }
  }
  
function performAttack(attack, defender, selectedTechnique) {
  let damage;
  const randomChance = randChance();
  console.log(randomChance)
  
  if (randomChance === 2) {
    setComment(`coup critique normal de ${attack.name} avec l'attaque ${selectedTechnique}`);
    damage = damageCritique(attack, defender);
  } else if (randomChance === 5) {
    setComment(`super coup critique de ${attack.name} avec l'attaque ${selectedTechnique}`);
    damage = damageSuperCritique(attack, defender);
  } else if (randomChance === 6 && turn > 3) { 
    if (attack === character) {
      setComment(`${attack.name} à trouvé un senzu !!!`);
      const recoveryAmount = Math.floor(attack.stamina * 0.2);
      setStamina1(prevStamina => Math.min(attack.stamina, prevStamina + recoveryAmount));
    } else {
      setComment(`${attack.name} à trouvé un senzu !!!`);
      const recoveryAmount = Math.floor(defender.stamina * 0.2);
      setStamina2(prevStamina => Math.min(defender.stamina, prevStamina + recoveryAmount));
    }
    damage = 0;
  } else {
    damage = damageManagement(attack, defender);
    setComment(`L'attaque ${selectedTechnique} de ${attack.name}`);
  }

  if (defender === opponent) {
    setStamina2(prevStamina => Math.max(0, prevStamina - damage));
  } else {
    setStamina1(prevStamina => Math.max(0, prevStamina - damage));
  }

  if (!isAttacking) {
    setTurn(turn + 1);
  }
}


  function damageManagement(first, second) {
    return (first.strenght - second.defense) * 3;
  }

  function damageCritique(first, second) {
    return (first.strenght - second.defense) * 8;
  }
  function damageSuperCritique(first, second) {
    return (first.strenght - second.defense) * 11;
  }
  function Senzu(first) {
    return (first.stamina * 10);
  }

  function randChance() {
    return Math.floor(Math.random()*6) + 1;
  }

  return (
    <div className="figth">
      <Header location={redirect}></Header>
      <div className="test">
        {character && (
          <div className="numberOne">
            <img src={character.picture} alt={character.name} />
            <h4>Point de vie de {character.name}</h4>
            <div className="progress-bar">
              <div className={`progress ${stamina1 / character.stamina > 0.7 ? 'green' : stamina1 / character.stamina > 0.3 ? 'yellow' : 'red'}`} style={{ width: `${parseInt((stamina1 / character.stamina) * 100)}%` }}></div>
            </div>
          </div>
        )}
        <h2>Vous êtes au tour {turn} <br/>{comment}</h2>
        
        {opponent && (
          <div className="numberTwo">
            <img src={opponent.picture} alt={opponent.name} />
            <h4>Point de vie de {opponent.name}</h4>
            <div className="progress-bar">
              <div className={`progress ${stamina2 / opponent.stamina >= 0.7 ? 'green' : stamina2 / opponent.stamina >= 0.3 ? 'yellow' : 'red'}`} style={{ width: `${parseInt((stamina2 / opponent.stamina) * 100)}%` }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="containerTechniques">
        {character && Array.isArray(character.techniques) ? (
          character.techniques.map((technique, index) => (
            <div key={index} className="techniques">
              <button onClick={() => { goFight2(technique); }}>{technique}</button>
            </div>
          ))
        ) : (
          <div className="noTechniquesMessage">Aucune technique disponible</div>
        )}
      </div>
    </div>
  );
};

export default Fight;
