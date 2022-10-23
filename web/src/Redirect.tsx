import React, { useEffect } from 'react';

const Redirect: React.FC = () => {
  useEffect(() => {
    window.setTimeout(() => {
      window.location.replace('/');
    }, 1000);
  }, []);
  return <div>Redirecting ...</div>;
};

export default Redirect;
