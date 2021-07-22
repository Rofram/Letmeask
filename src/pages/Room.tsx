import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/button';
import { RoomCode } from '../components/RoomCode';

import LogoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswer: boolean;
  isHighlight: boolean;
}>;

type Questions = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswer: boolean;
  isHighlight: boolean;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');
  

  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlight: value.isHighlight,
          isAnswer: value.isAnswer
        }
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  async function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('you must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlight: false,
      isAnswer: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="letmeask logo" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} { questions.length < 2 ? 'pergunta' : 'perguntas'}</span> }
        </div>

        <form onSubmit={handleSendNewQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}