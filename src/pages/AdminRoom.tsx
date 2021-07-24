import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../components/button';
import { RoomCode } from '../components/RoomCode';

import LogoImg from '../assets/images/logo.svg';
import DeleteImg from'../assets/images/delete.svg';

import { useRoom } from '../hooks/useRoom';
import { Question } from '../components/Question';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();

  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  }

  async function handleDeleteMessage(questionId:string) {
    if (window.confirm('tem certeza que você quer deletar essa mensagem?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="letmeask logo" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} { questions.length < 2 ? 'pergunta' : 'perguntas'}</span> }
        </div>

        <div className="question-list">
          {questions.map(question => (
            <Question 
              author={question.author} 
              content={question.content} 
              key={question.id} 
            >
              <button
                type="button"
                onClick={() => handleDeleteMessage(question.id)}
              >
                <img src={DeleteImg} alt="remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}