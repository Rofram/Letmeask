import { Link } from 'react-router-dom';

// import { useAuth } from '../hooks/useAuth';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';

import { Button } from '../components/button';

import '../styles/auth.scss';

export function NewRoom() {
  // const { user } = useAuth();


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
          <form>
            <input 
              type="text" 
              placeholder="Nome da sala"
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