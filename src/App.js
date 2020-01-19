import React, { useEffect, useState } from "react";
import "./gobal.css";
import "./App.css";
import "./SideBar.css";
import "./Main.css";
import api from "./services/api";

function App() {
  const [devs, setDevs] = useState([]);
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      }, {
        timeout: 30000
      }
    );
  }, 
  []);

  useEffect(() => {
    async function loadDevs () {
      const response = await api.get('devs');
      setDevs(response.data);
    }
    loadDevs();
  }, 
  []);

  async function handleAddDev (e) {
    e.preventDefault();

    await api.post("/devs", {
      github_username,
      techs,
      latitude,
      longitude
    })
    setTechs('');
    setGithubUsername('');

  }
  return (
    <div id="app">
      <aside>
        <strong> Cadastrar</strong>
        <form>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input 
             name="github_username"
             id="github_username" 
             required 
             value={github_username}
             onChange={e => setGithubUsername(e.target.value)}
             />
          </div>
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input name="techs" id="techs" required value={techs}
            onChange={e => setTechs(e.target.value)} />
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input type="number" name="latitude" id="latitude" required value={latitude}  onChange={ e => setLatitude(e.target.value)}/>
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input type="number" name="longitude" id="longitude" required value={longitude} onChange={ e => setLongitude(e.target.value)} />
            </div>
          </div>
          <button type="submit" onClick={(e) => handleAddDev(e)}>Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li className="dev-item">
            <header>
              <img
                src={dev.avatar_url}
                alt="avatar-git"
              />
              <div className="user-info">
                <strong>{dev.name}</strong>
                <span>{dev.techs.join(", ")}</span>
              </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`} target="_black">Acessar link Github</a>
          </li>
          ))}
          
            
        </ul>
      </main>
    </div>
  );
}

export default App;
