import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-web';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import loading from '../../assets/animations/loading.json';

import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <Lottie
          options={{
            animationData: loading,
          }}
        />
      </Widget.Content>
    </Widget>
  );
}

function ResultsWidget({ results }) {
  const points = useMemo(
    () => results.reduce((total, result) => total + (result ? 1 : 0), 0),
    [results],
  );
  const router = useRouter();

  return (
    <Widget
      as={motion.section}
      transition={{ delay: 0, duration: 1 }}
      variants={{
        show: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      initial="hidden"
      animate="show"
    >
      <Widget.Header>
        Tela de resultado
      </Widget.Header>

      <Widget.Content>
        <p>
          {`${router.query.name}, você acertou ${points} perguntas de ${results.length}!`}
        </p>
        <ul>
          {
            results.map((result, key) => (
              <li>
                {`#${key + 1} Resultado: ${result ? 'Acertou' : 'Errou'}`}
              </li>
            ))
          }
        </ul>

        <Button onClick={router.back}>
          Voltar para Home
        </Button>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);

  const questionId = useMemo(() => `question__${questionIndex}`, [questionIndex]);
  const isCorrect = useMemo(
    () => selectedAlternative === question.answer,
    [selectedAlternative, question],
  );
  const hasAlternativeSelected = useMemo(
    () => selectedAlternative !== undefined,
    [selectedAlternative],
  );

  return (
    <Widget
      as={motion.section}
      transition={{ delay: 0, duration: 0.7 }}
      variants={{
        show: { opacity: 1, y: '0' },
        hidden: { opacity: 0, y: '100%' },
      }}
      initial="hidden"
      animate="show"
    >
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);

            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 2500);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
        </AlternativesForm>

        {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
        {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({ externalQuestions, externalBg }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([]);

  const totalQuestions = useMemo(() => externalQuestions.length, [externalQuestions]);
  const questionIndex = useMemo(() => currentQuestion, [currentQuestion]);
  const question = useMemo(
    () => externalQuestions[questionIndex],
    [externalQuestions, questionIndex],
  );
  const bg = useMemo(() => externalBg, [externalBg]);

  useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  const addResult = useCallback((result) => {
    setResults([...results, result]);
  }, [results]);

  const handleSubmitQuiz = useCallback(() => {
    const nextQuestion = questionIndex + 1;

    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);

      return;
    }

    setScreenState(screenStates.RESULT);
  }, [questionIndex, totalQuestions]);

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultsWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}

QuestionWidget.propTypes = {
  question: PropTypes.func.isRequired,
  questionIndex: PropTypes.string.isRequired,
  totalQuestions: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  addResult: PropTypes.func.isRequired,
};

ResultsWidget.propTypes = {
  results: PropTypes.isRequired,
};

QuizPage.propTypes = {
  externalQuestions: PropTypes.isRequired,
  externalBg: PropTypes.string.isRequired,
};
