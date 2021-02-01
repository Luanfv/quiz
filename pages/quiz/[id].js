import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizScreen from '../../src/screens/Quiz';

function OthersQuizPage({ dbExterno }) {
  return (
    <ThemeProvider theme={dbExterno.theme}>
      <QuizScreen
        externalQuestions={dbExterno.questions}
        externalBg={dbExterno.bg}
      />
    </ThemeProvider>
  );
}

export async function getServerSideProps({ query }) {
  const [project, user] = query.id.split('__');
  const link = `https://${project}.${user}.vercel.app/api/db`;
  const dbExterno = await fetch(link)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error('Falha em pegar os dados');
    });
    // .then((response) => response)
    // .catch((err) => {
    //   console.error(err);
    // });

  return {
    props: {
      dbExterno,
    },
  };
}

export default OthersQuizPage;
