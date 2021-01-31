import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import db from '../db.json';

import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';
import Link from '../src/components/Link';

function Home() {
  const router = useRouter();

  const [name, setName] = useState('');

  const submit = useCallback((event) => {
    event.preventDefault();
    router.push(`/quiz?name=${name}`);
  }, [name]);

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />

        <Widget
          as={motion.section}
          transition={{ delay: 0, duration: 0.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>

          <Widget.Content>
            <form onSubmit={(event) => submit(event)}>
              <Input
                name="username"
                placeholder="Digite seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <Button type="submit" disabled={name.length === 0}>
                {`Jogar ${name}`}
              </Button>
            </form>
          </Widget.Content>
        </Widget>

        <Widget
          as={motion.section}
          transition={{ delay: 0.5, duration: 0.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>
              Quiz da galera
            </h1>

            <ul>
              {db.external.map((externalQuiz) => {
                const [project, user] = externalQuiz.replace('https://', '').replace('.vercel.app/', '').split('.');

                return (
                  <li key={externalQuiz}>
                    <Widget.Topic as={Link} href={`/quiz/${project}__${user}`}>
                      {`${user}/${project}`}
                    </Widget.Topic>
                  </li>
                );
              })}
            </ul>
          </Widget.Content>
        </Widget>

        <Footer
          as={motion.section}
          transition={{ delay: 1, duration: 0.5 }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        />
      </QuizContainer>

      <GitHubCorner projectUrl="https://github.com/Luanfv" />
    </QuizBackground>
  );
}

export default Home;
