import { useState } from 'react';
import { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';

import { Button } from '../components/button';
import { database } from '../services/firebase';

import '../styles/auth.scss';


export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Ilustração simbolizando troca de perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={LogoImg} alt="Letmeask" />
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala 
            </Button>
          </form>
          <p>Quer entrar numa sala já existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}