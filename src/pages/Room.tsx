import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/button';
import { RoomCode } from '../components/RoomCode';

import LogoImg from '../assets/images/logo.svg';
import { ReactComponent as LikeSvg} from '../assets/images/like.svg';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { Question } from '../components/Question';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);


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

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(
        `rooms/${roomId}/questions/${questionId}/likes/${likeId}`
        ).remove();
    } else {
      await database.ref(
        `rooms/${roomId}/questions/${questionId}/likes`
        ).push({
          authorId: user?.id,
        });
    }
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

        <div className="question-list">
          {questions.map(question => (
            <Question 
              author={question.author} 
              content={question.content} 
              key={question.id} 
            >
              <button 
                className={`like-button ${ question.likeId && 'liked' }`}
                type="button"
                aria-label="Marca como gostei"
                onClick={() => handleLikeQuestion(question.id, question.likeId)}
              >
                { question.likeCount > 0 && <span>{question.likeCount}</span> }
                <LikeSvg />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}