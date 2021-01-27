import React from 'react';
import { useRouter } from 'next/router';

function Quiz() {
  const router = useRouter();

  return (
    <h1 style={{ color: '#000' }}>
      {`Bora responder o quiz, ${router.query.name} ?`}
    </h1>
  );
}

export default Quiz;
