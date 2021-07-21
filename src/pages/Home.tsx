import { useHistory } from 'react-router-dom';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';
import GoogleIcon from '../assets/images/google-icon.svg';

import { Button } from '../components/button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  const history = useHistory();
  const { user, signinWithGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signinWithGoogle();
    }
    history.push('/rooms/new');
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
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={GoogleIcon} alt="logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre um uma sala</div>
          <form>
            <input 
              type="text" 
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Entrar na sala 
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}