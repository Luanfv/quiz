import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';

import QuizScreen from '../../src/screens/Quiz';

function OthersQuizPage({ dbExterno }) {
  const router = useRouter();

  useEffect(() => {
    if (!dbExterno) router.back();
  }, [router]);

  if (dbExterno) {
    return (
      <ThemeProvider theme={dbExterno.theme}>
        <QuizScreen
          externalQuestions={dbExterno.questions}
          externalBg={dbExterno.bg}
          colors={dbExterno.theme.colors}
        />
      </ThemeProvider>
    );
  }

  return <div />;
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
    })
    .catch(() => false);

  return {
    props: {
      dbExterno,
    },
  };
}

OthersQuizPage.propTypes = {
  dbExterno: PropTypes.isRequired,
};

export default OthersQuizPage;
